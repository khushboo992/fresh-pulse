import { auth } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { NextResponse } from "next/server";

// Helper function to determine order status based on elapsed time
function calculateStatus(createdAtStr) {
  const orderTime = new Date(createdAtStr).getTime();
  const now = new Date().getTime();
  const diffInMinutes = (now - orderTime) / (1000 * 60);

  if (diffInMinutes >= 120) return "Delivered";
  if (diffInMinutes >= 60) return "Out for Delivery";
  if (diffInMinutes >= 15) return "Packed & Ready";
  return "Processing";
}

export async function GET() {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || "guest@freshpulse.com";

    // 1. Fetch user orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false });

    if (ordersError) throw ordersError;

    if (!orders || orders.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Identify orders needing a status update in Supabase
    const updatePromises = orders.map(async (order) => {
      const newStatus = calculateStatus(order.created_at);

      // Only update Supabase if the status actually changed
      if (order.status !== newStatus) {
        await supabase
          .from("orders")
          .update({ status: newStatus })
          .eq("id", order.id);

        return { ...order, status: newStatus };
      }
      return order;
    });

    const updatedOrders = await Promise.all(updatePromises);

    // 3. Fetch corresponding order_items
    const orderIds = updatedOrders.map((o) => o.id);
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);

    if (itemsError) console.error("Error fetching items:", itemsError.message);

    // 4. Map line items to each updated order
    const ordersWithItems = updatedOrders.map((order) => ({
      ...order,
      order_items: (items || []).filter((item) => item.order_id === order.id),
    }));

    return NextResponse.json(ordersWithItems);
  } catch (err) {
    console.error("Get Orders Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
