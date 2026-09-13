import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MENU_DATA } from '../data/menuData';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    itemCount,
    subtotal,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  const threshold = MENU_DATA.info.freeDeliveryThreshold;
  const diff = threshold - subtotal;
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100));

  const handleProceed = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-castiron-950/70 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md bg-white dark:bg-rnr-card z-10 shadow-2xl flex flex-col h-full border-l border-zinc-200 dark:border-rnr-border"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-rnr-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-glovo-yellow flex items-center justify-center text-zinc-950 font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="font-display font-black text-lg text-zinc-900 dark:text-white">
              Ваш кошик
            </h3>
            {itemCount > 0 && (
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-rnr-surface text-zinc-900 dark:text-white">
                {itemCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-rnr-surface hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center transition-colors"
            aria-label="Закрити кошик"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Goal Tracker (Glovo / RnR Style) */}
        <div className="px-5 py-3.5 bg-zinc-50 dark:bg-rnr-dark border-b border-zinc-100 dark:border-rnr-border">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            {diff > 0 ? (
              <span className="text-zinc-700 dark:text-zinc-300">
                Додайте ще на <span className="text-amber-500 font-extrabold">{diff} ₴</span> для безкоштовної доставки!
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Безкоштовна доставка активована! 🛵</span>
              </span>
            )}
            <span className="text-zinc-400 text-[11px]">{percent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-zinc-200 dark:bg-rnr-border rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                diff <= 0 ? 'bg-emerald-500' : 'bg-glovo-yellow'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100 dark:divide-rnr-border">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-zinc-400">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-rnr-dark flex items-center justify-center mb-4 text-zinc-300 dark:text-zinc-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-zinc-900 dark:text-white text-base mb-1">
                У кошику поки порожньо
              </p>
              <p className="text-xs text-zinc-500 max-w-[220px]">
                Оберіть апетитні гарячі чебуреки або сети з нашого меню
              </p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-zinc-100 dark:bg-rnr-dark shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white leading-snug">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                        aria-label="Видалити страву"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.crust && (
                      <p className="text-[11px] text-amber-500 font-medium mt-0.5">
                        {item.crust}
                      </p>
                    )}

                    {item.extras && item.extras.length > 0 && (
                      <p className="text-[10px] text-zinc-400">
                        + {item.extras.map(e => e.name).join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <span className="font-black text-sm text-zinc-950 dark:text-white">
                      {item.unitPrice * item.quantity} ₴
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center bg-zinc-100 dark:bg-rnr-surface rounded-xl px-1 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="w-6 h-6 rounded-lg hover:bg-white dark:hover:bg-rnr-card flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition-colors"
                        aria-label="Менше"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-zinc-900 dark:text-white min-w-[18px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="w-6 h-6 rounded-lg hover:bg-white dark:hover:bg-rnr-card flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition-colors"
                        aria-label="Більше"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-zinc-100 dark:border-rnr-border bg-white dark:bg-rnr-card shadow-lg">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              <span>Разом до сплати:</span>
              <span className="font-display font-black text-zinc-950 dark:text-white text-lg">
                {subtotal} ₴
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 mb-4">
              Самовивіз зі знижкою 10% або кур'єрська доставка
            </p>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full h-12 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover active:scale-98 text-zinc-950 font-display font-extrabold text-sm flex items-center justify-between px-6 shadow-md shadow-amber-400/20 transition-all"
            >
              <span>Оформити замовлення</span>
              <span className="flex items-center gap-1.5 font-black">
                <span>{subtotal} ₴</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        )}

      </motion.aside>

    </div>
  );
}
