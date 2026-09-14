import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_DATA } from '../data/menuData';
import { Search, X, LayoutGrid, Flame, CookingPot, Sparkles, Egg, Salad, Coffee, Cookie, Package, Utensils, Droplet } from 'lucide-react';

const iconMap = {
  LayoutGrid,
  Flame,
  CookingPot,
  Sparkles,
  Egg,
  Salad,
  Coffee,
  Cookie,
  Package,
  Utensils,
  Droplet
};

export function CategoryNav({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeTag,
  onSelectTag
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="mb-4 sm:mb-6">
      {/* 
        SECTION 1: Non-Sticky Search & Quick Filters
        Placed above the category bar in normal flow so it naturally scrolls away on mobile,
        freeing up maximum vertical screen height for food items.
      */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-2.5">
        {/* Quick Tag Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          <button
            type="button"
            onClick={() => onSelectTag(activeTag === 'hit' ? null : 'hit')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
              activeTag === 'hit'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-xs ring-1 ring-amber-400'
                : 'bg-white dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E]'
            }`}
          >
            <span>🔥</span>
            <span>Хіти продажу</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTag(activeTag === 'spicy' ? null : 'spicy')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
              activeTag === 'spicy'
                ? 'bg-rose-500 text-white font-black shadow-xs ring-1 ring-rose-400'
                : 'bg-white dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E]'
            }`}
          >
            <span>🌶️</span>
            <span>З гостринкою</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTag(activeTag === 'veg' ? null : 'veg')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
              activeTag === 'veg'
                ? 'bg-emerald-500 text-white font-black shadow-xs ring-1 ring-emerald-400'
                : 'bg-white dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E]'
            }`}
          >
            <span>🧀</span>
            <span>Сирні</span>
          </button>

          {activeTag && (
            <button
              type="button"
              onClick={() => onSelectTag(null)}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline px-2 font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              Скинути
            </button>
          )}
        </div>

        {/* Live Search Input (Normal Page Flow) */}
        <div className="relative w-full sm:w-72 shrink-0 group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none group-focus-within/search:text-amber-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Знайти улюблену страву..."
            className="w-full pl-8 pr-7 py-1.5 sm:py-2 rounded-xl text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-glovo-yellow transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
              aria-label="Очистити пошук"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 
        SECTION 2: Ultra-Compact Sticky Category Bar (Glovo/Wolt Standard)
        Only a single sleek row of pills (~40px) sticks to top-14 (56px) on mobile.
        Leaves 85%+ of screen space completely dedicated to dishes.
      */}
      <div className="sticky top-14 sm:top-16 z-30 -mx-3.5 sm:-mx-6 lg:-mx-8 px-3.5 sm:px-6 lg:px-8 bg-[#F8F9FA]/95 dark:bg-[#09090B]/95 backdrop-blur-md py-1.5 sm:py-2 border-y border-zinc-200/80 dark:border-[#23232E] transition-colors shadow-xs">
        <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
          
          {/* Scrollable Category Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
            {MENU_DATA.categories.map(cat => {
              const IconComp = iconMap[cat.icon] || LayoutGrid;
              const isActive = cat.id === activeCategory;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.id);
                    if (searchQuery) onSearchChange('');
                  }}
                  className={`h-8 sm:h-9 px-3 sm:px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-glovo-yellow text-zinc-950 shadow-xs ring-1 ring-amber-400/60'
                      : 'bg-white dark:bg-[#141418] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1E1E28] border border-zinc-200/90 dark:border-[#23232E]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.name}</span>
                </button>
              );
            })}

            {/* If an active tag is selected, show indicator chip in sticky bar */}
            {activeTag && (
              <button
                type="button"
                onClick={() => onSelectTag(null)}
                className="h-8 sm:h-9 px-2.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-400/30 flex items-center gap-1 shrink-0 cursor-pointer"
                title="Скинути фільтр"
              >
                <span>{activeTag === 'hit' ? '🔥 Хіти' : activeTag === 'spicy' ? '🌶️ Гострі' : '🧀 Сирні'}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Sticky Search Toggle on Mobile */}
          <div className="relative shrink-0 sm:hidden">
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                isSearchOpen || searchQuery
                  ? 'bg-glovo-yellow text-zinc-950 border-amber-400'
                  : 'bg-white dark:bg-[#141418] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#23232E]'
              }`}
              aria-label="Швидкий пошук"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Collapsible Search Input inside Sticky Bar (Mobile Only) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-2 sm:hidden overflow-hidden"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Пошук у меню..."
                  className="w-full pl-8 pr-8 py-1.5 rounded-xl text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-glovo-yellow"
                />
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
export default CategoryNav;
