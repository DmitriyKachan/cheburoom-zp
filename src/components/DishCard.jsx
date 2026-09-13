import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Plus, Minus, SlidersHorizontal, Scale, Sparkles } from 'lucide-react';

export function DishCard({ dish }) {
  const { items, addItem, updateQuantity, setSelectedDishForModal } = useCart();

  // Check if dish is already in cart
  const cartItem = items.find(i => i.id === dish.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  return (
    <article
      className="relative flex flex-col h-full bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200/90 dark:border-[#23232E] hover:border-amber-400 dark:hover:border-amber-500/50 card-interactive overflow-hidden group shadow-xs"
    >
      {/* Badges (Glovo / RnR style) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
        {dish.badge && (
          <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-xl bg-glovo-yellow text-zinc-950 shadow-xs transition-transform duration-300 group-hover:scale-105">
            {dish.badge}
          </span>
        )}
        {dish.isSpicy && (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-rose-500 text-white shadow-xs transition-transform duration-300 group-hover:scale-105">
            🌶️ Гостре
          </span>
        )}
      </div>

      {/* Weight tag top right */}
      <div className="absolute top-3 right-3 z-10 px-2 py-0.5 text-[11px] font-medium rounded-lg bg-black/60 backdrop-blur-md text-white">
        {dish.weight}
      </div>

      {/* Image Container */}
      <div
        className="relative h-44 sm:h-48 w-full bg-zinc-100 dark:bg-zinc-950 cursor-pointer overflow-hidden"
        onClick={() => setSelectedDishForModal(dish)}
      >
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="font-display font-bold text-base text-zinc-950 dark:text-white leading-snug hover:text-amber-500 transition-colors cursor-pointer mb-1.5"
            onClick={() => setSelectedDishForModal(dish)}
          >
            {dish.name}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {dish.shortDesc}
          </p>
        </div>

        {/* Bottom Bar: Price and Interactive Quantity / Add Button */}
        <div className="pt-3 border-t border-zinc-100 dark:border-[#23232E] flex items-center justify-between gap-2">
          <div>
            <span className="font-display font-black text-xl text-zinc-950 dark:text-white">
              {dish.price} ₴
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Customization link */}
            {dish.customizable && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDishForModal(dish)}
                className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-[#23232E] bg-zinc-50 dark:bg-[#1A1A22] text-zinc-600 dark:text-zinc-300 hover:border-amber-400 hover:text-amber-500 transition-colors flex items-center justify-center cursor-pointer group/sliders"
                title="Обрати начинку або спосіб смаження"
                aria-label="Склад та опції"
              >
                <SlidersHorizontal className="w-4 h-4 group-hover/sliders:rotate-90 transition-transform duration-300" />
              </motion.button>
            )}

            {/* Stepper if in cart, else Add Button (Like Glovo) */}
            {inCartQty > 0 ? (
              <div className="flex items-center bg-glovo-yellow text-zinc-950 rounded-xl px-1.5 py-1 font-bold shadow-md shadow-amber-400/20">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => updateQuantity(cartItem.cartItemId, -1)}
                  className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Зменшити кількість"
                >
                  <Minus className="w-3.5 h-3.5 text-zinc-950" />
                </motion.button>
                <span className="px-2.5 text-xs font-black min-w-[20px] text-center">
                  {inCartQty}
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => updateQuantity(cartItem.cartItemId, 1)}
                  className="w-7 h-7 rounded-lg bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Збільшити кількість"
                >
                  <Plus className="w-3.5 h-3.5 text-zinc-950" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => addItem(dish)}
                className="h-9 px-4 rounded-xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 text-xs font-extrabold btn-glow-yellow flex items-center gap-1.5 cursor-pointer select-none group/add"
                aria-label={`Додати ${dish.name}`}
              >
                <Plus className="w-4 h-4 text-zinc-950 group-hover/add:rotate-90 transition-transform duration-200" />
                <span>В кошик</span>
              </motion.button>
            )}
          </div>
        </div>

      </div>
    </article>
  );
}

