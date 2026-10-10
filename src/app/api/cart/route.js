import { NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "guest@freshpulse.com";

    const { data: cartData, error } = await supabase
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
          rating,
          category,
          image_url
        )
      `,
      )
      .eq("user_email", userEmail);

    if (error) throw error;

    return NextResponse.json(cartData || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "guest@freshpulse.com";
    const { itemId, quantity } = await req.json();

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_email", userEmail)
      .eq("item_id", itemId)
      .maybeSingle();

    if (existing) {
      const newQty = quantity !== undefined ? quantity : existing.quantity + 1;
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("cart_items").insert({
        user_email: userEmail,
        item_id: itemId,
        quantity: quantity || 1,
      });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "guest@freshpulse.com";

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("id");

    if (cartItemId) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId)
        .eq("user_email", userEmail);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_email", userEmail);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
