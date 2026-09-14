import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MarqueeRibbon } from './components/MarqueeRibbon';
import { CategoryNav } from './components/CategoryNav';
import { DishCard } from './components/DishCard';
import { DishModal } from './components/DishModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CartCheckoutPage } from './components/CartCheckoutPage';
import { SuccessModal } from './components/SuccessModal';
import { LocationInfo } from './components/LocationInfo';
import { Footer } from './components/Footer';
import { MENU_DATA } from './data/menuData';
import { ShoppingBag, ChevronRight, Check, Search, X } from 'lucide-react';

import { PromoBanners } from './components/PromoBanners';

export function App() {
  const { itemCount, subtotal, currentPage, navigateTo, toastMessage } = useCart();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items
  let filteredItems = MENU_DATA.items;

  if (activeCategory !== 'all') {
    filteredItems = filteredItems.filter(i => i.category === activeCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredItems = filteredItems.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.shortDesc.toLowerCase().includes(q) ||
      (i.desc && i.desc.toLowerCase().includes(q))
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-glovo-yellow selection:text-zinc-950 bg-[#F8F9FA] dark:bg-[#09090B] text-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      <Header />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentPage === 'menu' ? (
            <motion.div
              key="page-menu"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Hero />
              <PromoBanners
                onSelectCategory={(catId) => {
                  setActiveCategory(catId);
                  setActiveTag(null);
                  setSearchQuery('');
                  const el = document.getElementById('menu-catalog');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
              <MarqueeRibbon />

              {/* Menu Title and Search Bar Row */}
              <div className="pt-6 sm:pt-10 pb-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
                  <div>
                    <span className="text-xs font-black text-amber-500 uppercase tracking-wider block mb-1">
                      Швидке замовлення їжі
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 dark:text-white">
                      Меню ресторану
                    </h2>
                  </div>

                  {/* Search Bar (In menu title header so categories have 100% width and never go under search) */}
                  <div className="relative w-full sm:w-72 md:w-80 group/search">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-focus-within/search:text-amber-500 transition-colors" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Знайти улюблену страву..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-glovo-yellow transition-all shadow-xs"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                        aria-label="Очистити пошук"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sticky Category Bar (Full width, follows scroll, never clips edges) */}
              <CategoryNav
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />

              <section id="menu-catalog" className={`pt-2 sm:pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${itemCount > 0 ? 'pb-24 lg:pb-12' : 'pb-12'}`}>

                {filteredItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white mb-2">
                      Страв не знайдено
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-sm mx-auto">
                      Спробуйте змінити пошуковий запит.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory('all');
                        setSearchQuery('');
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-glovo-yellow text-zinc-950 text-xs font-bold shadow-sm cursor-pointer"
                    >
                      Показати всі страви
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredItems.map(dish => (
                      <DishCard key={dish.id} dish={dish} />
                    ))}
                  </div>
                )}
              </section>

              <LocationInfo />
            </motion.div>
          ) : (
            <motion.div
              key="page-checkout"
              initial={{ opacity: 0, y: 24, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.99, transition: { duration: 0.25 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <CartCheckoutPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Floating Mobile Cart Bar (Glovo style) - only shown on menu page */}
      {itemCount > 0 && currentPage === 'menu' && (
        <div className="fixed bottom-4 inset-x-3.5 z-30 lg:hidden">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigateTo('checkout')}
            className="w-full h-14 bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 rounded-2xl shadow-xl flex items-center justify-between px-4 sm:px-5 font-bold cursor-pointer btn-glow-yellow select-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-zinc-950 text-white text-xs font-black flex items-center justify-center shrink-0">
                {itemCount}
              </span>
              <span className="font-display font-black text-sm whitespace-nowrap">Оформити замовлення</span>
            </div>
            
            <div className="flex items-center gap-1 font-display font-black text-base shrink-0 whitespace-nowrap">
              <span>{subtotal} ₴</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.button>
        </div>
      )}

      {/* Modals */}
      <DishModal />
      <SuccessModal />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-castiron-950 text-white shadow-xl text-xs font-semibold border border-castiron-800">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
