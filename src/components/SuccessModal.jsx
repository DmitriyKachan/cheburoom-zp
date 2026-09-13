import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Check, Send, Copy } from 'lucide-react';

export function SuccessModal() {
  const { successOrder, setSuccessOrder, showToast } = useCart();

  if (!successOrder) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(successOrder.fullOrderText);
    showToast('Деталі замовлення скопійовано!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-castiron-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-castiron-900 rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-warmtan-200 dark:border-castiron-800"
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7" />
        </div>

        <h3 className="font-display text-xl font-black text-castiron-950 dark:text-white mb-1">
          Замовлення прийнято!
        </h3>
        <p className="text-xs text-warmtan-500 dark:text-castiron-700 mb-6">
          Кухар уже випікає ваші гарячі чебуреки з-під ножа.
        </p>

        <div className="p-4 rounded-2xl bg-warmtan-50 dark:bg-castiron-950 border border-warmtan-200 dark:border-castiron-800 text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-warmtan-500 dark:text-castiron-700">Номер:</span>
            <span className="font-mono font-bold text-castiron-950 dark:text-white">
              {successOrder.orderId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-warmtan-500 dark:text-castiron-700">До сплати:</span>
            <span className="font-bold text-fiery-500">{successOrder.total} ₴</span>
          </div>
          <div className="flex justify-between">
            <span className="text-warmtan-500 dark:text-castiron-700">Телефон:</span>
            <span className="font-bold text-castiron-950 dark:text-white">{successOrder.phone}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <a
            href={`https://t.me/cheburoom_zp_bot?start=${successOrder.orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCopy}
            className="touch-target w-full py-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Надіслати чек у Telegram</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="touch-target w-full py-3 rounded-full bg-warmtan-100 dark:bg-castiron-800 hover:bg-warmtan-200 dark:hover:bg-castiron-700 text-castiron-950 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span>Скопіювати деталі замовлення</span>
          </button>

          <button
            type="button"
            onClick={() => setSuccessOrder(null)}
            className="w-full py-2 text-xs text-warmtan-500 hover:text-castiron-950 dark:hover:text-white transition-colors"
          >
            Повернутися на головну
          </button>
        </div>
      </motion.div>
    </div>
  );
}
