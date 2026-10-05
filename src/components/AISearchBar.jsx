"use client";

import { useState } from "react";

export default function AISearchBar({ onAISearchResults, onReset }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
      });

      const data = await res.json();
      if (res.ok) {
        onAISearchResults(data.matchingIds, prompt);
      }
    } catch (err) {
      console.error("Failed to run AI search:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    onReset();
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-2xl mx-auto mb-8"
    >
      <div className="relative flex items-center bg-slate-900 border border-emerald-500/30 rounded-2xl p-2 shadow-xl focus-within:border-emerald-400 transition">
        <span className="text-xl px-3">✨</span>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI: 'Ingredients for guacamole' or 'Fresh berry smoothie'..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
        />
        {prompt && (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-500 hover:text-white text-xs px-2"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs transition shrink-0 ml-2"
        >
          {isLoading ? "Analyzing..." : "AI Search"}
        </button>
      </div>
    </form>
  );
}
