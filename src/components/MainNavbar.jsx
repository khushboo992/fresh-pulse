"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import ThemeToggle from "./ThemeToggle";

export default function MainNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-800 dark:border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between text-slate-100">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-extrabold text-emerald-400 shrink-0"
        >
          FreshPulse 🥦
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-8 font-semibold text-slate-300">
          <Link href="/" className="hover:text-emerald-400 transition">
            HOME
          </Link>
          <Link href="#about" className="hover:text-emerald-400 transition">
            ABOUT
          </Link>
          <Link
            href="/services"
            className="hover:text-emerald-400 transition text-emerald-400 font-bold"
          >
            SERVICES
          </Link>
          <Link href="#team" className="hover:text-emerald-400 transition">
            TEAM
          </Link>
          <Link href="#gallery" className="hover:text-emerald-400 transition">
            GALLERY
          </Link>
        </nav>

        {/* <ThemeToggle /> */}

        {/* Mobile 3-Dots Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-100 font-extrabold text-xl min-w-[38px] h-[38px] items-center justify-center cursor-pointer shrink-0"
          aria-label="Toggle Mobile Menu"
        >
          {isMobileMenuOpen ? "✕" : "⋮"}
        </button>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col"
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
              className="p-3 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
            >
              🏠 HOME
            </Link>
            <Link
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
            >
              ℹ️ ABOUT
            </Link>
            <Link
              href="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition text-emerald-400 font-extrabold"
            >
              🥦 SERVICES
            </Link>
            <Link
              href="#team"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
            >
              👥 TEAM
            </Link>
            <Link
              href="#gallery"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
            >
              🖼️ GALLERY
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
