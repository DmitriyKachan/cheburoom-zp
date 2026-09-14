import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Truck, Store, Banknote, CreditCard, Smartphone, CheckCircle, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MENU_DATA } from '../data/menuData';

export function CheckoutModal() {
  const {
    items,
    subtotal,
    getDeliveryFee,
    getTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setSuccessOrder,
    clearCart,
    showToast
  } = useCart();

  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+380 (');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apt, setApt] = useState('');
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

    let addressStr = '';
    if (orderType === 'delivery') {
      if (!street.trim() || !house.trim()) {
        showToast('Вкажіть вулицю та будинок для доставки');
        return;
      }
      addressStr = `м. Запоріжжя, вул. ${street.trim()}, буд. ${house.trim()}${apt.trim() ? ', кв. ' + apt.trim() : ''}`;
    } else {
      addressStr = `Самовивіз з точки: ${MENU_DATA.info.address}`;
    }

    const orderId = 'CR-' + Math.floor(100000 + Math.random() * 900000);
    const deliveryFee = getDeliveryFee(orderType);
    const total = getTotal(orderType);

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
📍 Отримання: ${orderType === 'delivery' ? '🚗 Доставка кур\'єром' : '🏃 Самовивіз'}
🏠 Адреса: ${addressStr}
💳 Оплата: ${payment}
${comment.trim() ? '💬 Коментар: ' + comment.trim() + '\n' : ''}━━━━━━━━━━━━━━━━━━━━
📋 ЗАМОВЛЕННЯ:
${itemsText}

💰 Страви: ${subtotal} ₴
🚗 Доставка: ${deliveryFee === 0 ? 'Безкоштовно' : deliveryFee + ' ₴'}
🔥 ДО СПЛАТИ: ${total} ₴`;

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#E11D48', '#10B981', '#FBBF24']
      });
    } catch {
      // fallback
    }

    setSuccessOrder({
      orderId,
      name,
      phone,
      total,
      subtotal,
      deliveryFee,
      discount,
      orderType,
      address: addressStr,
      payment,
      items: [...items],
      fullOrderText
    });

    clearCart();
    setIsCheckoutOpen(false);
  };

  const deliveryFee = getDeliveryFee(orderType);
  const total = getTotal(orderType);

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
          
          {/* Toggle Type (Glovo / RnR style) */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-2">
              Спосіб отримання:
            </label>
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-100 dark:bg-rnr-dark border border-zinc-200/80 dark:border-rnr-border">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  orderType === 'delivery'
                    ? 'bg-glovo-yellow text-zinc-950 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Доставка кур'єром</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  orderType === 'pickup'
                    ? 'bg-glovo-yellow text-zinc-950 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Самовивіз (-10%)</span>
              </button>
            </div>
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

          {/* Delivery Fields */}
          {orderType === 'delivery' ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-900 dark:text-white">
                Адреса доставки (Запоріжжя):
              </label>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-7">
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Вулиця / проспект"
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-rnr-dark border border-zinc-200 dark:border-rnr-border text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    required
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    placeholder="Буд."
                    className="w-full px-2 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-rnr-dark border border-zinc-200 dark:border-rnr-border text-zinc-900 dark:text-white text-center focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={apt}
                    onChange={(e) => setApt(e.target.value)}
                    placeholder="Кв./оф."
                    className="w-full px-2 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-rnr-dark border border-zinc-200 dark:border-rnr-border text-zinc-900 dark:text-white text-center focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-300">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Точка видачі замовлення:</span>
              </div>
              <p>м. Запоріжжя, пр. Соборний, 142. Буде гарячим з-під ножа через 12-15 хв!</p>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-2">
              Спосіб оплати:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Готівка', label: 'Готівка', Icon: Banknote },
                { id: 'Карта кур\'єру', label: 'Термінал', Icon: CreditCard },
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
              placeholder="Наприклад: без цибулі, зателефонуйте перед під'їздом"
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-rnr-dark border border-zinc-200 dark:border-rnr-border text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
            />
          </div>

          {/* Summary Box */}
          <div className="p-4 bg-zinc-50 dark:bg-rnr-dark rounded-2xl border border-zinc-200 dark:border-rnr-border space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Страви:</span>
              <span className="font-bold text-zinc-900 dark:text-white">{subtotal} ₴</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Доставка:</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {deliveryFee === 0 ? 'Безкоштовно 🎉' : `${deliveryFee} ₴`}
              </span>
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
