import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Plus, Minus, SlidersHorizontal, Scale, Sparkles } from 'lucide-react';

function getDisplayBadge(dish) {
  if (dish.badge && dish.badge.trim()) {
    const raw = dish.badge.trim();
    const lower = raw.toLowerCase();
    if (lower === 'hit' || lower === 'хит' || lower === 'хіт') return '🔥 Хіт';
    if (lower === 'new' || lower === 'новинка') return '✨ Новинка';
    if (lower === 'spicy' || lower === 'гостре') return null;
    if (lower === 'premium' || lower === 'преміум') return '⭐ Преміум';
    if (lower === 'top' || lower === 'топ') return '🧀 Топ';
    return raw;
  }
  if (dish.isHit) return '🔥 Хіт';
  if (dish.isNew) return '✨ Новинка';
  return null;
}

function getBadgeColorClass(badgeText, badgeColor) {
  if (badgeColor === 'rose' || badgeColor === 'red') {
    return 'bg-rose-500 text-white shadow-xs';
  }
  if (badgeColor === 'emerald' || badgeColor === 'green') {
    return 'bg-emerald-500 text-white shadow-xs';
  }
  if (badgeColor === 'purple' || badgeColor === 'violet') {
    return 'bg-purple-600 text-white shadow-xs';
  }
  if (badgeColor === 'blue') {
    return 'bg-blue-600 text-white shadow-xs';
  }

  if (badgeText) {
    const lower = badgeText.toLowerCase();
    if (lower.includes('новин') || lower.includes('new')) {
      return 'bg-emerald-500 text-white shadow-xs';
    }
    if (lower.includes('суперцін') || lower.includes('акці') || lower.includes('солодк')) {
      return 'bg-rose-500 text-white shadow-xs';
    }
    if (lower.includes('преміум')) {
      return 'bg-zinc-950 text-amber-400 border border-amber-400/50 shadow-xs';
    }
  }

  return 'bg-glovo-yellow text-zinc-950 font-black shadow-xs';
}

export function DishCard({ dish }) {
  const { items, addItem, updateQuantity, setSelectedDishForModal } = useCart();
  const isAvailable = dish.available !== false;

  // Check if dish is already in cart
  const cartItem = items.find(i => i.id === dish.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const displayBadge = getDisplayBadge(dish);
  const badgeColorClass = getBadgeColorClass(displayBadge, dish.badgeColor);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="relative flex flex-col h-full bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-[#23232E] hover:border-amber-400 dark:hover:border-amber-500/50 card-interactive overflow-hidden group shadow-xs select-none"
    >
      {/* Badges (Glovo / RnR style) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
        {displayBadge && (
          <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-xl transition-transform duration-300 group-hover:scale-110 ${badgeColorClass}`}>
            {displayBadge}
          </span>
        )}
        {dish.isSpicy && (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-rose-500 text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
            🌶️ Гостре
          </span>
        )}
      </div>

      {/* Weight tag top right */}
      <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 text-[11px] font-semibold rounded-lg bg-black/60 backdrop-blur-md text-white shadow-xs group-hover:scale-105 transition-transform">
        {dish.weight}
      </div>

      {/* Image Container */}
      <div
        className="relative h-44 sm:h-48 w-full bg-zinc-100 dark:bg-zinc-950 cursor-pointer overflow-hidden"
        onClick={() => isAvailable && setSelectedDishForModal(dish)}
      >
        <img
          src={dish.image}
          alt={dish.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${!isAvailable ? 'grayscale opacity-75' : ''}`}
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-xs flex items-center justify-center p-2 z-20">
            <span className="px-3 py-1 rounded-xl bg-zinc-900/90 text-amber-400 font-bold text-xs border border-amber-500/30 shadow-md">
              Тимчасово немає
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="font-display font-bold text-sm sm:text-base text-zinc-950 dark:text-white leading-snug hover:text-amber-500 transition-colors cursor-pointer mb-1 group-hover:translate-x-0.5 duration-200"
            onClick={() => setSelectedDishForModal(dish)}
          >
            {dish.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3 sm:mb-4">
            {dish.shortDesc}
          </p>
        </div>

        {/* Bottom Bar: Price and Interactive Quantity / Add Button */}
        <div className="pt-2.5 sm:pt-3 border-t border-zinc-100 dark:border-[#23232E] flex items-center justify-between gap-2">
          <div>
            <span className="font-display font-black text-lg sm:text-xl text-zinc-950 dark:text-white whitespace-nowrap">
              {dish.price} ₴
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isAvailable ? (
              <span className="h-9 px-3.5 rounded-xl bg-zinc-100 dark:bg-[#181820] text-zinc-400 dark:text-zinc-500 text-xs font-bold flex items-center select-none border border-zinc-200/80 dark:border-zinc-800">
                Закінчилось
              </span>
            ) : (
              <>
                {/* Customization link */}
                {dish.customizable && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.15, rotate: 90 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={() => setSelectedDishForModal(dish)}
                    className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-[#23232E] bg-zinc-50 dark:bg-[#1A1A22] text-zinc-600 dark:text-zinc-300 hover:border-amber-400 hover:text-amber-500 hover:shadow-xs transition-colors flex items-center justify-center cursor-pointer"
                    title="Обрати начинку або спосіб смаження"
                    aria-label="Склад та опції"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </motion.button>
                )}

                {/* Stepper if in cart, else Add Button (Like Glovo) */}
                {inCartQty > 0 ? (
                  <div className="flex items-center bg-glovo-yellow text-zinc-950 rounded-xl px-1.5 py-1 font-bold shadow-md shadow-amber-400/30 ring-1 ring-amber-400/50">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.82 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      onClick={() => updateQuantity(cartItem.cartItemId, inCartQty - 1)}
                      className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Зменшити кількість"
                    >
                      <Minus className="w-3.5 h-3.5 text-zinc-950" />
                    </motion.button>
                    <span key={inCartQty} className="animate-badge-pop px-2.5 text-xs font-black min-w-[20px] text-center inline-block">
                      {inCartQty}
                    </span>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.82 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      onClick={() => updateQuantity(cartItem.cartItemId, inCartQty + 1)}
                      className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Збільшити кількість"
                    >
                      <Plus className="w-3.5 h-3.5 text-zinc-950" />
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    onClick={() => addItem(dish)}
                    className="h-9 px-4 rounded-xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 text-xs font-extrabold btn-glow-yellow flex items-center gap-1.5 cursor-pointer select-none group/add shadow-sm"
                    aria-label={`Додати ${dish.name}`}
                  >
                    <Plus className="w-4 h-4 text-zinc-950 group-hover/add:rotate-90 group-hover/add:scale-125 transition-transform duration-200" />
                    <span>В кошик</span>
                  </motion.button>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </motion.article>
  );
}

