import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined in environment variables.");
  }
  return new Groq({ apiKey });
}

export async function POST(req) {
  console.log("🚀 --- NEW GROQ AI SEARCH REQUEST RECEIVED ---");

  try {
    const { query, message } = await req.json();
    const userInput = query || message || "";

    if (!userInput || userInput.trim() === "") {
      return NextResponse.json({ matchingIds: [] });
    }

    const session = await auth();
    const userEmail = session?.user?.email || "guest@freshpulse.com";

    const groq = getGroqClient();

    const modelListResponse = await groq.models.list();
    const availableModels = modelListResponse.data.map((m) => m.id);

    const selectedModel =
      availableModels.find((id) => id.includes("gpt-oss-20b")) ||
      availableModels.find((id) => id.includes("llama-3.1-8b")) ||
      availableModels.find((id) => id.includes("llama-3.3-70b")) ||
      availableModels[0];

    const { data: items, error: fetchError } = await supabase
      .from("items")
      .select("id, name, price, rating, category");

    if (fetchError) throw fetchError;

    const catalogSummary = items
      .map(
        (item) =>
          `ID: ${item.id} | Name: ${item.name} | Price: $${item.price} | Rating: ${
            item.rating || 5.0
          } | Category: ${item.category}`,
      )
      .join("\n");

    // 1. Defined Tools Array
    const tools = [
      {
        type: "function",
        function: {
          name: "add_to_cart",
          description:
            "ONLY call this when the user explicitly asks to add, buy, put, or purchase an item (e.g. 'add milk', 'buy 2 bananas', 'I want to add mangoes'). NEVER call this if the user simply types a product name or single keyword like 'milk' or 'mango' without an explicit action verb.",
          parameters: {
            type: "object",
            properties: {
              searchQuery: {
                type: "string",
                description: "Name of the item (e.g., 'banana', 'milk')",
              },
              quantity: {
                type: "number",
                description: "Quantity requested (default 1)",
              },
            },
            required: ["searchQuery"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "remove_from_cart",
          description:
            "Call this when the user asks to remove, delete, drop, or clear items from their cart.",
          parameters: {
            type: "object",
            properties: {
              searchQuery: {
                type: "string",
                description:
                  "Name of the specific item to remove (e.g. 'banana'). Leave empty or null if clearAll is true.",
              },
              clearAll: {
                type: "boolean",
                description:
                  "Set to true if the user explicitly asks to remove ALL items, clear cart, or empty basket.",
              },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "view_cart",
          description:
            "Call this when the user asks what is in their cart or asks for their cart total.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "view_top_rated",
          description:
            "Call this when the user asks for top rated, popular, best, or highly reviewed produce items in the store.",
          parameters: {
            type: "object",
            properties: {
              limit: {
                type: "number",
                description: "Number of top rated items to show (default: 4)",
              },
            },
          },
        },
      },
    ];

    // 2. Strict Intent Rules System Prompt
    const systemPrompt = `
You are FreshPulse AI, a smart, friendly, and concise grocery assistant.
User Email: ${userEmail}

Store Catalog:
${catalogSummary}

Rules:
1. ONLY execute 'add_to_cart' if the user explicitly says words like "add", "buy", "put in cart", "I want to add", etc.
2. If the user only types a product name (e.g. "milk", "mango", "curd") or asks a general question without explicitly asking to add it, DO NOT call 'add_to_cart'. Simply give details (price, rating, availability) and politely ask if they would like to add it to their basket.
3. NEVER use Markdown tables. Keep replies concise and conversational (1-3 sentences).
4. Format product mentions cleanly inline: **Product Name ($X.XX • ★X.X)**.
`;

    const chatCompletion = await groq.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
      tools: tools,
      tool_choice: "auto",
    });

    const responseMessage = chatCompletion.choices[0]?.message;
    const toolCalls = responseMessage?.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const functionName = toolCall.function.name;

      if (functionName === "add_to_cart") {
        const { searchQuery, quantity } = JSON.parse(
          toolCall.function.arguments,
        );

        const matchedItem = items.find((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        if (!matchedItem) {
          return NextResponse.json({
            reply: `Sorry, I couldn't find "${searchQuery}" in our store catalog.`,
            matchingIds: [],
          });
        }

        const { error: insertError } = await supabase.from("cart_items").upsert(
          {
            user_email: userEmail,
            item_id: matchedItem.id,
            quantity: quantity || 1,
          },
          { onConflict: "user_email, item_id" },
        );

        if (insertError) {
          return NextResponse.json({
            reply: "Failed to update your cart. Please try again.",
          });
        }

        return NextResponse.json({
          reply: `Added ${quantity || 1}x ${matchedItem.name} to your basket! 🧺 (Please refresh or check your cart drawer to see the changes)`,
          action: "REFRESH_CART",
          matchingIds: [matchedItem.id],
        });
      }

      if (functionName === "remove_from_cart") {
        const { searchQuery, clearAll } = JSON.parse(
          toolCall.function.arguments,
        );

        if (
          clearAll ||
          (!searchQuery && userInput.toLowerCase().includes("all"))
        ) {
          const { error: clearError } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_email", userEmail);

          if (clearError) {
            return NextResponse.json({
              reply: "Failed to clear your basket. Please try again.",
            });
          }

          return NextResponse.json({
            reply:
              "Cleared all items from your basket! 🧺 (Please refresh or check your cart drawer to see the changes)",
            action: "REFRESH_CART",
            matchingIds: [],
          });
        }

        if (searchQuery) {
          const matchedItem = items.find((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()),
          );

          if (!matchedItem) {
            return NextResponse.json({
              reply: `I couldn't find "${searchQuery}" in your catalog to remove.`,
              matchingIds: [],
            });
          }

          const { error: deleteError } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_email", userEmail)
            .eq("item_id", matchedItem.id);

          if (deleteError) {
            return NextResponse.json({
              reply: "Failed to remove the item from your cart.",
            });
          }

          return NextResponse.json({
            reply: `Removed ${matchedItem.name} from your basket. (Please refresh or check your cart drawer to see the changes)`,
            action: "REFRESH_CART",
            matchingIds: [],
          });
        }
      }

      if (functionName === "view_cart") {
        const { data: cartItems, error: cartError } = await supabase
          .from("cart_items")
          .select(
            `
            quantity,
            items!item_id (
              name,
              price
            )
          `,
          )
          .eq("user_email", userEmail);

        if (cartError || !cartItems || cartItems.length === 0) {
          return NextResponse.json({
            reply: "Your basket is currently empty!",
            matchingIds: [],
          });
        }

        const itemListText = cartItems
          .map(
            (c) =>
              `${c.quantity}x ${c.items.name} ($${(
                c.quantity * Number(c.items.price)
              ).toFixed(2)})`,
          )
          .join(", ");

        const totalCost = cartItems.reduce(
          (sum, c) => sum + c.quantity * Number(c.items.price),
          0,
        );

        return NextResponse.json({
          reply: `Your basket contains: ${itemListText}. Total: $${totalCost.toFixed(
            2,
          )}`,
          matchingIds: [],
        });
      }

      if (functionName === "view_top_rated") {
        const parsedArgs = toolCall.function.arguments
          ? JSON.parse(toolCall.function.arguments)
          : {};
        const limitCount = parsedArgs.limit || 4;

        const topRated = [...items]
          .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
          .slice(0, limitCount);

        const topRatedText = topRated
          .map(
            (i) =>
              `**${i.name} ($${Number(i.price).toFixed(2)} • ★${
                i.rating || "5.0"
              })**`,
          )
          .join(", ");

        return NextResponse.json({
          reply: `Here are our top-rated produce items: ${topRatedText}`,
          matchingIds: topRated.map((item) => item.id),
        });
      }
    }

    const matchingIds = items
      .filter(
        (item) =>
          userInput.toLowerCase().includes(item.name.toLowerCase()) ||
          userInput.toLowerCase().includes((item.category || "").toLowerCase()),
      )
      .map((item) => item.id);

    return NextResponse.json({
      reply:
        responseMessage?.content ||
        "Here are the matching items from our store catalog!",
      matchingIds,
    });
  } catch (error) {
    console.error("💥 GROQ AI ROUTE FAILURE:", error.message);
    return NextResponse.json(
      { error: "Failed to process message", details: error.message },
      { status: 500 },
    );
  }
}
