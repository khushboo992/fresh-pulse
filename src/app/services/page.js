"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ShoppingNavbar from "@/components/ShoppingNavbar";
import Sidebar from "@/components/Sidebar";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Chatbot from "@/components/Chatbot";
import { supabase } from "@/app/_lib/supabase";

const CATEGORIES = [
  { id: "top-deals", name: "🔥 Top Deals" },
  { id: "fruits", name: "🍎 Fruits" },
  { id: "vegetables", name: "🥦 Vegetables" },
  { id: "dairy", name: "🥛 Dairy & Eggs" },
  { id: "bakery", name: "🍞 Bakery" },
];

export default function ServicesPage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState("top-deals");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const fetchCartData = useCallback(async () => {
    try {
      const cartRes = await fetch(`/api/cart?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (cartRes.ok) {
        const backendCart = await cartRes.json();
        if (Array.isArray(backendCart)) {
          const normalized = backendCart.map((c) => ({
            id: c.id,
            item_id: c.item_id || c.items?.id,
            quantity: c.quantity,
            items: c.items || c,
          }));
          setCartItems(normalized);
        }
      }
    } catch (err) {
      console.error("Error refreshing cart:", err);
    }
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoadingProducts(true);

        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*");
        if (itemsError) throw itemsError;
        setProducts(itemsData || []);

        await fetchCartData();
      } catch (err) {
        console.error("Error initializing page data:", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadInitialData();
  }, [fetchCartData]);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("freshpulse_cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const showNotification = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  const handleAddToCart = async (product) => {
    try {
      showNotification(
        `Added ${product.name || product.title} to your basket!`,
      );

      setCartItems((prevItems) => {
        const targetId = product.id;
        const existingIndex = prevItems.findIndex(
          (item) => (item.item_id || item.items?.id || item.id) === targetId,
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
          };
          return updated;
        }

        return [
          ...prevItems,
          {
            id: `temp-${Date.now()}`,
            item_id: product.id,
            quantity: 1,
            items: product,
          },
        ];
      });

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: product.id, quantity: 1 }),
      });

      if (res.ok) {
        await fetchCartData();
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      await fetchCartData();
    }
  };

  const handleUpdateQuantity = async (cartItemId, delta) => {
    const targetItem = cartItems.find((item) => item.id === cartItemId);
    if (!targetItem) return;

    const newQty = targetItem.quantity + delta;

    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQty } : item,
      ),
    );

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: targetItem.item_id || targetItem.id,
          quantity: newQty,
        }),
      });
      await fetchCartData();
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== cartItemId),
    );

    try {
      await fetch(`/api/cart?id=${cartItemId}`, {
        method: "DELETE",
      });
      await fetchCartData();
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    const category = (product.category || "").toLowerCase().trim();
    const title = (product.name || product.title || "").toLowerCase();

    if (query.length > 0) {
      return title.includes(query) || category.includes(query);
    }

    const isTopDeal = product.is_top_deal || product.isDeal;
    const activeCat = activeCategory.toLowerCase().trim();

    if (activeCat === "top-deals") {
      return isTopDeal;
    }

    return (
      category === activeCat ||
      (activeCat === "vegetables" &&
        (category === "veggies" || category === "vegetable")) ||
      (activeCat === "veggies" &&
        (category === "vegetables" || category === "vegetable"))
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-x-hidden relative">
      <ShoppingNavbar
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="flex flex-1 min-h-[calc(100vh-60px)] w-full max-w-[100vw]">
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={(catId) => {
            setActiveCategory(catId);
          }}
          products={products}
        />

        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 text-white shadow-xl">
            <span className="bg-white/20 text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Special Discount
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black mt-2 mb-1">
              Top Deals on Fresh Produce
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Get up to 30% off on handpicked organic fruits, dairy items, and
              farm vegetables today!
            </p>
          </div>

          <div className="md:hidden sticky top-[53px] z-30 bg-slate-950/95 backdrop-blur py-2.5 -mx-3 px-3 border-b border-slate-800/80 mb-4 sm:mb-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSearchQuery("");
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 min-h-[36px] ${
                      isActive
                        ? "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-100 capitalize flex items-center gap-2">
              {searchQuery ? (
                <>
                  Search Results
                  <span className="text-xs font-normal text-slate-400 ml-1.5">
                    (Matching "{searchQuery}")
                  </span>
                </>
              ) : (
                activeCategory.replace("-", " ")
              )}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {filteredProducts.length} Items
            </span>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-2xl h-56 sm:h-72 animate-pulse p-3 flex flex-col justify-between"
                >
                  <div className="bg-slate-800 h-28 sm:h-40 rounded-xl mb-3" />
                  <div className="bg-slate-800 h-3 w-3/4 rounded" />
                  <div className="bg-slate-800 h-5 w-1/3 rounded mt-2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => {
                const title = product.name || product.title;
                const image = product.image_url || product.image;
                const unit = product.weight_quantity || product.unit;

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition cursor-pointer group"
                  >
                    <div>
                      <div className="h-32 sm:h-44 bg-slate-800 relative overflow-hidden">
                        <Image
                          src={image || "/placeholder.png"}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                        {unit && (
                          <span className="absolute top-2 left-2 bg-slate-950/80 text-emerald-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full z-10">
                            {unit}
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 sm:p-4">
                        <div className="text-[10px] sm:text-xs text-slate-400 mb-0.5">
                          ★ {product.rating || "5.0"}
                        </div>
                        <h3 className="font-bold text-slate-100 text-xs sm:text-base line-clamp-1">
                          {title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-4 pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-sm sm:text-xl font-black text-emerald-400">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-extrabold px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs transition active:scale-95 cursor-pointer w-full sm:w-auto text-center min-h-[34px] flex items-center justify-center"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400 text-xs sm:text-base mb-2">
                No produce found matching your search.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-emerald-400 hover:underline text-xs font-semibold cursor-pointer"
              >
                Clear active filters
              </button>
            </div>
          )}
        </main>
      </div>

      <Chatbot onCartUpdate={fetchCartData} />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />

      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}
