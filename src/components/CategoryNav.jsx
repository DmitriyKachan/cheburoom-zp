import React from 'react';
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
  onSearchChange
}) {
  return (
    <div className="py-1 sm:py-2 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Scrollable Category Chips (Scrolls naturally with the page) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 flex-1 min-w-0">
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
                className={`h-9 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer whitespace-nowrap ${
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
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-64 md:w-72 shrink-0 group/search">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none group-focus-within/search:text-amber-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Знайти улюблену страву..."
            className="w-full pl-9 pr-8 py-2 rounded-full text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-glovo-yellow transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
              aria-label="Очистити пошук"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default CategoryNav;
