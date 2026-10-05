"use client";

import { useState } from "react";
import Image from "next/image";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  // Calculate cart subtotal dynamically
  const subtotal = cartItems.reduce((acc, item) => {
    const itemData = item.items || item;
    const price = Number(itemData.price || 0);
    return acc + price * item.quantity;
  }, 0);

  const deliveryFee = cartItems.length > 0 ? 1.99 : 0.0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      setIsCheckingOut(true);
      const res = await fetch("/api/checkout", { method: "POST" });
      const responseText = await res.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Server returned non-JSON response:", responseText);
        alert(
          "Server configuration or session error. Please check your API route setup.",
        );
        return;
      }

      if (res.ok) {
        alert("🎉 Order placed successfully! Estimated delivery in 2 hours 🚚");
        if (onClearCart) onClearCart(); // Clears local basket state instantly
        onClose();
      } else {
        alert(`Checkout failed: ${data.error || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to process checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-l border-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-lg font-black text-slate-100">Your Basket</h2>
            <span className="bg-emerald-400/10 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/20">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} Items
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl p-1 transition"
          >
            ✕
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((cartItem) => {
              const product = cartItem.items || cartItem;
              const title = product.name || product.title;
              const image = product.image_url || product.image;
              const price = Number(product.price || 0);

              return (
                <div
                  key={cartItem.id}
                  className="flex items-center justify-between gap-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                      <Image
                        src={image || "/placeholder.png"}
                        alt={title || "Product"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 line-clamp-1">
                        {title}
                      </h4>
                      <p className="text-xs font-extrabold text-emerald-400">
                        ${price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.id, -1)}
                        className="px-2 py-1 text-slate-300 hover:bg-slate-800 transition"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-100">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.id, 1)}
                        className="px-2 py-1 text-slate-300 hover:bg-slate-800 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(cartItem.id)}
                      className="text-slate-500 hover:text-rose-400 text-xs p-1 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <span className="text-4xl mb-3">🧺</span>
              <p className="text-slate-400 text-sm font-medium">
                Your shopping basket is empty.
              </p>
            </div>
          )}
        </div>

        {/* Footer Checkout Calculation */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-slate-950/40 space-y-3">
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200 font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery Fee</span>
                <span className="text-slate-200 font-semibold">
                  ${deliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-100 pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/10 active:scale-95"
            >
              {isCheckingOut
                ? "Placing Order..."
                : `Checkout Now ($${total.toFixed(2)})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
