import React from 'react';
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
  // Mouse wheel horizontal scroll support
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <nav className="sticky top-14 sm:top-16 z-30 w-full bg-[#F8F9FA]/95 dark:bg-[#09090B]/95 backdrop-blur-md py-1.5 sm:py-2 border-y border-zinc-200/80 dark:border-[#23232E] transition-colors shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Compact, Smaller Category Pills Row */}
        <div 
          onWheel={handleWheel}
          className="flex items-center gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5 flex-1 min-w-0 touch-pan-x overscroll-x-contain"
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
                className={`h-8 px-2.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 select-none cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-glovo-yellow text-zinc-950 shadow-xs ring-1 ring-amber-400/60 scale-[1.02]'
                    : 'bg-white dark:bg-[#141418] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1E1E28] border border-zinc-200/90 dark:border-[#23232E]'
                }`}
              >
                <IconComp className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input right alongside categories */}
        <div className="relative w-36 sm:w-48 md:w-56 lg:w-64 shrink-0 group/search">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none group-focus-within/search:text-amber-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Знайти страву..."
            className="w-full pl-8 sm:pl-9 pr-7 h-8 rounded-full text-xs bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-glovo-yellow transition-all shadow-xs"
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
    </nav>
  );
}

export default CategoryNav;
