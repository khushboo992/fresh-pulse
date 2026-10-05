"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function ShoppingNavbar({
  cartCount = 0,
  searchQuery = "",
  onSearchChange,
  onOpenCart,
  showSearch = true,
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const handleClearSearch = () => {
    if (onSearchChange) onSearchChange("");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/95 border-b border-slate-800 px-3 py-2.5 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            className="text-lg sm:text-2xl font-black text-emerald-400 shrink-0 flex items-center gap-1 tracking-tight"
          >
            <span>FreshPulse</span>
            <span className="text-base sm:text-xl">🥦</span>
          </Link>

          {/* Center: Search Bar */}
          {showSearch && (
            <div className="flex-1 min-w-[100px] max-w-xs sm:max-w-md mx-1 relative">
              <div className="relative flex items-center w-full">
                <svg
                  className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    onSearchChange && onSearchChange(e.target.value)
                  }
                  placeholder="Search..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 text-slate-400 hover:text-slate-100 p-1 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right: Actions + Mobile 3-Dot Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Cart Button */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-100 cursor-pointer flex items-center justify-center min-w-[36px] h-[36px]"
                aria-label="Basket"
              >
                <span className="text-sm">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-400 text-slate-950 text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Avatar (Desktop) */}
            {user && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden md:flex p-0.5 rounded-full border-2 border-emerald-400 cursor-pointer items-center justify-center shrink-0"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Avatar"}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 font-black flex items-center justify-center text-xs">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                )}
              </button>
            )}

            {/* Mobile 3-Dot Navigation Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-800 rounded-xl border border-slate-800 text-slate-100 font-extrabold text-lg min-w-[36px] h-[36px] flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? "✕" : "⋮"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-slate-900 border-b border-slate-800 p-5 shadow-2xl flex flex-col gap-3 text-base font-bold text-slate-100 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase font-black text-slate-400 tracking-wider">
                Navigation
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 hover:bg-slate-800 active:bg-slate-800 rounded-xl flex items-center gap-3 transition"
            >
              <span>🏠</span> Home
            </Link>
            <Link
              href="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 hover:bg-slate-800 active:bg-slate-800 rounded-xl flex items-center gap-3 transition"
            >
              <span>🥦</span> Store & Produce
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 hover:bg-slate-800 active:bg-slate-800 rounded-xl flex items-center gap-3 transition"
            >
              <span>📦</span> My Orders
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 hover:bg-slate-800 active:bg-slate-800 rounded-xl flex items-center gap-3 transition"
            >
              <span>ℹ️</span> About
            </Link>

            <div className="border-t border-slate-800 pt-4 mt-2">
              {user ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full bg-rose-500/10 text-rose-400 border border-rose-500/20 py-3 rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  Sign Out ({user.name || user.email})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-emerald-400 text-slate-950 text-center py-3 rounded-xl text-xs font-black"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
