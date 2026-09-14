import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import {
  authenticateAdmin,
  isAdminAuthenticated,
  logoutAdmin,
  changeAdminPassword,
  getLockoutRemainingSeconds
} from '../../services/adminAuthService';
import {
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  User,
  ShoppingBag,
  Camera,
  Download,
  Upload,
  RotateCcw,
  LogOut,
  ArrowLeft,
  X,
  Sparkles,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { CheburoomLogo } from '../CheburoomLogo';

const CATEGORIES = [
  { id: 'all', name: 'Всі категорії' },
  { id: 'chebureks', name: 'Чебуреки' },
  { id: 'wok', name: 'WOK' },
  { id: 'deepfry', name: 'Фритюр' },
  { id: 'breakfast', name: 'Сніданки' },
  { id: 'salads', name: 'Салати' },
  { id: 'coffee', name: 'Кава' },
  { id: 'desserts', name: 'Десерти' },
  { id: 'drinks', name: 'Напої' },
  { id: 'sets', name: 'Сети' }
];

export function AdminPage() {
  const {
    menuItems,
    addDish,
    updateDish,
    deleteDish,
    toggleDishAvailability,
    resetToDefaultMenu,
    exportMenuBackup,
    importMenuBackup,
    ordersHistory,
    updateOrderStatus,
    clearOrdersHistory,
    navigateTo,
    showToast
  } = useCart();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [lockoutSec, setLockoutSec] = useState(() => getLockoutRemainingSeconds());
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Active Tab: 'menu' | 'orders' | 'security'
  const [activeTab, setActiveTab] = useState('menu');

  // Dish Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Edit / Create Modal State
  const [editingDish, setEditingDish] = useState(null); // null when closed, { ... } when open
  const [isNewDish, setIsNewDish] = useState(false);

  // Change Password Form State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  // Backup file ref
  const backupFileInputRef = useRef(null);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSec <= 0) return;
    const timer = setInterval(() => {
      const rem = getLockoutRemainingSeconds();
      setLockoutSec(rem);
      if (rem <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSec]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);

    try {
      await authenticateAdmin(passwordInput);
      setIsAuthenticated(true);
      setPasswordInput('');
      showToast('Успішний вхід до панелі керування!');
    } catch (err) {
      setAuthError(err.message || 'Помилка авторизації');
      const rem = getLockoutRemainingSeconds();
      if (rem > 0) setLockoutSec(rem);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    showToast('Сесію завершено');
  };

  // Dish edit save handler
  const handleSaveDish = (e) => {
    e.preventDefault();
    if (!editingDish.name.trim()) {
      showToast('Вкажіть назву страви');
      return;
    }

    if (isNewDish) {
      addDish(editingDish);
      showToast(`Страву «${editingDish.name}» успішно створено!`);
    } else {
      updateDish(editingDish.id, editingDish);
      showToast(`Страву «${editingDish.name}» оновлено!`);
    }
    setEditingDish(null);
  };

  // Image upload in edit modal
  const handleDishPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Розмір фото не повинен перевищувати 8 МБ');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEditingDish(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Password change handler
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: 'Нові паролі не співпадають!' });
      return;
    }

    try {
      await changeAdminPassword(oldPass, newPass);
      setPassMsg({ type: 'success', text: 'Пароль успішно змінено!' });
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      showToast('Пароль адміністратора оновлено!');
    } catch (err) {
      setPassMsg({ type: 'error', text: err.message || 'Помилка зміни пароля' });
    }
  };

  // Backup restore file upload
  const handleBackupFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        importMenuBackup(parsed);
        showToast('Меню успішно відновлено з резервної копії!');
      } catch {
        showToast('Помилка читання файлу резервної копії');
      }
    };
    reader.readAsText(file);
  };

  // Filtered dishes
  const filteredDishes = menuItems.filter(d => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.desc && d.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // ==========================================
  // VIEW 1: SECURE LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090B] text-zinc-50 flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-500 selection:text-black">
        <div className="w-full max-w-md">
          {/* Top Logo */}
          <div className="text-center mb-8">
            <div className="inline-block mb-3">
              <CheburoomLogo size="lg" />
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mt-1">
              <Shield className="w-4 h-4" />
              <span>Панель керування закладом</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Закритий розділ для власників та персоналу ресторану
            </p>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#121216] border border-zinc-800 shadow-2xl space-y-5"
          >
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  Пароль адміністратора:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutSec > 0 || isSubmittingAuth}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Введіть пароль..."
                    className="w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error / Lockout alert */}
              {lockoutSec > 0 ? (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>
                    Захисне блокування: зачекайте <strong>{lockoutSec} сек.</strong>
                  </span>
                </div>
              ) : authError ? (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              ) : null}

              <motion.button
                type="submit"
                disabled={lockoutSec > 0 || isSubmittingAuth}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10 disabled:opacity-50 transition-colors"
              >
                <Unlock className="w-4 h-4" />
                <span>{isSubmittingAuth ? 'Перевірка...' : 'Увійти до панелі'}</span>
              </motion.button>
            </form>

            <div className="pt-3 border-t border-zinc-800/80 text-center space-y-2">
              <p className="text-[11px] text-zinc-500">
                За замовчуванням пароль: <code className="bg-zinc-800 text-amber-400 px-1.5 py-0.5 rounded font-mono">chebu2026</code>
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => navigateTo('menu')}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Повернутися на сайт ресторану</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0A0A0E] text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#121218]/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <CheburoomLogo size="sm" />
            <span className="hidden sm:inline-block h-4 w-px bg-zinc-800" />
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Панель керування</span>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Меню ({menuItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Замовлення ({ordersHistory.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'security'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Безпека</span>
            </button>
          </div>

          {/* Right Action: Site & Logout */}
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('menu')}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Перейти на сайт ресторану"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">На сайт</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-8 h-8 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Вийти з панелі"
            >
              <LogOut className="w-3.5 h-3.5" />
            </motion.button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* ========================================== */}
        {/* TAB 1: MENU & DISHES MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-display font-black text-xl sm:text-2xl text-white">
                  Керування меню ресторану
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Змінюйте ціни, завантажуйте фото, ставте страви у стоп-лист або створюйте новинки
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setIsNewDish(true);
                  setEditingDish({
                    id: `dish-${Date.now()}`,
                    name: '',
                    category: 'chebureks',
                    price: 95,
                    weight: '180 г',
                    desc: '',
                    image: '/images/dishes/cheb-beef-pork.jpg',
                    available: true,
                    isHit: false,
                    isNew: true,
                    isSpicy: false,
                    customizable: true
                  });
                }}
                className="px-4 py-2.5 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/15"
              >
                <Plus className="w-4 h-4" />
                <span>Додати нову страву</span>
              </motion.button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#13131A] p-3 rounded-2xl border border-zinc-800">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Швидкий пошук страви..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

            </div>

            {/* Dishes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDishes.map((dish) => {
                const isAvail = dish.available !== false;
                return (
                  <div
                    key={dish.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
                      isAvail
                        ? 'bg-[#14141B] border-zinc-800 hover:border-zinc-700'
                        : 'bg-[#14141B]/50 border-rose-950/60 opacity-80'
                    }`}
                  >
                    {/* Top Row: Image & Info */}
                    <div className="flex gap-3 items-start">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className={`w-full h-full object-cover ${!isAvail ? 'grayscale' : ''}`}
                        />
                        {!isAvail && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[9px] font-black text-rose-400 text-center uppercase p-0.5">
                            Стоп
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {dish.category}
                          </span>
                          {dish.isHit && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950">
                              ХІТ
                            </span>
                          )}
                          {dish.isSpicy && <span title="Гостре">🌶️</span>}
                        </div>

                        <h3 className="font-bold text-sm text-white truncate">
                          {dish.name}
                        </h3>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          {dish.desc || dish.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Price & Controls */}
                    <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-black text-base text-amber-400">
                          {dish.price} ₴
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          • {dish.weight}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Stop-list button */}
                        <button
                          type="button"
                          onClick={() => toggleDishAvailability(dish.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                            isAvail
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 hover:bg-rose-950 hover:text-rose-400 hover:border-rose-800'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800 hover:bg-emerald-950 hover:text-emerald-400'
                          }`}
                          title={isAvail ? "Поставити в стоп-лист" : "Повернути в наявність"}
                        >
                          {isAvail ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isAvail ? 'В наявності' : 'Стоп'}</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewDish(false);
                            setEditingDish({ ...dish });
                          }}
                          className="w-7 h-7 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                          title="Редагувати страву"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Видалити страву «${dish.name}» з меню?`)) {
                              deleteDish(dish.id);
                              showToast(`Страву «${dish.name}» видалено`);
                            }
                          }}
                          className="w-7 h-7 rounded-xl bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Видалити страву"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: LIVE ORDERS LOG */}
        {/* ========================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-black text-xl sm:text-2xl text-white">
                  Журнал онлайн-замовлень
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Всі замовлення, оформлені клієнтами через сайт у реальному часі
                </p>
              </div>

              {ordersHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Очистити історію замовлень?')) {
                      clearOrdersHistory();
                      showToast('Історію очищено');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-xs font-bold text-zinc-400 transition-colors cursor-pointer"
                >
                  Очистити список
                </button>
              )}
            </div>

            {ordersHistory.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#13131A] border border-zinc-800">
                <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="font-bold text-base text-zinc-300 mb-1">
                  Нових замовлень поки немає
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Як тільки клієнт оформить замовлення на сайті, воно миттєво з'явиться тут із контактами та складом.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {ordersHistory.map((order) => {
                  const statusColors = {
                    new: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
                    preparing: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
                    ready: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                    completed: 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  };

                  return (
                    <div
                      key={order.orderId}
                      className="p-4 sm:p-5 rounded-2xl bg-[#13131A] border border-zinc-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400">
                            #{order.orderId}
                          </span>
                          <span className="text-xs font-bold text-zinc-400">
                            {order.timing}
                          </span>
                        </div>

                        {/* Status dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status || 'new'}
                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${statusColors[order.status || 'new']}`}
                          >
                            <option value="new">🟡 Нове замовлення</option>
                            <option value="preparing">🔵 Готується на кухні</option>
                            <option value="ready">🟢 Готове до видачі</option>
                            <option value="completed">⚪ Видано клієнту</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="font-bold">{order.name}</span>
                        </div>
                        <a
                          href={`tel:${order.phone}`}
                          className="flex items-center gap-1.5 text-amber-400 hover:underline font-bold"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{order.phone}</span>
                        </a>
                        <div className="text-zinc-400">
                          Оплата: <strong className="text-zinc-200">{order.payment}</strong>
                        </div>
                        {order.cutleryCount > 0 && (
                          <div className="text-zinc-400">
                            Прибори: <strong className="text-zinc-200">{order.cutleryCount} шт.</strong>
                          </div>
                        )}
                      </div>

                      {/* Comment */}
                      {order.comment && (
                        <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
                          💬 <em>«{order.comment}»</em>
                        </div>
                      )}

                      {/* Items */}
                      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 divide-y divide-zinc-800/60 text-xs">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="py-1.5 first:pt-0 last:pb-0 flex justify-between">
                            <div>
                              <span className="font-bold text-white">{item.name}</span>
                              <span className="text-amber-400 font-bold ml-1.5">× {item.quantity}</span>
                              {item.crust && <span className="text-zinc-500 ml-2">({item.crust})</span>}
                              {item.extras?.length > 0 && (
                                <span className="text-zinc-400 ml-2">
                                  + {item.extras.map(e => e.name).join(', ')}
                                </span>
                              )}
                            </div>
                            <span className="font-mono font-bold text-zinc-300">
                              {(item.unitPrice || item.price) * item.quantity} ₴
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="flex justify-end pt-1">
                        <span className="font-display font-black text-sm text-zinc-200">
                          Разом: <strong className="text-amber-400 text-base">{order.total} ₴</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: SECURITY & BACKUP */}
        {/* ========================================== */}
        {activeTab === 'security' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="font-display font-black text-xl sm:text-2xl text-white">
                Безпека та резервне копіювання
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Керування паролем доступу, збереження копій меню та аварійне відновлення
              </p>
            </div>

            {/* Change Password Form */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#13131A] border border-zinc-800 space-y-4">
              <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Зміна пароля адміністратора</span>
              </h2>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Поточний пароль:
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="Введіть старий пароль..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Новий пароль:
                    </label>
                    <input
                      type="password"
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Мінімум 6 символів..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Підтвердження пароля:
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Повторіть новий пароль..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {passMsg.text && (
                  <div className={`p-3 rounded-xl text-xs font-bold ${passMsg.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-rose-950/60 text-rose-300 border border-rose-800'}`}>
                    {passMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display font-black text-xs cursor-pointer shadow-sm"
                >
                  Оновити пароль
                </button>
              </form>
            </div>

            {/* Backup & Restore Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#13131A] border border-zinc-800 space-y-4">
              <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Резервне копіювання меню</span>
              </h2>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Збережіть усі ваші страви, налаштовані ціни та завантажені фотографії у безпечний файл резервної копії (.json) або відновіть дані на іншому пристрої.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={exportMenuBackup}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2 cursor-pointer border border-zinc-700"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Зберегти резервну копію (.json)</span>
                </button>

                <input
                  type="file"
                  ref={backupFileInputRef}
                  accept=".json"
                  onChange={handleBackupFileSelect}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => backupFileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2 cursor-pointer border border-zinc-700"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>Відновити з файлу</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Скинути все меню до початкового заводського каталогу ЧЕБУROOM?')) {
                      resetToDefaultMenu();
                      showToast('Меню скинуто до стандартного');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold flex items-center gap-2 cursor-pointer border border-rose-800/60"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Скинути до заводського</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================== */}
      {/* MODAL: EDIT / CREATE DISH */}
      {/* ========================================== */}
      <AnimatePresence>
        {editingDish && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setEditingDish(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#14141C] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between shrink-0">
                <h3 className="font-display font-black text-base text-white">
                  {isNewDish ? 'Нова страва в меню' : `Редагування: ${editingDish.name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form Content */}
              <form onSubmit={handleSaveDish} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
                
                {/* Photo Preview & Upload */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Фотографія страви:
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
                      <img
                        src={editingDish.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-bold text-xs cursor-pointer transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Завантажити фото з пристрою</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDishPhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={editingDish.image || ''}
                        onChange={(e) => setEditingDish({ ...editingDish, image: e.target.value })}
                        placeholder="Або вставте посилання на зображення..."
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Назва страви *:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDish.name}
                    onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                    placeholder="Наприклад: Чебурек з лососем"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Category & Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Категорія:
                    </label>
                    <select
                      value={editingDish.category}
                      onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="chebureks">Чебуреки</option>
                      <option value="wok">WOK</option>
                      <option value="deepfry">Фритюр</option>
                      <option value="breakfast">Сніданки</option>
                      <option value="salads">Салати</option>
                      <option value="coffee">Кава</option>
                      <option value="desserts">Десерти</option>
                      <option value="drinks">Напої</option>
                      <option value="sets">Сети</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Вага / об'єм:
                    </label>
                    <input
                      type="text"
                      value={editingDish.weight}
                      onChange={(e) => setEditingDish({ ...editingDish, weight: e.target.value })}
                      placeholder="180 г"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Ціна в гривнях (₴) *:
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingDish.price}
                    onChange={(e) => setEditingDish({ ...editingDish, price: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400 font-display font-black text-base focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Опис складу страви:
                  </label>
                  <textarea
                    rows={3}
                    value={editingDish.desc || editingDish.shortDesc || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, desc: e.target.value, shortDesc: e.target.value })}
                    placeholder="Детальний опис для гостя..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Badges / Checkboxes */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDish.isHit || false}
                      onChange={(e) => setEditingDish({ ...editingDish, isHit: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 bg-zinc-800 border-zinc-700 focus:ring-0"
                    />
                    <span className="font-bold text-white">🔥 Хіт продажу</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDish.isNew || false}
                      onChange={(e) => setEditingDish({ ...editingDish, isNew: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 bg-zinc-800 border-zinc-700 focus:ring-0"
                    />
                    <span className="font-bold text-white">✨ Новинка</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDish.isSpicy || false}
                      onChange={(e) => setEditingDish({ ...editingDish, isSpicy: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 bg-zinc-800 border-zinc-700 focus:ring-0"
                    />
                    <span className="font-bold text-white">🌶️ Гостре</span>
                  </label>
                </div>

                {/* Modal Buttons */}
                <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingDish(null)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-xs cursor-pointer shadow-sm"
                  >
                    Зберегти зміни
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default AdminPage;
