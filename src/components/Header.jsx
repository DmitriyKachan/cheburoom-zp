import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Sun, Moon, Phone, MapPin, Clock, ChevronDown, Sparkles } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

export function Header() {
  const { itemCount, subtotal, setIsCartOpen, darkMode, toggleTheme } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#09090B] border-b border-zinc-200 dark:border-[#23232E] transition-colors">
      {/* RnR / Glovo Top Delivery Promo Bar */}
      <div className="bg-glovo-yellow text-zinc-950 font-bold text-xs h-7 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>
          <strong>Безкоштовна доставка</strong> від 450 ₴ по Запоріжжю &bull; <strong>-10%</strong> на самовивіз!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Location */}
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="flex items-center gap-2.5 group focus:outline-none" aria-label="Головна ЧЕБУROOM">
            <div className="w-11 h-11 rounded-2xl bg-glovo-yellow text-zinc-950 flex items-center justify-center font-display font-black text-base shadow-sm group-hover:scale-105 transition-transform">
              ЧР
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl tracking-tight text-zinc-950 dark:text-white">
                  ЧЕБУ<span className="text-amber-500">ROOM</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium leading-none">
                Крафтова чебуречна
              </p>
            </div>
          </a>

          {/* City / Location selector (Glovo / RnR style) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-xs">
            <MapPin className="w-4 h-4 text-glovo-green shrink-0" />
            <div className="text-left">
              <span className="font-bold text-zinc-950 dark:text-white block leading-tight">Запоріжжя</span>
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 block leading-tight font-medium">пр. Соборний, 142</span>
            </div>
          </div>
        </div>

        {/* Center: Hours & Phone Call Center (RnR style) */}
        <div className="hidden lg:flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Відчинено: 09:00 — 20:00</span>
          </div>

          <a
            href="tel:+380951991599"
            className="flex items-center gap-2.5 font-bold text-zinc-950 dark:text-white hover:text-amber-500 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-black block leading-tight text-zinc-950 dark:text-white">+380 (95) 199 15 99</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block leading-tight font-medium">Замовлення та доставка</span>
            </div>
          </a>

          <a
            href="https://www.instagram.com/cheburoom.zp/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-zinc-600 dark:text-zinc-300 hover:text-pink-600 transition-colors"
          >
            <InstagramIcon className="w-4 h-4 text-pink-500" />
            <span>@cheburoom.zp</span>
          </a>
        </div>

        {/* Right: Theme switch + Glovo-style Floating Cart Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-[#121215] hover:bg-zinc-200 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-800 dark:text-zinc-200 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            aria-label="Перемкнути тему"
            title={darkMode ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* Glovo / RnR Cart Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="h-11 px-4 sm:px-5 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover active:scale-95 text-zinc-950 font-display font-bold text-xs sm:text-sm shadow-md shadow-amber-400/20 transition-all flex items-center gap-2.5"
            aria-label="Відкрити кошик замовлення"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-zinc-950" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-zinc-950 text-white text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-semibold text-zinc-700 leading-tight">Кошик</span>
              <span className="font-extrabold text-xs sm:text-sm leading-tight">{subtotal} ₴</span>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
}
