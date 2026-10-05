"use client";

import { useState, useEffect } from "react";

const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80",
    title: "Farm Fresh Organic Fruits",
    subtitle:
      "Harvested daily and delivered to your doorstep in under 2 hours.",
  },
  {
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    title: "Pure Dairy & Fresh Produce",
    subtitle: "Directly sourced from trusted local organic farms.",
  },
  {
    url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
    title: "Handpicked Quality Groceries",
    subtitle: "Get top daily deals and discounts on essential pantry items.",
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.url}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-8 md:p-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2 drop-shadow">
              {slide.title}
            </h2>
            <p className="text-emerald-300 text-lg md:text-xl font-medium max-w-2xl">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Manual Slide Indicators */}
      <div className="absolute bottom-4 right-8 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-3 rounded-full transition-all ${
              idx === currentIndex ? "w-8 bg-emerald-400" : "w-3 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
