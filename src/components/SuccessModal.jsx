import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Check, Clock, MapPin, Phone, CreditCard, X, ChevronRight } from 'lucide-react';

export function SuccessModal() {
  const { successOrder, setSuccessOrder, navigateTo } = useCart();

  if (!successOrder) return null;

  const handleClose = () => {
    setSuccessOrder(null);
    if (navigateTo) {
      navigateTo('menu');
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/75 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white dark:bg-[#121215] rounded-t-[28px] sm:rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-[#23232E] flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        >
          {/* Top Grab Handle on mobile */}
          <div className="w-12 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mt-2.5 mb-1 block sm:hidden shrink-0" />

          {/* Header */}
          <div className="p-5 sm:p-6 text-center border-b border-zinc-100 dark:border-[#23232E] relative shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#1A1A22] text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Закрити"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Check className="w-7 h-7" strokeWidth={2.5} />
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-black text-zinc-950 dark:text-white mb-1">
              Замовлення прийнято!
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Кухар уже смажить ваші гарячі чебуреки з-під ножа
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs overscroll-contain">
            
            {/* Order Meta Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-[#18181F] border border-zinc-200/80 dark:border-[#262632] space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Номер замовлення:</span>
                <span className="font-mono font-black text-zinc-950 dark:text-white text-sm bg-zinc-200/70 dark:bg-zinc-800 px-2 py-0.5 rounded-lg">
                  {successOrder.orderId}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Самовивіз:</span>
                </span>
                <span className="font-bold text-right text-zinc-950 dark:text-white">
                  {successOrder.address || "м. Запоріжжя, пр. Соборний, 142"}
                </span>
              </div>

              {successOrder.timing && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Час:</span>
                  </span>
                  <span className="font-bold text-zinc-950 dark:text-white">
                    {successOrder.timing}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Контакт:</span>
                </span>
                <span className="font-bold text-zinc-950 dark:text-white">
                  {successOrder.name ? `${successOrder.name} (${successOrder.phone})` : successOrder.phone}
                </span>
              </div>

              {successOrder.payment && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-violet-500" />
                    <span>Оплата:</span>
                  </span>
                  <span className="font-bold text-zinc-950 dark:text-white">
                    {successOrder.payment}
                  </span>
                </div>
              )}
            </div>

            {/* Dishes List */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Склад замовлення:
                </span>
                {successOrder.items && (
                  <span className="text-[11px] font-semibold text-zinc-400">
                    {successOrder.items.reduce((s, i) => s + (i.quantity || 1), 0)} шт.
                  </span>
                )}
              </div>

              <div className="space-y-2 rounded-2xl bg-zinc-50/70 dark:bg-[#18181F]/70 border border-zinc-200/70 dark:border-[#262632] p-3 divide-y divide-zinc-200/50 dark:divide-zinc-800/70">
                {successOrder.items && successOrder.items.length > 0 ? (
                  successOrder.items.map((item, idx) => (
                    <div key={item.cartItemId || idx} className={`flex items-start justify-between gap-3 ${idx > 0 ? 'pt-2' : ''}`}>
                      <div className="flex items-start gap-2.5 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-800"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-zinc-950 dark:text-white leading-tight">
                            {item.name}
                            <span className="text-amber-500 font-extrabold ml-1.5 whitespace-nowrap">
                              × {item.quantity}
                            </span>
                          </div>
                          {item.crust && (
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                              {item.crust}
                            </div>
                          )}
                          {item.extras && item.extras.length > 0 && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400">
                              + {item.extras.map(e => e.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-extrabold text-zinc-950 dark:text-white shrink-0 whitespace-nowrap">
                        {(item.unitPrice || item.price) * item.quantity} ₴
                      </span>
                    </div>
                  ))
                ) : (
                  <pre className="text-[11px] text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-sans">
                    {successOrder.fullOrderText}
                  </pre>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
              {successOrder.subtotal !== undefined && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Сума замовлення:</span>
                  <span className="font-semibold text-zinc-950 dark:text-white">{successOrder.subtotal} ₴</span>
                </div>
              )}
              {successOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Знижка (самовивіз -10%):</span>
                  <span>-{successOrder.discount} ₴</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-amber-200 dark:border-amber-900/50">
                <span className="font-display font-black text-sm text-zinc-950 dark:text-white">
                  Разом до сплати:
                </span>
                <span className="font-display font-black text-lg text-amber-500 dark:text-amber-400">
                  {successOrder.total} ₴
                </span>
              </div>
            </div>

          </div>

          {/* Footer Action Button */}
          <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-[#23232E] bg-[#F8F9FA] dark:bg-[#09090B] flex flex-col sm:flex-row gap-2.5 shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleClose}
              className="w-full h-12 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-sm btn-glow-yellow flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none"
            >
              <span>Повернутися до меню</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SuccessModal;
