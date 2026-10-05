"use client";

import { useRef } from "react";

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder,
}) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onSearchChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-emerald-400/60 rounded-xl px-3.5 py-2.5 transition shadow-sm">
        {/* Search Icon */}
        <svg
          className="w-4 h-4 text-slate-400 shrink-0 mr-2.5"
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

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Search fruits, veggies, bakery..."}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition ml-1 shrink-0"
            aria-label="Clear search"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
