import React from 'react';
import { motion } from 'framer-motion';
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
  return (
    <div className="sticky top-[84px] sm:top-[92px] z-30 bg-[#F8F9FA]/95 dark:bg-[#09090B]/95 backdrop-blur-md py-2 sm:py-3 mb-6 sm:mb-8 border-b border-zinc-200/90 dark:border-[#23232E] transition-colors">
      
      {/* Category Pills (Glovo / RnR clean style) with generous headroom to prevent clipping */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1.5 sm:py-2.5 px-1 -my-1">
        {MENU_DATA.categories.map(cat => {
          const IconComp = iconMap[cat.icon] || LayoutGrid;
          const isActive = cat.id === activeCategory;

          return (
            <motion.button
              key={cat.id}
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => onSelectCategory(cat.id)}
              className={`group px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 sm:gap-2.5 shrink-0 select-none cursor-pointer relative whitespace-nowrap ${
                isActive
                  ? 'bg-glovo-yellow text-zinc-950 shadow-md shadow-amber-400/35 ring-1 ring-amber-400/60'
                  : 'bg-white dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#1A1A22] border border-zinc-200/90 dark:border-[#23232E] hover:border-amber-400/50 dark:hover:border-amber-500/40 hover:shadow-xs'
              }`}
            >
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-115 group-hover:rotate-6 shrink-0 ${
                isActive 
                  ? 'bg-zinc-950 text-white shadow-xs' 
                  : 'bg-zinc-100 dark:bg-[#1A1A22] text-zinc-600 dark:text-zinc-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-950/40 group-hover:text-amber-600'
              }`}>
                <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="font-semibold text-xs whitespace-nowrap">{cat.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Search and Quick Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 mt-2 sm:mt-2.5 pt-2 sm:pt-2.5 border-t border-zinc-200/70 dark:border-rnr-border">
        
        {/* Quick Tag Chips with safe headroom */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1.5 sm:py-2 px-1 -my-1 text-xs">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => onSelectTag(activeTag === 'hit' ? null : 'hit')}
            className={`group px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
              activeTag === 'hit'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
                : 'bg-zinc-100 dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] hover:border-amber-400/50'
            }`}
          >
            <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">🔥</span>
            <span>Хіти продажу</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => onSelectTag(activeTag === 'spicy' ? null : 'spicy')}
            className={`group px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
              activeTag === 'spicy'
                ? 'bg-rose-500 text-white font-black shadow-md shadow-rose-500/30 ring-1 ring-rose-400'
                : 'bg-zinc-100 dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] hover:border-rose-400/50'
            }`}
          >
            <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">🌶️</span>
            <span>З гостринкою</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => onSelectTag(activeTag === 'veg' ? null : 'veg')}
            className={`group px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
              activeTag === 'veg'
                ? 'bg-emerald-500 text-white font-black shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400'
                : 'bg-zinc-100 dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] hover:border-emerald-400/50'
            }`}
          >
            <span className="inline-block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">🧀</span>
            <span>Сирні</span>
          </motion.button>

          {activeTag && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelectTag(null)}
              className="text-xs text-zinc-500 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 underline ml-1 shrink-0 font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              Скинути
            </motion.button>
          )}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80 shrink-0 group/search">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-focus-within/search:text-amber-500 group-focus-within/search:scale-110 transition-all" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Знайти улюблену страву..."
            className="w-full pl-9 pr-8 py-2 sm:py-2.5 rounded-xl text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-glovo-yellow focus:shadow-md focus:shadow-amber-500/15 transition-all"
          />
          {searchQuery && (
            <motion.button
              type="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
              aria-label="Очистити пошук"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>

      </div>
    </div>
  );
}
