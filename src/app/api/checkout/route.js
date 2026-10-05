import { auth } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "guest@freshpulse.com";

    // 1. Fetch raw cart items for user
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("id, quantity, item_id")
      .eq("user_email", userEmail);

    if (cartError) throw cartError;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your basket is empty. Add items before checking out!" },
        { status: 400 },
      );
    }

    // 2. Fetch products matching item_ids
    const itemIds = cartItems.map((c) => c.item_id);
    const { data: products, error: productsError } = await supabase
      .from("items")
      .select("id, name, price, image_url")
      .in("id", itemIds);

    if (productsError) throw productsError;

    const productMap = new Map(products.map((p) => [p.id, p]));

    // 3. Calculate Total
    const subtotal = cartItems.reduce((sum, entry) => {
      const product = productMap.get(entry.item_id);
      return sum + Number(product?.price || 0) * entry.quantity;
    }, 0);

    const deliveryFee = 1.99;
    const totalAmount = subtotal + deliveryFee;

    // 4. Create Main Order Record
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_email: userEmail,
        total_amount: totalAmount,
        delivery_fee: deliveryFee,
        status: "Processing",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 5. Insert individual items into order_items table
    const orderItemsPayload = cartItems.map((entry) => {
      const product = productMap.get(entry.item_id);
      return {
        order_id: order.id,
        item_id: entry.item_id,
        product_name: product?.name || "Produce Item",
        unit_price: Number(product?.price || 0),
        quantity: entry.quantity,
        image_url: product?.image_url || "",
      };
    });

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (orderItemsError) {
      console.error("🔥 Error inserting order_items:", orderItemsError.message);
      return NextResponse.json(
        { error: orderItemsError.message },
        { status: 500 },
      );
    }

    // 6. Clear User Cart
    await supabase.from("cart_items").delete().eq("user_email", userEmail);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("Checkout Exception:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
