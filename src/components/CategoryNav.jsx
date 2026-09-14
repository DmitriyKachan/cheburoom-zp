import React, { useRef, useState, useEffect } from 'react';
import { MENU_DATA } from '../data/menuData';
import { 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
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
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkArrows();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkArrows, { passive: true });
      window.addEventListener('resize', checkArrows);
      return () => {
        el.removeEventListener('scroll', checkArrows);
        window.removeEventListener('resize', checkArrows);
      };
    }
  }, []);

  const scrollBy = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Mouse Drag-to-Scroll handlers (for desktop mouse users)
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel horizontal scrolling
  const handleWheel = (e) => {
    if (!scrollRef.current) return;
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="py-1 sm:py-2 mb-6 sm:mb-8 select-none">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Scrollable Category Chips Container with Arrows & Drag/Touch Support */}
        <div className="relative flex-1 min-w-0 w-full">
          
          {/* Left Arrow Button */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => scrollBy(-180)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-[#181820]/95 shadow-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:scale-110 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-all cursor-pointer"
              aria-label="Гортати категорії вліво"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Categories Strip */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 w-full max-w-full touch-pan-x cursor-grab active:cursor-grabbing scroll-smooth overscroll-x-contain ${
              showLeftArrow ? 'pl-9' : 'pl-0'
            } ${showRightArrow ? 'pr-9' : 'pr-0'}`}
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

          {/* Right Arrow Button */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => scrollBy(180)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-[#181820]/95 shadow-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:scale-110 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-all cursor-pointer"
              aria-label="Гортати категорії вправо"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

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
