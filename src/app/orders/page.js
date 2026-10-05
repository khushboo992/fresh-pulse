"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ShoppingNavbar from "@/components/ShoppingNavbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <ShoppingNavbar cartCount={0} />

      <main className="max-w-4xl w-full mx-auto p-6 md:p-8 flex-1">
        <h1 className="text-3xl font-black mb-2">My Past Deliveries</h1>
        <p className="text-slate-400 text-sm mb-8">
          Track active orders and review your past produce receipts.
        </p>

        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl h-40 animate-pulse p-6"
              />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const createdDate = new Date(order.created_at);
              const orderDate = createdDate.toLocaleString();

              // Fallback: If estimated_delivery isn't explicitly set in DB, add 2 hours to created_at
              const deliveryTime = order.estimated_delivery
                ? new Date(order.estimated_delivery)
                : new Date(createdDate.getTime() + 2 * 60 * 60 * 1000);

              const deliveryDate = deliveryTime.toLocaleString();

              return (
                <div
                  key={order.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
                >
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider block">
                        Order ID
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {order.id}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-400/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/20">
                        {order.status || "Processing"}
                      </span>
                    </div>
                  </div>

                  {/* Dates Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 text-xs text-slate-400 gap-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500">Ordered On: </span>
                      <span className="text-slate-200 font-semibold">
                        {orderDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">
                        Estimated Delivery (+2 hrs):{" "}
                      </span>
                      <span className="text-emerald-400 font-bold">
                        {deliveryDate}
                      </span>
                    </div>
                  </div>

                  {/* Item List */}
                  <div className="space-y-3 pt-2">
                    {(order.order_items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                            <Image
                              src={item.image_url || "/placeholder.png"}
                              alt={item.product_name || "Produce Item"}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-200">
                              {item.product_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Qty: {item.quantity} × $
                              {Number(item.unit_price || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-emerald-400">
                          $
                          {(
                            item.quantity * Number(item.unit_price || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total Footer */}
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Amount Paid</span>
                    <span className="text-xl font-black text-emerald-400">
                      ${Number(order.total_amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-sm">
              You haven't placed any orders yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
