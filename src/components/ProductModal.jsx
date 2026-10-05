"use client";

import Image from "next/image";

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-white rounded-full border border-slate-800 transition"
        >
          ✕
        </button>

        {/* Product Image Panel */}
        <div className="md:w-1/2 h-64 md:h-auto bg-slate-800 relative min-h-[260px]">
          <Image
            src={product.image_url || "/placeholder.png"}
            alt={product.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.weight_quantity && (
            <span className="absolute top-4 left-4 bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {product.weight_quantity}
            </span>
          )}
        </div>

        {/* Product Info Panel */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400 text-sm font-bold">
                ★ {product.rating || "5.0"}
              </span>
              <span className="text-slate-500 text-xs">• Organic Sourced</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              {product.name}
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {product.description ||
                "Freshly harvested from certified local organic partner farms. Free of synthetic pesticides and chemicals."}
            </p>

            {/* Farm & Nutritional Details */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Origin Farm:</span>
                <span className="font-semibold text-slate-200">
                  {product.origin_farm || "Green Valley Organics"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shelf Life:</span>
                <span className="font-semibold text-slate-200">
                  {product.shelf_life || "3–5 Days"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Storage:</span>
                <span className="font-semibold text-slate-200">
                  {product.storage || "Keep refrigerated"}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Add to Cart Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Price</span>
              <span className="text-2xl font-black text-emerald-400">
                ${Number(product.price).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-500/10 active:scale-95"
            >
              + Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
