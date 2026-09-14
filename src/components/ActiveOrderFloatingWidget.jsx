import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Clock, ChefHat, Sparkles, Check, AlertCircle, ChevronRight, X } from 'lucide-react';

export function ActiveOrderFloatingWidget() {
  const {
    successOrder,
    setSuccessOrder,
    isSuccessModalOpen,
    openSuccessModal,
    currentPage,
    itemCount
  } = useCart();

  // Auto-dismiss floating widget 3.5s after order was marked as completed (issued)
  useEffect(() => {
    if (successOrder?.status === 'completed') {
      const timer = setTimeout(() => {
        setSuccessOrder(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successOrder?.status, setSuccessOrder]);

  // Do not show on admin page, when full modal is open, or when no order exists
  if (!successOrder || isSuccessModalOpen || currentPage === 'admin') {
    return null;
  }

  const isCancelled = successOrder.status === 'cancelled' || successOrder.isDeleted;
  const currentStatus = isCancelled ? 'cancelled' : (successOrder.status || 'new');

  const statusMap = {
    new: {
      label: 'Прийнято рестораном',
      shortLabel: 'Прийнято',
      badgeColor: 'bg-amber-500 text-zinc-950',
      textColor: 'text-amber-500 dark:text-amber-400',
      iconBg: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      borderColor: 'border-amber-500/40 dark:border-amber-500/30',
      stepIndex: 0,
      icon: Clock,
      pulse: false
    },
    preparing: {
      label: 'Кухар смажить чебуреки',
      shortLabel: 'Готується',
      badgeColor: 'bg-blue-500 text-white',
      textColor: 'text-blue-500 dark:text-blue-400',
      iconBg: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
      borderColor: 'border-blue-500/40 dark:border-blue-500/30',
      stepIndex: 1,
      icon: ChefHat,
      pulse: true
    },
    ready: {
      label: 'Гаряче! Можна забирати',
      shortLabel: 'Готово до видачі',
      badgeColor: 'bg-emerald-500 text-white animate-pulse',
      textColor: 'text-emerald-500 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
      borderColor: 'border-emerald-500/50 dark:border-emerald-500/40 shadow-emerald-500/10',
      stepIndex: 2,
      icon: Sparkles,
      pulse: true
    },
    completed: {
      label: 'Видано. Смачного!',
      shortLabel: 'Видано',
      badgeColor: 'bg-zinc-600 text-white',
      textColor: 'text-zinc-400',
      iconBg: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
      borderColor: 'border-zinc-300 dark:border-zinc-700',
      stepIndex: 3,
      icon: Check,
      pulse: false
    },
    cancelled: {
      label: 'Замовлення скасовано',
      shortLabel: 'Скасовано',
      badgeColor: 'bg-rose-500 text-white',
      textColor: 'text-rose-500 dark:text-rose-400',
      iconBg: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
      borderColor: 'border-rose-500/40 dark:border-rose-500/30',
      stepIndex: -1,
      icon: AlertCircle,
      pulse: false
    }
  };

  const activeStatus = statusMap[currentStatus] || statusMap.new;
  const StatusIcon = activeStatus.icon;

  const totalItemsCount = successOrder.items && Array.isArray(successOrder.items)
    ? successOrder.items.reduce((s, i) => s + (i.quantity || 1), 0)
    : 1;

  const handleDismiss = (e) => {
    e.stopPropagation();
    if (isCancelled || currentStatus === 'completed') {
      setSuccessOrder(null);
    } else {
      // If order is active, ask or just hide
      setSuccessOrder(null);
    }
  };

  // Adjust bottom offset on mobile if the floating cart button is visible
  const hasCartFloating = itemCount > 0 && currentPage === 'menu';
  const bottomPositionClass = hasCartFloating
    ? 'bottom-[4.85rem] sm:bottom-6'
    : 'bottom-4 sm:bottom-6';

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Статус активного замовлення"
        initial={{ opacity: 0, y: 35, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 25, scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        onClick={openSuccessModal}
        className={`fixed ${bottomPositionClass} left-3.5 right-3.5 sm:left-auto sm:right-6 sm:w-96 z-40 isolate cursor-pointer select-none group bg-white dark:bg-[#15151B] rounded-2xl shadow-2xl`}
      >
        <div className={`p-3.5 rounded-2xl bg-white dark:bg-[#15151B] border-2 ${activeStatus.borderColor} transition-all duration-200 group-hover:scale-[1.01]`}>
          
          {/* Top Line: Icon + Status + Order ID + Dismiss */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${activeStatus.iconBg} ${activeStatus.pulse ? 'animate-pulse' : ''}`}>
                <StatusIcon className="w-4 h-4" strokeWidth={2.5} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md ${activeStatus.badgeColor}`}>
                    {activeStatus.shortLabel}
                  </span>
                  <span className="font-mono text-[11px] font-black text-zinc-900 dark:text-zinc-100 truncate">
                    #{successOrder.orderId}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium truncate mt-0.5">
                  {activeStatus.label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleDismiss}
                className="w-7 h-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Сховати"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper progress mini bar (if not cancelled) */}
          {!isCancelled && (
            <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/70">
              <div className="grid grid-cols-4 gap-1 items-center">
                {['Прийнято', 'Готується', 'Готово!', 'Видано'].map((label, idx) => {
                  const isPassed = activeStatus.stepIndex > idx;
                  const isCurrent = activeStatus.stepIndex === idx;
                  return (
                    <div key={label} className="flex flex-col gap-1">
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${
                        isPassed
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-amber-400 dark:bg-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-zinc-200 dark:bg-zinc-800'
                      }`} />
                      <span className={`text-[9px] font-bold truncate text-center ${
                        isCurrent
                          ? 'text-amber-600 dark:text-amber-400 font-black'
                          : isPassed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-zinc-400 dark:text-zinc-600'
                      }`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action Line: Summary + "Деталі →" */}
          <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              <strong className="text-zinc-900 dark:text-white font-bold">{totalItemsCount} шт.</strong> • Разом:{' '}
              <strong className="text-amber-600 dark:text-amber-400 font-bold">{successOrder.total} ₴</strong>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
              <span>Відкрити чек</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

export default ActiveOrderFloatingWidget;
