"use client";

import { useState, useRef, useEffect } from "react";

export default function Chatbot({ cartId, onCartUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, cartId }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "Done!" },
      ]);

      if (data.action === "REFRESH_CART" && onCartUpdate) {
        await onCartUpdate(data);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold py-2.5 px-4 sm:py-3 sm:px-5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition text-xs sm:text-sm"
        >
          <span>💬</span>
          <span>AI Assistant</span>
        </button>
      ) : (
        <div className="w-[calc(100vw-1.5rem)] sm:w-80 h-[26rem] sm:h-[28rem] max-h-[80vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all">
          <div className="bg-emerald-600 text-white p-3 font-bold flex justify-between items-center text-xs sm:text-sm shrink-0">
            <div className="flex items-center gap-1.5">
              <span>🥦</span>
              <span>FreshPulse Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-80 p-1 cursor-pointer font-extrabold"
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs sm:text-sm">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-xs py-8 px-2">
                👋 Hi! Ask me to add items to your cart, check your total, or
                find recipes!
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed break-words ${
                  m.sender === "user"
                    ? "bg-emerald-600 text-white ml-auto rounded-br-none"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/60"
                }`}
              >
                {renderFormattedText(m.text)}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl w-fit">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 bg-slate-50 dark:bg-slate-900/50 shrink-0">
            <input
              type="text"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="e.g. Add 3 bananas..."
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
