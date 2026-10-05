import { supabase } from "@/app/_lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query || query.trim() === "") {
      return NextResponse.json({ itemIds: [] });
    }

    // 1. Fetch available inventory from Supabase
    const { data: items, error } = await supabase
      .from("items")
      .select("id, name, category");

    if (error) throw error;

    // 2. Format catalog for the AI prompt
    const catalogSummary = items
      .map(
        (item) =>
          `ID: ${item.id} | Name: ${item.name} | Category: ${item.category}`,
      )
      .join("\n");

    // 3. Call OpenAI / Gemini to extract matching item IDs
    // Example structured prompt sent to OpenAI API:
    const systemPrompt = `You are an AI assistant for an organic grocery store. 
Given a user query (e.g. recipe name, diet preference, or dish), return a JSON array containing ONLY the IDs of products from the catalog that match or are necessary ingredients.

Catalog:
${catalogSummary}

User Query: "${query}"

Return JSON strictly in this format: { "matchingIds": ["id1", "id2"] }`;

    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: systemPrompt }],
          response_format: { type: "json_object" },
        }),
      },
    );

    const aiData = await aiResponse.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    return NextResponse.json({ matchingIds: result.matchingIds || [] });
  } catch (err) {
    console.error("AI Search Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
