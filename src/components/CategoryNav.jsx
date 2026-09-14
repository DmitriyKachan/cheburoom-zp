import React from 'react';
import { MENU_DATA } from '../data/menuData';
import { 
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
  onSelectCategory
}) {
  // Mouse wheel horizontal scroll support
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <nav className="sticky top-14 sm:top-16 z-30 w-full bg-[#F8F9FA]/95 dark:bg-[#09090B]/95 backdrop-blur-md py-2 sm:py-2.5 border-y border-zinc-200/80 dark:border-[#23232E] transition-colors shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive, Adaptive Category Row (No search collision, perfectly aligned with page grid) */}
        <div 
          onWheel={handleWheel}
          className="flex items-center justify-start lg:justify-between gap-1.5 sm:gap-2 md:gap-2.5 overflow-x-auto no-scrollbar py-0.5 px-0.5 w-full touch-pan-x overscroll-x-contain"
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
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
                className={`h-8.5 sm:h-9 px-3 sm:px-3.5 xl:px-4 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer whitespace-nowrap ${
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

      </div>
    </nav>
  );
}

export default CategoryNav;
