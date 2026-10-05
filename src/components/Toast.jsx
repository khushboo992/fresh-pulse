"use client";

import { useEffect } from "react";

export default function Toast({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-bounce">
      <span>🥦</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-slate-900 hover:text-slate-950 font-black text-xs"
      >
        ✕
      </button>
    </div>
  );
}
