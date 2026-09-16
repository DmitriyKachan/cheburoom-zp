import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Store,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  CheckCircle,
  Check,
  AlertCircle,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
  Utensils
} from 'lucide-react';
import { MENU_DATA } from '../data/menuData';
import { getUkrainianPhoneInfo } from '../services/phoneValidation';

export function CartCheckoutPage() {
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    subtotal,
    getTotal,
    navigateTo,
    successOrder,
    setSuccessOrder,
    showToast,
    setSelectedDishForModal
  } = useCart();

  // Checkout form state
  const [pickupTiming, setPickupTiming] = useState('asap'); // 'asap' | 'preorder'
  const [preorderTime, setPreorderTime] = useState('14:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+380 (');
  const [payment, setPayment] = useState('Готівка');
  const [comment, setComment] = useState('');
  const [cutleryCount, setCutleryCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone validation with operator verification
  const phoneValidation = useMemo(() => getUkrainianPhoneInfo(phone), [phone]);

  // Anti-Spam state
  const [honeypot, setHoneypot] = useState('');
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(() => {
    try {
      const lastOrderAt = parseInt(localStorage.getItem('cheburoom_last_order_ts') || '0', 10);
      const diff = Math.floor((Date.now() - lastOrderAt) / 1000);
      if (diff < 60) return 60 - diff;
    } catch {}
    return 0;
  });

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((sec) => {
        if (sec <= 1) {
          clearInterval(timer);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Takeaway calculations (no discount)
  const total = getTotal();

  // Cross-sell items: stable top complementary recommendations (snacks, wok, drinks)
  const crossSellItems = useMemo(() => {
    const preferredIds = ['wok-chicken-cream', 'wok-pulled-beef', 'fry-fries', 'fry-mozzarella'];
    const candidates = preferredIds
      .map(id => MENU_DATA.items.find(item => item.id === id))
      .filter(Boolean);

    if (candidates.length === 4) return candidates;

    return MENU_DATA.items
      .filter(item => item.category === 'wok' || item.category === 'deepfry' || item.category === 'coffee')
      .slice(0, 4);
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

  const processOrderSubmission = () => {
    const addressStr = MENU_DATA.info.address.includes('Запоріжжя')
      ? MENU_DATA.info.address
      : `м. Запоріжжя, ${MENU_DATA.info.address}`;
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

    const timingText = pickupTiming === 'asap' 
      ? '🔥 Якнайшвидше (орієнтовно 7-10 хв)' 
      : `⏰ На певний час (${preorderTime})`;

    const paymentText = payment;

    const fullOrderText = 
`🔔 НОВЕ ЗАМОВЛЕННЯ №${orderId}
🏛 Заклад: ЧЕБУROOM (@cheburoom.zp)
━━━━━━━━━━━━━━━━━━━━
👤 Клієнт: ${name}
📞 Телефон: ${phone}
📍 Отримання: 🏃 Самовивіз
⏱ Час: ${timingText}
🏠 Точка видачі: ${addressStr}
💳 Оплата: ${paymentText}
🍴 Прибори/серветки: ${cutleryCount} шт.
${comment.trim() ? '💬 Коментар: ' + comment.trim() + '\n' : ''}━━━━━━━━━━━━━━━━━━━━
📋 СКЛАД ЗАМОВЛЕННЯ:
${itemsText}

🔥 РАЗОМ ДО СПЛАТИ: ${total} ₴`;

    // Anti-spam cooldown stamp
    try {
      localStorage.setItem('cheburoom_last_order_ts', Date.now().toString());
    } catch {}
    setCooldownSeconds(60);

    // Open success modal
    setTimeout(() => {
      setSuccessOrder({
        orderId,
        name,
        phone,
        total,
        subtotal,
        discount: 0,
        orderType: 'pickup',
        address: addressStr,
        timing: timingText,
        payment: paymentText,
        cutleryCount,
        comment,
        items: [...items],
        fullOrderText
      });
      clearCart();
      setIsSubmitting(false);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Honeypot check (Bots)
    if (honeypot) {
      showToast('Дякуємо! Замовлення надіслано.');
      clearCart();
      return;
    }

    // 2. Cooldown check (60s rate-limit per device)
    if (cooldownSeconds > 0) {
      showToast(`Зачекайте ще ${cooldownSeconds} с перед оформленням наступного замовлення`);
      return;
    }

    if (items.length === 0) {
      showToast('Ваш кошик порожній! Оберіть страви з меню.');
      return;
    }

    if (!name.trim()) {
      showToast("Будь ласка, вкажіть ваше ім'я");
      return;
    }

    // 3. Strict Phone & Ukrainian Operator Code validation
    if (!phoneValidation.isValid) {
      if (phoneValidation.reason === 'invalid_operator' || phoneValidation.reason === 'repetitive_digits') {
        showToast('Введіть справжній номер телефону');
      } else if (phoneValidation.reason === 'incomplete_number' || phoneValidation.reason === 'incomplete_code' || phoneValidation.reason === 'empty') {
        showToast('Вкажіть повний номер телефону');
      } else {
        showToast('Введіть справжній номер телефону');
      }
      return;
    }

    // 4. Duplicate active order confirmation
    if (successOrder && !successOrder.isDeleted && (successOrder.status === 'new' || successOrder.status === 'preparing')) {
      setShowDuplicateConfirm(true);
      return;
    }

    processOrderSubmission();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#09090B] text-zinc-950 dark:text-zinc-50 py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-zinc-200 dark:border-[#23232E]">
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, x: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => navigateTo('menu')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#121215] hover:bg-zinc-100 dark:hover:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-bold shadow-xs transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300 group-hover:-translate-x-1 transition-transform" />
              <span>Повернутися до меню</span>
            </motion.button>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <button
                type="button"
                onClick={() => navigateTo('menu')}
                className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                Головна
              </button>
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
            Перевірте обрані страви та вкажіть час для швидкого самовивозу
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
              Оберіть гарячі хрусткі чебуреки з м'ясом, сирні комбо або авторський WOK у нашому каталозі.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => navigateTo('menu')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-sm shadow-md shadow-amber-400/20 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Перейти до каталогу меню</span>
            </motion.button>
          </motion.div>
        ) : (
          /* Main 2-Column Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Cart Review & Takeaway Benefit (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Fast Pickup Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black shrink-0 border border-amber-500/20">
                    <Store className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-zinc-950 dark:text-white">
                      Швидкий самовивіз без черги
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Готуємо з-під ножа за 7–10 хвилин до вашого приходу • вул. Олександрівська, 75
                    </p>
                  </div>
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

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={clearCart}
                    className="text-xs text-zinc-400 hover:text-rose-500 transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                    title="Очистити весь кошик"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Очистити</span>
                  </motion.button>
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
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.25, rotate: 12 }}
                              whileTap={{ scale: 0.85 }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-zinc-400 hover:text-rose-500 p-1.5 transition-colors rounded-lg cursor-pointer"
                              aria-label="Видалити"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
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
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-white dark:bg-[#121215] hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                                aria-label="Зменшити кількість"
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <span key={item.quantity} className="animate-badge-pop px-2.5 text-xs font-black text-zinc-950 dark:text-white min-w-[20px] text-center inline-block">
                                {item.quantity}
                              </span>
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-white dark:bg-[#121215] hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
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
                    {crossSellItems.map((dish) => {
                      const hasExtras = dish.customizable || (dish.options && dish.options.extras && dish.options.extras.length > 0);
                      const inCartItem = items.find((i) => i.id === dish.id);
                      const inCartQty = inCartItem ? inCartItem.quantity : 0;

                      return (
                        <motion.div
                          whileHover={{ y: -3, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          key={dish.id}
                          onClick={() => setSelectedDishForModal(dish)}
                          className={`p-3 rounded-2xl bg-zinc-50 dark:bg-[#1A1A22]/50 border transition-all flex flex-col justify-between group card-interactive cursor-pointer relative ${
                            inCartQty > 0
                              ? 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10'
                              : 'border-zinc-200/70 dark:border-[#23232E] hover:border-amber-400/60'
                          }`}
                        >
                          {/* In-cart badge indicator */}
                          {inCartQty > 0 && (
                            <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black shadow-xs flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              <span>{inCartQty}</span>
                            </div>
                          )}

                          <div className="overflow-hidden rounded-xl mb-2 h-20 relative">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                            />
                          </div>

                          <div>
                            <p className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1 leading-snug group-hover:text-amber-500 transition-colors">
                              {dish.name}
                            </p>
                            <span className="text-[11px] text-zinc-400 block mb-2">{dish.weight}</span>
                          </div>

                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-zinc-200/40 dark:border-[#23232E]">
                            <span className="font-display font-black text-xs text-zinc-900 dark:text-white">
                              {dish.price} ₴
                            </span>

                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasExtras) {
                                  setSelectedDishForModal(dish);
                                } else {
                                  addItem(dish);
                                }
                              }}
                              className={`h-7 rounded-xl flex items-center justify-center font-black text-xs transition-all shadow-xs cursor-pointer ${
                                inCartQty > 0
                                  ? 'px-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                                  : 'w-7 bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950'
                              }`}
                              title={inCartQty > 0 ? `Вже у кошику (${inCartQty} шт). Натисніть, щоб додати ще` : (hasExtras ? "Обрати додатки та соуси" : "Додати до кошика")}
                            >
                              {inCartQty > 0 ? (
                                <span className="flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span className="text-[11px] font-bold">+{inCartQty}</span>
                                </span>
                              ) : (
                                <Plus className="w-3.5 h-3.5" />
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
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
                    Швидкий самовивіз без черги: приготуємо до вашого приходу
                  </p>
                </div>

                {/* Pickup Location Info */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs">
                  <div className="font-black flex items-center gap-1.5 mb-1 text-zinc-950 dark:text-white">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Точка видачі замовлення:</span>
                  </div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">
                    {MENU_DATA.info.address}
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Готуємо свіже з-під ножа за 7–10 хвилин</span>
                  </p>
                </div>

                {/* Timing selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-2">
                    Час готовності:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      onClick={() => setPickupTiming('asap')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        pickupTiming === 'asap'
                          ? 'border-glovo-yellow bg-amber-500/10 dark:bg-amber-500/20 text-zinc-950 dark:text-white ring-1 ring-glovo-yellow shadow-xs'
                          : 'border-zinc-200 dark:border-[#23232E] text-zinc-500 bg-zinc-50 dark:bg-[#1A1A22]/40 hover:border-zinc-300'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Якнайшвидше (~7-10 хв)</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      onClick={() => setPickupTiming('preorder')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        pickupTiming === 'preorder'
                          ? 'border-glovo-yellow bg-amber-500/10 dark:bg-amber-500/20 text-zinc-950 dark:text-white ring-1 ring-glovo-yellow shadow-xs'
                          : 'border-zinc-200 dark:border-[#23232E] text-zinc-500 bg-zinc-50 dark:bg-[#1A1A22]/40 hover:border-zinc-300'
                      }`}
                    >
                      <span>На обраний час</span>
                    </motion.button>
                  </div>

                  {pickupTiming === 'preorder' && (
                    <div className="mt-2.5">
                      <input
                        id="checkout-preorder-time"
                        name="preorderTime"
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
                    <label htmlFor="checkout-customer-name" className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      Ваше ім'я *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        id="checkout-customer-name"
                        name="customerName"
                        autoComplete="name"
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
                    <label htmlFor="checkout-customer-phone" className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      Номер телефону *
                    </label>
                    <div className="relative">
                      <Phone className={`w-4 h-4 absolute left-3 top-3 transition-colors ${
                        (phoneValidation.reason === 'invalid_operator' || phoneValidation.reason === 'repetitive_digits')
                          ? 'text-rose-500'
                          : 'text-zinc-400'
                      }`} />
                      <input
                        id="checkout-customer-phone"
                        name="customerPhone"
                        autoComplete="tel"
                        type="tel"
                        required
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="+380 (95) 123 45 67"
                        className={`w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border transition-all font-mono ${
                          (phoneValidation.reason === 'invalid_operator' || phoneValidation.reason === 'repetitive_digits')
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-500 text-rose-700 dark:text-rose-300 focus:ring-2 focus:ring-rose-500/30 focus:outline-none'
                            : 'bg-zinc-50 dark:bg-[#1A1A22] border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none'
                        }`}
                      />
                    </div>

                    {(phoneValidation.reason === 'invalid_operator' || phoneValidation.reason === 'repetitive_digits') && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-500 dark:text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Введіть справжній номер телефону</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-2">
                    Спосіб оплати:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'Готівка', label: 'Готівка', Icon: Banknote },
                      { id: 'Карткою в закладі', label: 'Термінал', Icon: CreditCard }
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
                    <label htmlFor="checkout-order-comment" className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      Коментар до замовлення:
                    </label>
                    <input
                      id="checkout-order-comment"
                      name="orderComment"
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
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        onClick={() => setCutleryCount(Math.max(0, cutleryCount - 1))}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] flex items-center justify-center text-zinc-600 dark:text-zinc-300 cursor-pointer shadow-2xs"
                      >
                        -
                      </motion.button>
                      <span key={cutleryCount} className="animate-badge-pop text-xs font-black min-w-[14px] text-center inline-block">
                        {cutleryCount}
                      </span>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        onClick={() => setCutleryCount(cutleryCount + 1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-[#121215] border border-zinc-200 dark:border-[#23232E] flex items-center justify-center text-zinc-600 dark:text-zinc-300 cursor-pointer shadow-2xs"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Final Bill Breakdown */}
                <div className="p-4 bg-zinc-50 dark:bg-[#1A1A22] rounded-2xl border border-zinc-200 dark:border-[#23232E] space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Страви ({itemCount} шт):</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{subtotal} ₴</span>
                  </div>

                  <div className="flex justify-between items-baseline text-base font-black pt-2.5 border-t border-zinc-200 dark:border-[#23232E] text-zinc-950 dark:text-white">
                    <span>Разом до сплати:</span>
                    <span className="text-xl text-amber-500 font-display">{total} ₴</span>
                  </div>
                </div>

                {/* Security honeypot field - invisible to genuine users */}
                <div className="opacity-0 absolute -top-[9999px] -left-[9999px] h-0 w-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
                  <input
                    type="text"
                    name="b_security_verification"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </div>

                {/* Submit Order CTA */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || cooldownSeconds > 0}
                  whileHover={{ scale: (isSubmitting || cooldownSeconds > 0) ? 1 : 1.02, y: (isSubmitting || cooldownSeconds > 0) ? 0 : -2 }}
                  whileTap={{ scale: (isSubmitting || cooldownSeconds > 0) ? 1 : 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-full h-14 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 btn-glow-yellow animate-shimmer disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group/submit select-none shadow-md shadow-amber-400/25"
                >
                  <CheckCircle className="w-5 h-5 text-zinc-950 group-hover/submit:scale-120 group-hover/submit:rotate-6 transition-transform duration-300" />
                  <span>
                    {isSubmitting
                      ? 'Оформлення...'
                      : cooldownSeconds > 0
                      ? `⏱️ Зачекайте ${cooldownSeconds} с...`
                      : `Підтвердити замовлення • ${total} ₴`}
                  </span>
                </motion.button>

                <p className="text-[11px] text-center text-zinc-400 leading-relaxed">
                  Натискаючи кнопку, ви підтверджуєте замовлення без потреби в телефонних дзвінках.
                </p>

              </form>
            </div>

          </div>
        )}

      </div>

      {/* Duplicate Active Order Warning Modal */}
      <AnimatePresence>
        {showDuplicateConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#15151C] border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto text-xl">
                ⚠️
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="font-display font-black text-base text-zinc-950 dark:text-white">
                  У вас вже є активне замовлення!
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Ваше попереднє замовлення <span className="font-mono font-bold text-zinc-900 dark:text-zinc-200">#{successOrder?.orderId}</span> вже обробляється на кухні. Бажаєте створити ще одне окреме замовлення?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDuplicateConfirm(false)}
                  className="px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Скасувати
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDuplicateConfirm(false);
                    processOrderSubmission();
                  }}
                  className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black shadow-sm transition-colors cursor-pointer"
                >
                  Так, оформити ще одне
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
