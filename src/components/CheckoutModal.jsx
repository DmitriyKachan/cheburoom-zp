import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Store, Banknote, CreditCard, Smartphone, CheckCircle, MapPin } from 'lucide-react';
import { MENU_DATA } from '../data/menuData';

export function CheckoutModal() {
  const {
    items,
    subtotal,
    getTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setSuccessOrder,
    clearCart,
    showToast
  } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+380 (');
  const [payment, setPayment] = useState('Готівка');
  const [comment, setComment] = useState('');

  if (!isCheckoutOpen) return null;

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('380')) val = val.substring(3);
    else if (val.startsWith('0')) val = val.substring(1);
    val = val.substring(0, 9);

    let formatted = '+380';
    if (val.length > 0) formatted += ' (' + val.substring(0, 2);
    if (val.length >= 2) formatted += ') ' + val.substring(2, 5);
    if (val.length >= 5) formatted += ' ' + val.substring(5, 7);
    if (val.length >= 7) formatted += ' ' + val.substring(7, 9);

    setPhone(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Вкажіть ваше ім'я");
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 12) {
      showToast('Вкажіть номер телефону (+380...)');
      return;
    }

    const addressStr = `м. Запоріжжя, ${MENU_DATA.info.address}`;
    const orderId = 'CR-' + Math.floor(100000 + Math.random() * 900000);
    const total = getTotal();

    const itemsText = items.map((i, idx) => {
      let line = `${idx + 1}. ${i.name} × ${i.quantity} шт = ${i.unitPrice * i.quantity} ₴`;
      if (i.crust) line += `\n   ↳ ${i.crust}`;
      if (i.extras && i.extras.length > 0) {
        line += `\n   ↳ Додатки: ${i.extras.map(e => e.name).join(', ')}`;
      }
      return line;
    }).join('\n');

    const fullOrderText = 
`🔔 НОВЕ ЗАМОВЛЕННЯ №${orderId}
🏛 Заклад: ЧЕБУROOM (@cheburoom.zp)
━━━━━━━━━━━━━━━━━━━━
👤 Клієнт: ${name}
📞 Телефон: ${phone}
📍 Отримання: 🏃 Самовивіз (-10%)
🏠 Точка видачі: ${addressStr}
💳 Оплата: ${payment}
${comment.trim() ? '💬 Коментар: ' + comment.trim() + '\n' : ''}━━━━━━━━━━━━━━━━━━━━
📋 ЗАМОВЛЕННЯ:
${itemsText}

💰 Страви: ${subtotal} ₴
🔥 ДО СПЛАТИ: ${total} ₴`;

    setSuccessOrder({
      orderId,
      name,
      phone,
      total,
      subtotal,
      orderType: 'pickup',
      address: addressStr,
      payment,
      items: [...items],
      fullOrderText
    });

    clearCart();
    setIsCheckoutOpen(false);
  };

  const total = getTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white dark:bg-rnr-card rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-rnr-border flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-rnr-border flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-display font-black text-lg text-zinc-950 dark:text-white">
              Оформлення замовлення
            </h3>
            <p className="text-xs text-zinc-500 dark:text-rnr-text">
              Швидке підтвердження без дзвінків оператора
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-rnr-surface text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center justify-center transition-colors"
            aria-label="Закрити"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Pickup Info Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-300">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-zinc-950 dark:text-white">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Точка видачі замовлення:</span>
            </div>
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">
              м. Запоріжжя, {MENU_DATA.info.address}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
              🔥 Самовивіз зі знижкою 10%
            </p>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Ваше ім'я *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Олександр"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-rnr-dark border border-zinc-200 dark:border-rnr-border text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                Телефон *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+380 (95) 123 45 67"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-rnr-dark border border-zinc-200 dark:border-rnr-border text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-2">
              Спосіб оплати:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Готівка', label: 'Готівка', Icon: Banknote },
                { id: 'Карткою в закладі', label: 'Термінал', Icon: CreditCard },
                { id: 'Онлайн', label: 'Онлайн', Icon: Smartphone }
              ].map(item => (
                <label
                  key={item.id}
                  onClick={() => setPayment(item.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer text-center transition-all ${
                    payment === item.id
                      ? 'border-glovo-yellow bg-amber-500/10 dark:bg-amber-500/20 text-zinc-950 dark:text-white ring-2 ring-glovo-yellow'
                      : 'border-zinc-200 dark:border-rnr-border bg-zinc-50 dark:bg-rnr-dark text-zinc-500'
                  }`}
                >
                  <item.Icon className="w-4 h-4 mb-1" />
                  <span className="text-xs font-bold">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
              Коментар до замовлення:
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Наприклад: без цибулі, додати серветки"
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-rnr-dark border border-zinc-200 dark:border-rnr-border text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
            />
          </div>

          {/* Summary Box */}
          <div className="p-4 bg-zinc-50 dark:bg-rnr-dark rounded-2xl border border-zinc-200 dark:border-rnr-border space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Страви:</span>
              <span className="font-bold text-zinc-900 dark:text-white">{subtotal} ₴</span>
            </div>
            <div className="flex justify-between text-base font-black pt-2 border-t border-zinc-200 dark:border-rnr-border text-zinc-950 dark:text-white">
              <span>До сплати:</span>
              <span className="text-amber-500 font-display">{total} ₴</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover active:scale-98 text-zinc-950 font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-all"
          >
            <CheckCircle className="w-4 h-4 text-zinc-950" />
            <span>Підтвердити та замовити ({total} ₴)</span>
          </button>

        </form>
      </motion.div>
    </div>
  );
}
