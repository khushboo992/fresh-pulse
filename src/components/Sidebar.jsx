"use client";

import Link from "next/link";

export default function Sidebar({
  activeCategory,
  onSelectCategory,
  products = [],
}) {
  const getCategoryCount = (categoryId) => {
    if (categoryId === "top-deals") {
      return products.filter((p) => p.is_top_deal || p.isDeal).length;
    }

    return products.filter((p) => {
      const cat = (p.category || "").toLowerCase().trim();
      if (categoryId === "vegetables" || categoryId === "veggies") {
        return cat === "vegetables" || cat === "veggies" || cat === "vegetable";
      }
      return cat === categoryId;
    }).length;
  };

  const categories = [
    { id: "top-deals", name: "🔥 Top Deals", label: "Deals" },
    { id: "fruits", name: "🍎 Fresh Fruits", label: "Items" },
    { id: "vegetables", name: "🥦 Vegetables", label: "Items" },
    { id: "dairy", name: "🥛 Dairy & Eggs", label: "Items" },
    { id: "bakery", name: "🍞 Bakery & Bread", label: "Items" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto border-slate-800 p-6 flex flex-col justify-between shrink-0 hidden md:flex">
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Categories
        </h2>
        <nav className="space-y-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const liveCount = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-400 text-slate-950 font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="truncate text-left">{cat.name}</span>
                <span
                  className={`text-xs shrink-0 whitespace-nowrap ${
                    isActive
                      ? "text-slate-900 font-extrabold"
                      : "text-slate-500"
                  }`}
                >
                  {liveCount} {cat.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Account & History
        </h2>
        <Link
          href="/orders"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <span>📦</span>
          <span>My Orders</span>
        </Link>
      </div>
    </aside>
  );
}
