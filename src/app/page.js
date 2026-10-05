"use client";

import MainNavbar from "@/components/MainNavbar";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";

export default function HomePage() {
  const teamMembers = [
    {
      name: "Khushboo Rawat",
      role: "Founder & Lead Developer",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Aarav Sharma",
      role: "Supply Chain Head",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Priya Patel",
      role: "Quality Assurance",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    "https://plus.unsplash.com/premium_photo-1681826507324-0b3c43928753?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80",
  ];

  const reviews = [
    {
      name: "Rahul M.",
      text: "The organic mangoes were so fresh! Delivered within 90 minutes.",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      name: "Ananya S.",
      text: "Love the AI recipe search feature on the Services page. Super convenient.",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      name: "Vikram K.",
      text: "Top quality fruits and packaging. Highly recommended!",
      rating: "⭐⭐⭐⭐⭐",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <MainNavbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-20">
        {/* 1. Hero Carousel */}
        <section>
          <HeroCarousel />
        </section>

        {/* 2. Services Callout Banner */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Shop Fresh Produce?
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg mb-6">
            Explore our categories, daily top deals, and use natural language AI
            search to find all your ingredients.
          </p>
          <Link
            href="/services"
            className="inline-block bg-slate-950 hover:bg-slate-900 text-emerald-400 font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg"
          >
            Go to Services & Shop Now ➔
          </Link>
        </section>

        {/* 3. About Section */}
        <section
          id="about"
          className="scroll-mt-24 bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12"
        >
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
              About FreshPulse
            </span>
            <h2 className="text-3xl font-bold text-white">
              Directly From Local Organic Farms to Your Doorstep
            </h2>
            <p className="text-slate-400 leading-relaxed">
              FreshPulse was built with a simple mission: eliminating long
              supply chains to bring farm-fresh organic fruits, vegetables, and
              daily dairy products to urban homes within 2 hours of harvesting.
            </p>
          </div>
        </section>

        {/* 4. Team Section */}
        <section id="team" className="scroll-mt-24">
          <div className="text-center mb-10">
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
              Our Leadership
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">
              Meet the FreshPulse Team
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-emerald-400"
                />
                <h3 className="font-bold text-lg text-white">{member.name}</h3>
                <p className="text-sm text-emerald-400">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Gallery Section */}
        <section id="gallery" className="scroll-mt-24">
          <div className="text-center mb-10">
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
              Farm Sourcing
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">
              Our Produce Gallery
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="h-48 rounded-2xl overflow-hidden border border-slate-800"
              >
                <img
                  src={img}
                  alt="Gallery item"
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 6. Customer Reviews */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
              Testimonials
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between"
              >
                <p className="text-slate-300 text-sm mb-4">"{rev.text}"</p>
                <div>
                  <div className="text-xs mb-1">{rev.rating}</div>
                  <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        © 2026 FreshPulse Store Inc. All rights reserved.
      </footer>
    </div>
  );
}
