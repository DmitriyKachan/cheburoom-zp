import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Plus, Flame, Sparkles } from 'lucide-react';

export function DishModal() {
  const { selectedDishForModal, setSelectedDishForModal, addItem } = useCart();
  
  const [selectedCrust, setSelectedCrust] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);

  useEffect(() => {
    if (selectedDishForModal) {
      const defaultCrust = selectedDishForModal.options?.crust
        ? selectedDishForModal.options.crust[0].name
        : '';
      setSelectedCrust(defaultCrust);
      setSelectedExtras([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedDishForModal]);

  if (!selectedDishForModal) return null;

  const dish = selectedDishForModal;

  const handleExtraToggle = (extra) => {
    setSelectedExtras(prev => {
      const exists = prev.some(e => e.id === extra.id);
      if (exists) {
        return prev.filter(e => e.id !== extra.id);
      }
      return [...prev, extra];
    });
  };

  const totalPrice = dish.price + selectedExtras.reduce((sum, e) => sum + e.price, 0);

  const handleAdd = () => {
    addItem(dish, {
      crust: selectedCrust,
      extras: selectedExtras,
      quantity: 1
    });
    setSelectedDishForModal(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-white dark:bg-[#121215] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-[#23232E] flex flex-col max-h-[90vh]"
        >
          {/* Header Image */}
          <div className="relative h-48 sm:h-56 w-full bg-zinc-100 dark:bg-zinc-900 shrink-0">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setSelectedDishForModal(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all duration-200 hover:rotate-90 active:scale-90 backdrop-blur-sm cursor-pointer"
              aria-label="Закрити"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-black/60 text-white backdrop-blur-sm">
              {dish.weight}
            </span>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            <h3 className="font-display font-black text-xl text-zinc-950 dark:text-white mb-2">
              {dish.name}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
              {dish.desc || dish.shortDesc}
            </p>

            {/* Crust Choices */}
            {dish.options?.crust && dish.options.crust.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-display font-bold text-zinc-950 dark:text-white mb-2.5">
                  Спосіб приготування:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dish.options.crust.map((c, idx) => {
                    const isSelected = selectedCrust === c.name;
                    return (
                      <label
                        key={c.name}
                        onClick={() => setSelectedCrust(c.name)}
                        className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all duration-200 select-none active:scale-98 ${
                          isSelected
                            ? 'border-glovo-yellow bg-amber-500/10 dark:bg-amber-500/20 shadow-xs ring-1 ring-glovo-yellow'
                            : 'border-zinc-200 dark:border-[#23232E] hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-[#1A1A22]/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="crust"
                          checked={isSelected}
                          onChange={() => setSelectedCrust(c.name)}
                          className="mt-0.5 text-amber-500 focus:ring-glovo-yellow"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold block text-zinc-950 dark:text-white">
                            {c.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                            {idx === 0 ? 'Золотиста пухирчаста скоринка' : 'Без олії + фермерське масло'}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Extras */}
            {dish.options?.extras && dish.options.extras.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-display font-bold text-zinc-950 dark:text-white mb-2.5">
                  Додати до начинки:
                </h4>
                <div className="space-y-2">
                  {dish.options.extras.map(extra => {
                    const isChecked = selectedExtras.some(e => e.id === extra.id);
                    return (
                      <label
                        key={extra.id}
                        className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-200 select-none active:scale-98 ${
                          isChecked
                            ? 'border-glovo-yellow bg-amber-500/10 dark:bg-amber-500/20 ring-1 ring-glovo-yellow shadow-xs'
                            : 'border-zinc-200 dark:border-[#23232E] bg-zinc-50 dark:bg-[#1A1A22] hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleExtraToggle(extra)}
                            className="rounded text-amber-500 focus:ring-glovo-yellow w-4 h-4 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-zinc-950 dark:text-white">
                            {extra.name}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                          +{extra.price} ₴
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-5 border-t border-zinc-100 dark:border-[#23232E] bg-[#F8F9FA] dark:bg-[#09090B] flex items-center justify-between gap-4 shrink-0">
            <div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">Вартість:</div>
              <div className="font-display text-xl font-black text-zinc-950 dark:text-white">
                {totalPrice} ₴
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="h-11 px-6 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 text-xs font-extrabold btn-glow-yellow animate-shimmer flex items-center gap-2 cursor-pointer group select-none"
            >
              <Plus className="w-4 h-4 text-zinc-950 group-hover:rotate-90 transition-transform duration-200" />
              <span>Додати ({totalPrice} ₴)</span>
            </button>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
