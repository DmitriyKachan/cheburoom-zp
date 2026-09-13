import React from 'react';
import { MENU_DATA } from '../data/menuData';
import { Search, X, LayoutGrid, Flame, Sparkles, Package, Utensils, Droplet, Coffee } from 'lucide-react';

const iconMap = {
  LayoutGrid,
  Flame,
  Sparkles,
  Package,
  Utensils,
  Droplet,
  Coffee
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
    <div className="sticky top-[92px] z-30 bg-[#F8F9FA]/95 dark:bg-[#09090B]/95 backdrop-blur-md py-3.5 mb-8 border-b border-zinc-200/90 dark:border-[#23232E] transition-colors">
      
      {/* Category Pills (Glovo / RnR clean style) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {MENU_DATA.categories.map(cat => {
          const IconComp = iconMap[cat.icon] || LayoutGrid;
          const isActive = cat.id === activeCategory;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`group px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 shrink-0 select-none ${
                isActive
                  ? 'bg-glovo-yellow text-zinc-950 shadow-sm'
                  : 'bg-white dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1A1A22] border border-zinc-200/90 dark:border-[#23232E]'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                isActive 
                  ? 'bg-zinc-950 text-white' 
                  : 'bg-zinc-100 dark:bg-[#1A1A22] text-zinc-600 dark:text-zinc-400'
              }`}>
                <IconComp className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Quick Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-3 pt-3 border-t border-zinc-200/70 dark:border-rnr-border">
        
        {/* Quick Tag Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => onSelectTag(activeTag === 'hit' ? null : 'hit')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTag === 'hit'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-100 dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E]'
            }`}
          >
            <span>🔥 Хіти продажу</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTag(activeTag === 'spicy' ? null : 'spicy')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTag === 'spicy'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-zinc-100 dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E]'
            }`}
          >
            <span>🌶️ З гостринкою</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTag(activeTag === 'veg' ? null : 'veg')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTag === 'veg'
                ? 'bg-emerald-500 text-white font-bold'
                : 'bg-zinc-100 dark:bg-[#121215] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E]'
            }`}
          >
            <span>🧀 Сирні</span>
          </button>

          {activeTag && (
            <button
              type="button"
              onClick={() => onSelectTag(null)}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 underline ml-1 shrink-0 font-medium"
            >
              Скинути
            </button>
          )}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Знайти улюблену страву..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-glovo-yellow transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
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
