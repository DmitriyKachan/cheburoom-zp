import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Check, Clock, MapPin, Phone, CreditCard, X, ChevronRight, AlertCircle, ChefHat, Sparkles } from 'lucide-react';

export function SuccessModal() {
  const { successOrder, setSuccessOrder, isSuccessModalOpen, closeSuccessModal, navigateTo, currentPage } = useCart();

  const isCancelled = successOrder?.status === 'cancelled' || successOrder?.isDeleted;
  const currentStatus = isCancelled ? 'cancelled' : (successOrder?.status || 'new');

  useEffect(() => {
    if (isSuccessModalOpen && currentStatus === 'completed') {
      const timer = setTimeout(() => {
        closeSuccessModal();
        setSuccessOrder(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isSuccessModalOpen, currentStatus, closeSuccessModal, setSuccessOrder]);

  if (!successOrder || !isSuccessModalOpen) return null;

  const statusConfig = {
    new: {
      title: 'Замовлення прийнято!',
      subtitle: 'Передано на кухню ресторану',
      badge: '🟡 Нове замовлення',
      stepIndex: 0,
      icon: Clock,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
    },
    preparing: {
      title: 'Готується на кухні! 👨‍🍳',
      subtitle: 'Кухар смажить ваші гарячі чебуреки з-під ножа',
      badge: '🔵 Готується',
      stepIndex: 1,
      icon: ChefHat,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
    },
    ready: {
      title: 'Замовлення готове! 🎉',
      subtitle: 'Гаряче та запаковане чекає на вас',
      badge: '🟢 Готове до видачі',
      stepIndex: 2,
      icon: Sparkles,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
    },
    completed: {
      title: 'Видано. Смачного! ❤️',
      subtitle: 'Дякуємо, що обираєте ЧЕБУROOM!',
      badge: '⚪ Видано клієнту',
      stepIndex: 3,
      icon: Check,
      color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30'
    },
    cancelled: {
      title: 'Замовлення скасовано',
      subtitle: 'Замовлення було скасовано або видалено адміністратором',
      badge: '❌ Скасовано',
      stepIndex: -1,
      icon: AlertCircle,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/30'
    }
  };

  const activeConfig = statusConfig[currentStatus] || statusConfig.new;
  const StatusIcon = activeConfig.icon;

  const handleClose = () => {
    closeSuccessModal();
    if (isCancelled || currentStatus === 'completed') {
      setSuccessOrder(null);
    }
    if (navigateTo && currentPage !== 'menu') {
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
          <div className="p-4 sm:p-6 text-center border-b border-zinc-100 dark:border-[#23232E] relative shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-100 dark:bg-[#1A1A22] text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Закрити"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-2.5 sm:mb-3 shadow-xs border ${
              isCancelled 
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900' 
                : currentStatus === 'ready'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 ring-4 ring-emerald-500/20 animate-pulse'
                : currentStatus === 'preparing'
                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 animate-bounce'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900'
            }`}>
              <StatusIcon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
            </div>

            <h3 className="font-display text-lg sm:text-2xl font-black text-zinc-950 dark:text-white mb-0.5 sm:mb-1">
              {activeConfig.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              {activeConfig.subtitle}
            </p>

            {/* Live Progress Stepper */}
            {!isCancelled && (
              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between gap-0.5 sm:gap-1 max-w-sm mx-auto">
                  {[
                    { key: 'new', label: 'Прийнято', idx: 0 },
                    { key: 'preparing', label: 'Готується', idx: 1 },
                    { key: 'ready', label: 'Готово!', idx: 2 },
                    { key: 'completed', label: 'Видано', idx: 3 }
                  ].map((step, i) => {
                    const isPassed = activeConfig.stepIndex > step.idx;
                    const isCurrent = activeConfig.stepIndex === step.idx;
                    return (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black transition-all ${
                            isPassed 
                              ? 'bg-emerald-500 text-white' 
                              : isCurrent
                              ? 'bg-amber-400 text-zinc-950 ring-2 sm:ring-4 ring-amber-400/20 font-black scale-105'
                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                          }`}>
                            {isPassed ? '✓' : (step.idx + 1)}
                          </div>
                          <span className={`text-[9px] sm:text-[10px] mt-1 font-bold truncate max-w-[55px] sm:max-w-[65px] ${
                            isCurrent ? 'text-amber-500 dark:text-amber-400 font-black' : 'text-zinc-400'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                        {i < 3 && (
                          <div className={`h-0.5 flex-1 -mt-4 transition-colors ${
                            activeConfig.stepIndex > i ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
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
                  {successOrder.address || "вулиця Олександрівська, 75, Запоріжжя"}
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
                {Array.isArray(successOrder.items) && (
                  <span className="text-[11px] font-semibold text-zinc-400">
                    {successOrder.items.reduce((s, i) => s + (i.quantity || 1), 0)} шт.
                  </span>
                )}
              </div>

              <div className="space-y-2 rounded-2xl bg-zinc-50/70 dark:bg-[#18181F]/70 border border-zinc-200/70 dark:border-[#262632] p-3 divide-y divide-zinc-200/50 dark:divide-zinc-800/70">
                {Array.isArray(successOrder.items) && successOrder.items.length > 0 ? (
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
          <div className="p-3.5 sm:p-5 border-t border-zinc-100 dark:border-[#23232E] bg-[#F8F9FA] dark:bg-[#09090B] flex flex-col sm:flex-row gap-2 sm:gap-2.5 shrink-0">
            {isCancelled ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setSuccessOrder(null);
                  closeSuccessModal();
                  if (navigateTo && currentPage !== 'menu') navigateTo('menu');
                }}
                className="w-full h-11 sm:h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none"
              >
                <span>Зрозуміло, закрити сповіщення</span>
              </motion.button>
            ) : currentStatus === 'completed' ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleClose}
                className="w-full h-11 sm:h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none"
              >
                <span>Дякую, замовлення отримано!</span>
                <Check className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleClose}
                className="w-full h-11 sm:h-12 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-xs sm:text-sm btn-glow-yellow flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none"
              >
                <span>Повернутися до меню</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SuccessModal;
