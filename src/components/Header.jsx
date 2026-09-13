import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Sun, Moon, Phone, MapPin, Clock, ChevronDown, Sparkles } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { CheburoomLogo } from './CheburoomLogo';

export function Header() {
  const { itemCount, subtotal, currentPage, navigateTo, darkMode, toggleTheme } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#09090B] border-b border-zinc-200 dark:border-[#23232E] transition-colors">
      {/* RnR / Glovo Top Delivery Promo Bar */}
      <div className="bg-glovo-yellow text-zinc-950 font-bold text-xs h-7 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
        <span>
          Безкоштовна доставка від 450 ₴ по Запоріжжю • Готуємо свіже за 10 хв
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Location */}
        <div className="flex items-center gap-4 sm:gap-6">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => navigateTo('menu')}
            className="group focus:outline-none cursor-pointer text-left"
            aria-label="Головна ЧЕБУROOM"
          >
            <CheburoomLogo size="md" />
          </motion.button>

          {/* City / Location selector (Glovo / RnR style) */}
          <motion.div 
            whileHover={{ scale: 1.03, y: -1 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-xs cursor-default transition-colors hover:border-amber-400/50"
          >
            <MapPin className="w-4 h-4 text-glovo-green shrink-0" />
            <div className="text-left">
              <span className="font-bold text-zinc-950 dark:text-white block leading-tight">Запоріжжя</span>
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 block leading-tight font-medium">пр. Соборний, 142</span>
            </div>
          </motion.div>
        </div>

        {/* Center: Hours & Phone Call Center (RnR style) */}
        <div className="hidden lg:flex items-center gap-6 text-xs">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold transition-transform cursor-default select-none"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Відчинено: 09:00 — 20:00</span>
          </motion.div>

          <motion.a
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            href="tel:+380951991599"
            className="flex items-center gap-2.5 font-bold text-zinc-950 dark:text-white hover:text-amber-500 transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 group-hover:bg-glovo-yellow group-hover:text-zinc-950 transition-colors">
              <Phone className="w-3.5 h-3.5 group-hover:rotate-12 group-hover:scale-115 transition-transform" />
            </div>
            <div>
              <span className="text-xs font-black block leading-tight text-zinc-950 dark:text-white">+380 (95) 199 15 99</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block leading-tight font-medium">Замовлення та доставка</span>
            </div>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            href="https://www.instagram.com/cheburoom.zp/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-zinc-600 dark:text-zinc-300 hover:text-pink-600 transition-colors group cursor-pointer"
          >
            <InstagramIcon className="w-4 h-4 text-pink-500 group-hover:scale-120 group-hover:rotate-6 transition-transform" />
            <span>@cheburoom.zp</span>
          </motion.a>
        </div>

        {/* Right: Theme switch + Glovo-style Floating Cart Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-[#121215] hover:bg-zinc-200 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-800 dark:text-zinc-200 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            aria-label="Перемкнути тему"
            title={darkMode ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </motion.button>

          {/* Glovo / RnR Cart Button */}
          {currentPage === 'checkout' ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, x: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => navigateTo('menu')}
              className="h-11 px-4 sm:px-5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#121215] dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white font-display font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              aria-label="Повернутися до меню"
            >
              <span>← До меню</span>
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => navigateTo('checkout')}
              className="h-11 px-4 sm:px-5 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-bold text-xs sm:text-sm btn-glow-yellow animate-shimmer flex items-center gap-3.5 sm:gap-4 cursor-pointer select-none group shadow-sm"
              aria-label="Відкрити кошик замовлення"
            >
              <div className="relative shrink-0 mr-1">
                <ShoppingBag className="w-5 h-5 text-zinc-950 group-hover:scale-115 group-hover:-rotate-6 transition-transform" />
                {itemCount > 0 && (
                  <span
                    key={itemCount}
                    className="absolute -top-2 -right-2 bg-zinc-950 text-white text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-badge-pop shadow-xs"
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-semibold text-zinc-700 leading-tight tracking-wide">Кошик</span>
                <span className="font-extrabold text-xs sm:text-sm leading-tight">{subtotal} ₴</span>
              </div>
            </motion.button>
          )}
        </div>

      </div>
    </header>
  );
}
