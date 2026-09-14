import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_DATA } from '../data/menuData';
import { 
  Search, 
  X, 
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
} from 'lucide-react';

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
  onSearchChange
}) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Mouse wheel horizontal scroll support
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="sticky top-14 sm:top-16 z-30 -mx-3.5 sm:-mx-6 lg:-mx-8 px-3.5 sm:px-6 lg:px-8 bg-[#F8F9FA]/95 dark:bg-[#09090B]/95 backdrop-blur-md py-2 sm:py-2.5 mb-6 sm:mb-8 border-y border-zinc-200/80 dark:border-[#23232E] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Single Row Category Pills (Follows scroll, smooth horizontal swipe) */}
        <div 
          onWheel={handleWheel}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0 touch-pan-x overscroll-x-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {MENU_DATA.categories.map(cat => {
            const IconComp = iconMap[cat.icon] || LayoutGrid;
            const isActive = cat.id === activeCategory;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => {
                  onSelectCategory(cat.id);
                  if (searchQuery) onSearchChange('');
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
                className={`h-9 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-glovo-yellow text-zinc-950 shadow-xs ring-1 ring-amber-400/60 scale-[1.02]'
                    : 'bg-white dark:bg-[#141418] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1E1E28] border border-zinc-200/90 dark:border-[#23232E]'
                }`}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Search Bar (Single Row) */}
        <div className="hidden sm:block relative w-56 md:w-64 lg:w-72 shrink-0 group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none group-focus-within/search:text-amber-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Знайти страву..."
            className="w-full pl-8 pr-7 py-1.5 rounded-full text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-glovo-yellow transition-all"
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

        {/* Mobile Search Toggle */}
        <div className="relative shrink-0 sm:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
              isMobileSearchOpen || searchQuery
                ? 'bg-glovo-yellow text-zinc-950 border-amber-400'
                : 'bg-white dark:bg-[#141418] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#23232E]'
            }`}
            aria-label="Швидкий пошук"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Collapsible Search for Mobile */}
      <AnimatePresence>
        {isMobileSearchOpen && (
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
                className="w-full pl-8 pr-8 py-1.5 rounded-full text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-glovo-yellow"
              />
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setIsMobileSearchOpen(false);
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
  );
}

export default CategoryNav;
