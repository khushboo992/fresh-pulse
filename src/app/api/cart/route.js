import { auth } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { NextResponse } from "next/server";

// GET: Fetch user's cart items
export async function GET() {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "guest@freshpulse.com";

    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        item_id,
        items!item_id (
          id,
          name,
          price,
          image_url,
          weight_quantity,
          category
        )
      `,
      )
      .eq("user_email", userEmail);

    if (error) {
      console.error("Supabase GET Cart Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(cartItems || []);
  } catch (err) {
    console.error("GET Cart Exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Add/Update item in cart
export async function POST(req) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "guest@freshpulse.com";

    const { itemId, quantity } = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("cart_items")
      .upsert(
        {
          user_email: userEmail,
          item_id: itemId,
          quantity: quantity || 1,
        },
        { onConflict: "user_email, item_id" },
      )
      .select();

    if (error) {
      console.error("Supabase POST Cart Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST Cart Exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove item from cart
export async function DELETE(req) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "guest@freshpulse.com";

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("id");

    if (!cartItemId) {
      return NextResponse.json(
        { error: "id parameter is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("user_email", userEmail);

    if (error) {
      console.error("Supabase DELETE Cart Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE Cart Exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
