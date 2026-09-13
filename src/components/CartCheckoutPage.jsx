import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  Store,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
  Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MENU_DATA } from '../data/menuData';

export function CartCheckoutPage() {
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    subtotal,
    getDeliveryFee,
    getDiscount,
    getTotal,
    navigateTo,
    setSuccessOrder,
    showToast
  } = useCart();

  // Checkout form state
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup'
  const [deliveryTiming, setDeliveryTiming] = useState('asap'); // 'asap' | 'preorder'
  const [preorderTime, setPreorderTime] = useState('14:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+380 (');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apt, setApt] = useState('');
  const [entrance, setEntrance] = useState('');
  const [intercom, setIntercom] = useState('');
  const [payment, setPayment] = useState('Готівка');
  const [comment, setComment] = useState('');
  const [cutleryCount, setCutleryCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery calculations
  const threshold = MENU_DATA.info.freeDeliveryThreshold;
  const diffToFree = Math.max(0, threshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const deliveryFee = getDeliveryFee(orderType);
  const discount = getDiscount(orderType);
  const total = getTotal(orderType);

  // Cross-sell items (quick additions like sauces & drinks)
  const crossSellItems = useMemo(() => {
    return MENU_DATA.items.filter(
      item => (item.category === 'sauces' || item.category === 'drinks' || item.id === 'snack-fries')
    ).slice(0, 4);
  }, []);

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

    if (items.length === 0) {
      showToast('Ваш кошик порожній! Оберіть страви з меню.');
      return;
    }

    if (!name.trim()) {
      showToast("Будь ласка, вкажіть ваше ім'я");
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 12) {
      showToast('Вкажіть коректний номер телефону (+380...)');
      return;
    }

    let addressStr = '';
    if (orderType === 'delivery') {
      if (subtotal < MENU_DATA.info.minOrderDelivery) {
        showToast(`Мінімальна сума для доставки: ${MENU_DATA.info.minOrderDelivery} ₴`);
        return;
      }
      if (!street.trim() || !house.trim()) {
        showToast('Вкажіть вулицю та номер будинку для доставки');
        return;
      }
      addressStr = `м. Запоріжжя, вул. ${street.trim()}, буд. ${house.trim()}`;
      if (entrance.trim()) addressStr += `, під'їзд ${entrance.trim()}`;
      if (apt.trim()) addressStr += `, кв./оф. ${apt.trim()}`;
      if (intercom.trim()) addressStr += `, домофон: ${intercom.trim()}`;
    } else {
      addressStr = `Самовивіз з ресторану: ${MENU_DATA.info.address}`;
    }

    setIsSubmitting(true);

    const orderId = 'CR-' + Math.floor(100000 + Math.random() * 900000);

    const itemsText = items
      .map((i, idx) => {
        let line = `${idx + 1}. ${i.name} × ${i.quantity} шт = ${i.unitPrice * i.quantity} ₴`;
        if (i.crust) line += `\n   ↳ Тісто: ${i.crust}`;
        if (i.extras && i.extras.length > 0) {
          line += `\n   ↳ Додатки: ${i.extras.map((e) => e.name).join(', ')}`;
        }
        return line;
      })
      .join('\n');

    const timingText = deliveryTiming === 'asap' 
      ? '🔥 Якнайшвидше (орієнтовно 30-45 хв)' 
      : `⏰ На певний час (${preorderTime})`;

    const fullOrderText = 
`🔔 НОВЕ ЗАМОВЛЕННЯ №${orderId}
🏛 Заклад: ЧЕБУROOM (@cheburoom.zp)
━━━━━━━━━━━━━━━━━━━━
👤 Клієнт: ${name}
📞 Телефон: ${phone}
📍 Отримання: ${orderType === 'delivery' ? '🚗 Доставка кур\'єром' : '🏃 Самовивіз (-10%)'}
⏱ Час: ${timingText}
🏠 Адреса: ${addressStr}
💳 Оплата: ${payment}
🍴 Прибори/серветки: ${cutleryCount} шт.
${comment.trim() ? '💬 Коментар: ' + comment.trim() + '\n' : ''}━━━━━━━━━━━━━━━━━━━━
📋 СКЛАД ЗАМОВЛЕННЯ:
${itemsText}

💰 Вартість страв: ${subtotal} ₴
${discount > 0 ? `🎁 Знижка (самовивіз -10%): -${discount} ₴\n` : ''}🚗 Доставка: ${deliveryFee === 0 ? 'Безкоштовно 🎉' : deliveryFee + ' ₴'}
🔥 РАЗОМ ДО СПЛАТИ: ${total} ₴`;

    // Confetti burst
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFC244', '#00A082', '#E11D48', '#3B82F6']
      });
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setSuccessOrder({
        orderId,
        name,
        phone,
        total,
        fullOrderText
      });
      clearCart();
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#09090B] text-zinc-950 dark:text-zinc-50 py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-zinc-200 dark:border-[#23232E]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateTo('menu')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#121215] hover:bg-zinc-100 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-bold shadow-xs transition-all group active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300 group-hover:-translate-x-1 transition-transform" />
              <span>Повернутися до меню</span>
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <span>Головна</span>
              <span>/</span>
              <span className="text-zinc-900 dark:text-white font-bold">Кошик та оформлення</span>
            </div>
          </div>

          {/* Secure Checkout Badge */}
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Швидке замовлення без авторизації</span>
          </div>
        </div>

        {/* Page Title & Status */}
        <div className="mb-8">
          <span className="text-xs font-black text-amber-500 uppercase tracking-wider block mb-1">
            Крок 2 з 2
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 dark:text-white">
            Кошик та оформлення замовлення
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Перевірте обрані чебуреки та вкажіть контактні дані для швидкої доставки
          </p>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto py-16 px-6 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] text-center shadow-lg my-12"
          >
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-display font-black text-xl text-zinc-900 dark:text-white mb-2">
              У вашому кошику поки немає страв
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">
              Оберіть гарячі хрусткі чебуреки з м'ясом, сирні комбо або авторські янтики у нашому каталозі.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('menu')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-sm shadow-md shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Перейти до каталогу меню</span>
            </button>
          </motion.div>
        ) : (
          /* Main 2-Column Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Cart Review & Free Delivery Tracker (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Free Delivery Bar */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] shadow-sm">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2.5">
                  {diffToFree > 0 ? (
                    <span className="text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        Додайте ще на{' '}
                        <strong className="text-amber-500 font-black">{diffToFree} ₴</strong> для безкоштовної доставки!
                      </span>
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Вітаємо! У вас активовано безкоштовну доставку по Запоріжжю! 🛵</span>
                    </span>
                  )}
                  <span className="text-zinc-400 text-xs font-semibold">{progressPercent}%</span>
                </div>

                <div className="h-2.5 w-full bg-zinc-100 dark:bg-[#1A1A22] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full transition-colors ${
                      diffToFree <= 0 ? 'bg-emerald-500' : 'bg-glovo-yellow'
                    }`}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-[#23232E] p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-[#23232E] mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-glovo-yellow/20 text-amber-600 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <h2 className="font-display font-black text-base sm:text-lg text-zinc-900 dark:text-white">
                      Обрані страви
                    </h2>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#1A1A22] text-zinc-800 dark:text-zinc-200">
                      {itemCount}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-zinc-400 hover:text-rose-500 transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                    title="Очистити весь кошик"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Очистити</span>
                  </button>
                </div>

                {/* Items */}
                <div className="divide-y divide-zinc-100 dark:divide-[#1A1A22]">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.cartItemId}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="py-4 first:pt-0 last:pb-0 flex gap-3.5 sm:gap-4 items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-zinc-100 dark:bg-[#1A1A22] shrink-0 border border-zinc-100 dark:border-[#23232E]"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display font-bold text-xs sm:text-sm text-zinc-900 dark:text-white truncate">
                              {item.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-zinc-400 hover:text-rose-500 p-1.5 transition-all duration-200 hover:scale-115 hover:rotate-12 active:scale-90 rounded-lg cursor-pointer"
                              aria-label="Видалити"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {item.crust && (
                            <p className="text-[11px] text-amber-500 font-semibold mt-0.5">
                              {item.crust}
                            </p>
                          )}

                          {item.extras && item.extras.length > 0 && (
                            <p className="text-[11px] text-zinc-400 truncate">
                              + {item.extras.map((e) => e.name).join(', ')}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2.5">
                            <div className="font-display font-black text-sm sm:text-base text-zinc-950 dark:text-white">
                              {item.unitPrice * item.quantity} ₴
                              <span className="text-[11px] text-zinc-400 font-normal ml-1.5 hidden sm:inline">
                                ({item.unitPrice} ₴/шт)
                              </span>
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center bg-zinc-100 dark:bg-[#1A1A22] rounded-xl p-1 gap-1 border border-zinc-200/50 dark:border-[#23232E] shadow-2xs">
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="w-7 h-7 rounded-lg bg-white dark:bg-[#121215] hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition-colors active:scale-90 shadow-xs cursor-pointer"
                                aria-label="Зменшити кількість"
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <span className="px-2.5 text-xs font-black text-zinc-950 dark:text-white min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="w-7 h-7 rounded-lg bg-white dark:bg-[#121215] hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition-colors active:scale-90 shadow-xs cursor-pointer"
                                aria-label="Збільшити кількість"
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Cross-Sell Block: Quick-Add Sauces & Drinks */}
              {crossSellItems.length > 0 && (
                <div className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-[#23232E] p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                        Смакує разом із чебуреками
                      </h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Додайте авторські соуси та освіжаючі напої до замовлення
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {crossSellItems.map((dish) => (
                      <div
                        key={dish.id}
                        className="p-3 rounded-2xl bg-zinc-50 dark:bg-[#1A1A22]/50 border border-zinc-200/70 dark:border-[#23232E] flex flex-col justify-between group card-interactive"
                      >
                        <div className="overflow-hidden rounded-xl mb-2 h-20">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1 leading-snug group-hover:text-amber-500 transition-colors">
                            {dish.name}
                          </p>
                          <span className="text-[11px] text-zinc-400 block mb-2">{dish.weight}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-display font-black text-xs text-zinc-900 dark:text-white">
                            {dish.price} ₴
                          </span>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => addItem(dish)}
                            className="w-7 h-7 rounded-xl bg-glovo-yellow text-zinc-950 flex items-center justify-center font-bold hover:bg-glovo-yellow-hover transition-all shadow-xs cursor-pointer group/plus"
                            title="Додати до кошика"
                          >
                            <Plus className="w-3.5 h-3.5 group-hover/plus:rotate-90 transition-transform duration-200" />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Order Form & Summary (5 cols, sticky on desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-[#121215] rounded-3xl border border-zinc-200 dark:border-[#23232E] p-5 sm:p-7 shadow-lg space-y-5"
              >
                
                {/* Section Title */}
                <div className="border-b border-zinc-100 dark:border-[#23232E] pb-3.5">
                  <h2 className="font-display font-black text-lg text-zinc-950 dark:text-white">
                    Оформлення замовлення
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Заповніть інформацію для кур'єра або точки видачі
                  </p>
                </div>

                {/* Toggle Delivery vs Pickup */}
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-2">
                    Спосіб отримання:
                  </label>
                  <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-100 dark:bg-[#1A1A22] border border-zinc-200/80 dark:border-[#23232E]">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setOrderType('delivery')}
                      className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === 'delivery'
                          ? 'bg-glovo-yellow text-zinc-950 shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Кур'єром</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setOrderType('pickup')}
                      className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === 'pickup'
                          ? 'bg-glovo-yellow text-zinc-950 shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Самовивіз (-10%)</span>
                    </motion.button>
                  </div>
                </div>

                {/* Timing selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-2">
                    Час готовності:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setDeliveryTiming('asap')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        deliveryTiming === 'asap'
                          ? 'border-glovo-yellow bg-amber-500/10 dark:bg-amber-500/20 text-zinc-950 dark:text-white ring-1 ring-glovo-yellow shadow-xs'
                          : 'border-zinc-200 dark:border-[#23232E] text-zinc-500 bg-zinc-50 dark:bg-[#1A1A22]/40 hover:border-zinc-300'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Якнайшвидше (~35 хв)</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setDeliveryTiming('preorder')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        deliveryTiming === 'preorder'
                          ? 'border-glovo-yellow bg-amber-500/10 dark:bg-amber-500/20 text-zinc-950 dark:text-white ring-1 ring-glovo-yellow shadow-xs'
                          : 'border-zinc-200 dark:border-[#23232E] text-zinc-500 bg-zinc-50 dark:bg-[#1A1A22]/40 hover:border-zinc-300'
                      }`}
                    >
                      <span>На обраний час</span>
                    </motion.button>
                  </div>

                  {deliveryTiming === 'preorder' && (
                    <div className="mt-2.5">
                      <input
                        type="time"
                        value={preorderTime}
                        onChange={(e) => setPreorderTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white font-mono focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Recipient Details */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      Ваше ім'я *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Олександр"
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      Номер телефону *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="+380 (95) 123 45 67"
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address OR Pickup Info */}
                {orderType === 'delivery' ? (
                  <div className="space-y-2.5 pt-1">
                    <label className="block text-xs font-bold text-zinc-900 dark:text-white">
                      Адреса доставки (Запоріжжя) *
                    </label>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-8">
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Вулиця / проспект"
                          className="w-full px-3 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          required
                          value={house}
                          onChange={(e) => setHouse(e.target.value)}
                          placeholder="Будинок"
                          className="w-full px-3 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white text-center focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={entrance}
                        onChange={(e) => setEntrance(e.target.value)}
                        placeholder="Під'їзд"
                        className="w-full px-2 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white text-center focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                      />
                      <input
                        type="text"
                        value={apt}
                        onChange={(e) => setApt(e.target.value)}
                        placeholder="Кв./оф."
                        className="w-full px-2 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white text-center focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                      />
                      <input
                        type="text"
                        value={intercom}
                        onChange={(e) => setIntercom(e.target.value)}
                        placeholder="Код / дом."
                        className="w-full px-2 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white text-center focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-300">
                    <div className="font-black flex items-center gap-1.5 mb-1 text-zinc-950 dark:text-white">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span>Точка видачі замовлення:</span>
                    </div>
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                      м. Запоріжжя, {MENU_DATA.info.address}
                    </p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-bold">
                      🔥 Знижка 10% на все замовлення вже застосована!
                    </p>
                  </div>
                )}

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-2">
                    Спосіб оплати:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Готівка', label: 'Готівка', Icon: Banknote },
                      { id: 'Термінал кур\'єру', label: 'Термінал', Icon: CreditCard },
                      { id: 'Онлайн карткою', label: 'Онлайн', Icon: Smartphone }
                    ].map((item) => (
                      <motion.button
                        type="button"
                        key={item.id}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPayment(item.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer text-center transition-all ${
                          payment === item.id
                            ? 'border-glovo-yellow bg-amber-500/10 dark:bg-amber-500/20 text-zinc-950 dark:text-white ring-2 ring-glovo-yellow shadow-xs'
                            : 'border-zinc-200 dark:border-[#23232E] bg-zinc-50 dark:bg-[#1A1A22]/40 text-zinc-500 hover:border-zinc-300'
                        }`}
                      >
                        <item.Icon className="w-4 h-4 mb-1" />
                        <span className="text-[11px] font-bold">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Comment & Cutlery */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      Коментар для кухаря або кур'єра:
                    </label>
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Без цибулі, зателефонувати за 5 хв..."
                      className="w-full px-3 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-[#1A1A22]/40 border border-zinc-200 dark:border-[#23232E]">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      <Utensils className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Прибори та серветки:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCutleryCount(Math.max(0, cutleryCount - 1))}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] flex items-center justify-center text-zinc-600 dark:text-zinc-300 cursor-pointer active:scale-90 transition-transform"
                      >
                        -
                      </button>
                      <span className="text-xs font-black min-w-[14px] text-center">
                        {cutleryCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCutleryCount(cutleryCount + 1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] flex items-center justify-center text-zinc-600 dark:text-zinc-300 cursor-pointer active:scale-90 transition-transform"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Final Bill Breakdown */}
                <div className="p-4 bg-zinc-50 dark:bg-[#1A1A22] rounded-2xl border border-zinc-200 dark:border-[#23232E] space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Страви ({itemCount} шт):</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{subtotal} ₴</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Знижка на самовивіз (-10%):</span>
                      <span>-{discount} ₴</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Доставка кур'єром:</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {orderType === 'pickup'
                        ? 'Самовивіз (0 ₴)'
                        : deliveryFee === 0
                        ? 'Безкоштовно 🎉'
                        : `${deliveryFee} ₴`}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-base font-black pt-2.5 border-t border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white">
                    <span>Разом до сплати:</span>
                    <span className="text-xl text-amber-500 font-display">{total} ₴</span>
                  </div>
                </div>

                {/* Submit Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover active:scale-98 text-zinc-950 font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 btn-glow-yellow animate-shimmer disabled:opacity-75 cursor-pointer group/submit select-none"
                >
                  <CheckCircle className="w-5 h-5 text-zinc-950 group-hover/submit:scale-115 transition-transform" />
                  <span>
                    {isSubmitting ? 'Оформлення...' : `Підтвердити замовлення • ${total} ₴`}
                  </span>
                </button>

                <p className="text-[11px] text-center text-zinc-400 leading-relaxed">
                  Натискаючи кнопку, ви підтверджуєте замовлення без потреби в телефонних дзвінках.
                </p>

              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
