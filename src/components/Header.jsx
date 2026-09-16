import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Sun, Moon, Phone, MapPin } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { CheburoomLogo } from './CheburoomLogo';

export function Header() {
  const { itemCount, subtotal, currentPage, navigateTo, darkMode, toggleTheme, successOrder, setSuccessOrder, openSuccessModal } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md border-b border-zinc-200 dark:border-[#23232E] transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Left Section: Logo & Address */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => navigateTo('menu')}
            className="focus:outline-none cursor-pointer text-left"
            aria-label="Головна ЧЕБУROOM"
          >
            <CheburoomLogo size="md" />
          </motion.button>

          <div className="hidden sm:block h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Location link */}
          <motion.a 
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            href="https://maps.app.goo.gl/9LYDJF5hJfDkPg2dA"
            target="_blank"
            rel="noopener noreferrer"
            title="Відкрити адресу закладу в Google Картах"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/70 dark:bg-[#15151B] dark:hover:bg-[#1E1E26] border border-zinc-200/80 dark:border-[#23232E] text-xs transition-all cursor-pointer group"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-zinc-900 dark:text-white text-xs whitespace-nowrap">
              Запоріжжя, <span className="font-normal text-zinc-500 dark:text-zinc-400">вул. Олександрівська, 75</span>
            </span>
          </motion.a>
        </div>

        {/* Right Section: Hours, Phone, Instagram, Theme, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Working Hours Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 font-semibold select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>09:00 — 20:00</span>
          </div>

          {/* Phone Contact */}
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            href="tel:+380951991599"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/70 dark:bg-[#15151B] dark:hover:bg-[#1E1E26] border border-zinc-200/80 dark:border-[#23232E] text-xs font-bold text-zinc-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-all cursor-pointer group"
            title="Зателефонувати в заклад"
          >
            <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0 group-hover:rotate-12 transition-transform" />
            <span>+380 (95) 199 15 99</span>
          </motion.a>

          {/* Instagram Link */}
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            href="https://www.instagram.com/cheburoom.zp/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/70 dark:bg-[#15151B] dark:hover:bg-[#1E1E26] border border-zinc-200/80 dark:border-[#23232E] text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-pink-500 dark:hover:text-pink-400 transition-all cursor-pointer group"
            title="Instagram @cheburoom.zp"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-500 shrink-0 group-hover:scale-115 transition-transform" />
            <span>@cheburoom.zp</span>
          </motion.a>

          <div className="hidden md:block h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Theme Switch */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-[#15151B] dark:hover:bg-[#1E1E26] border border-zinc-200/80 dark:border-[#23232E] text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center cursor-pointer shadow-xs shrink-0"
            aria-label="Перемкнути тему"
            title={darkMode ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400/20" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700" />}
          </motion.button>

          {/* Active Order Live Tracker Pill */}
          {successOrder && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openSuccessModal ? openSuccessModal() : setSuccessOrder({ ...successOrder })}
              className={`h-8 sm:h-10 px-2 sm:px-3 rounded-xl border flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-xs shrink-0 text-xs font-bold transition-all ${
                successOrder.status === 'ready'
                  ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                  : successOrder.status === 'preparing'
                  ? 'bg-blue-500/15 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-500/30'
                  : (successOrder.status === 'cancelled' || successOrder.isDeleted)
                  ? 'bg-rose-500/15 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/15 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-500/30'
              }`}
              title="Переглянути статус замовлення"
            >
              <span className="text-[10px] sm:text-xs whitespace-nowrap">
                {successOrder.status === 'ready'
                  ? '🎁 Готово!'
                  : successOrder.status === 'preparing'
                  ? '👨‍🍳 Готується'
                  : (successOrder.status === 'cancelled' || successOrder.isDeleted)
                  ? '❌ Скасовано'
                  : '🟡 Замовлення'}
              </span>
              <span className="hidden md:inline text-[10px] font-mono opacity-80">
                #{successOrder.orderId}
              </span>
            </motion.button>
          )}

          {/* Cart Button (hidden on checkout page) */}
          {currentPage !== 'checkout' && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigateTo('checkout')}
              className="h-8 sm:h-10 px-2.5 sm:px-4 rounded-xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group shadow-xs shrink-0 whitespace-nowrap"
              aria-label="Відкрити кошик"
            >
              <div className="relative shrink-0">
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-950 group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span
                    key={itemCount}
                    className="absolute -top-1.5 -right-2 bg-zinc-950 text-white text-[9px] font-black rounded-full h-3.5 min-w-3.5 px-1 flex items-center justify-center animate-badge-pop"
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden min-[380px]:inline">Кошик</span>
              <span className="font-extrabold text-[11px] sm:text-xs px-1.5 py-0.5 rounded-md bg-black/10">
                {subtotal} ₴
              </span>
            </motion.button>
          )}

        </div>

      </div>
    </header>
  );
}
