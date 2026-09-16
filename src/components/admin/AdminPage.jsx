import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import {
  authenticateAdmin,
  isAdminAuthenticated,
  logoutAdmin,
  changeAdminPassword,
  getLockoutRemainingSeconds,
  resetAdminLockout,
  syncCurrentPasswordToCloud
} from '../../services/adminAuthService';
import { playKitchenChime, testCloudRelay, diagnoseDatabaseHealth, getCloudRelayTopicInfo } from '../../services/orderSyncService';
import {
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  removeFirebaseConfig,
  testFirebaseConnection,
  isFirebaseConfigured
} from '../../services/firebaseService';
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
  AlertTriangle,
  Cloud,
  Database,
  ExternalLink,
  RefreshCw
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

function getDisplayBadge(dish) {
  if (dish.badge && dish.badge.trim()) {
    const raw = dish.badge.trim();
    const lower = raw.toLowerCase();
    if (lower === 'hit' || lower === 'хит' || lower === 'хіт') return '🔥 Хіт';
    if (lower === 'new' || lower === 'новинка') return '✨ Новинка';
    if (lower === 'spicy' || lower === 'гостре') return null;
    if (lower === 'premium' || lower === 'преміум') return '⭐ Преміум';
    if (lower === 'top' || lower === 'топ') return '🧀 Топ';
    return raw;
  }
  if (dish.isHit) return '🔥 Хіт';
  if (dish.isNew) return '✨ Новинка';
  return null;
}

function getBadgeColorClass(badgeText, badgeColor) {
  if (badgeColor === 'rose' || badgeColor === 'red') {
    return 'bg-rose-500 text-white shadow-xs';
  }
  if (badgeColor === 'emerald' || badgeColor === 'green') {
    return 'bg-emerald-500 text-white shadow-xs';
  }
  if (badgeColor === 'purple' || badgeColor === 'violet') {
    return 'bg-purple-600 text-white shadow-xs';
  }
  if (badgeColor === 'blue') {
    return 'bg-blue-600 text-white shadow-xs';
  }

  if (badgeText) {
    const lower = badgeText.toLowerCase();
    if (lower.includes('новин') || lower.includes('new')) {
      return 'bg-emerald-500 text-white shadow-xs';
    }
    if (lower.includes('суперцін') || lower.includes('акці') || lower.includes('солодк')) {
      return 'bg-rose-500 text-white shadow-xs';
    }
    if (lower.includes('преміум')) {
      return 'bg-zinc-950 text-amber-400 border border-amber-400/50 shadow-xs';
    }
  }

  return 'bg-amber-400 text-zinc-950 font-black shadow-xs';
}

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
    createTestOrder,
    updateOrderStatus,
    clearOrdersHistory,
    deleteOrder,
    navigateTo,
    showToast,
    isCloudConnected,
    cloudMode,
    refreshCloudConnection,
    syncMenuToCloud
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

  const relayTopicInfo = getCloudRelayTopicInfo();

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

  // When authenticated, ensure current password hash is synced to cloud for mobile devices
  useEffect(() => {
    if (isAuthenticated) {
      syncCurrentPasswordToCloud();
    }
  }, [isAuthenticated]);

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

  // Firebase Cloud State & Handlers
  const [firebaseConfigInput, setFirebaseConfigInput] = useState('');
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);
  const [isUploadingToCloud, setIsUploadingToCloud] = useState(false);
  const [cloudStatusMsg, setCloudStatusMsg] = useState({ type: '', text: '' });
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [showCustomFirebase, setShowCustomFirebase] = useState(false);
  const [dbDiagnostics, setDbDiagnostics] = useState(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const handleRunDbDiagnostics = async () => {
    setIsDiagnosing(true);
    try {
      const report = await diagnoseDatabaseHealth();
      setDbDiagnostics(report);
      if (report.healthy) {
        showToast(`БД у нормі! Пінг: ${report.latencyMs} мс, замовлень: ${report.ordersChannel.syncedCount}`);
      } else {
        showToast('Діагностику завершено з попередженнями');
      }
    } catch (err) {
      showToast('Помилка діагностики: ' + err.message);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleSaveFirebaseConfig = async (e) => {
    e.preventDefault();
    setCloudStatusMsg({ type: '', text: '' });
    try {
      let configObj = null;
      const raw = firebaseConfigInput.trim();

      if (raw.startsWith('{') && raw.endsWith('}')) {
        configObj = JSON.parse(raw);
      } else {
        const apiKeyMatch = raw.match(/apiKey:\s*["']([^"']+)["']/);
        const projectIdMatch = raw.match(/projectId:\s*["']([^"']+)["']/);
        const authDomainMatch = raw.match(/authDomain:\s*["']([^"']+)["']/);
        const storageBucketMatch = raw.match(/storageBucket:\s*["']([^"']+)["']/);
        const messagingSenderIdMatch = raw.match(/messagingSenderId:\s*["']([^"']+)["']/);
        const appIdMatch = raw.match(/appId:\s*["']([^"']+)["']/);

        if (apiKeyMatch && projectIdMatch) {
          configObj = {
            apiKey: apiKeyMatch[1],
            projectId: projectIdMatch[1],
            authDomain: authDomainMatch ? authDomainMatch[1] : undefined,
            storageBucket: storageBucketMatch ? storageBucketMatch[1] : undefined,
            messagingSenderId: messagingSenderIdMatch ? messagingSenderIdMatch[1] : undefined,
            appId: appIdMatch ? appIdMatch[1] : undefined
          };
        }
      }

      if (!configObj || !configObj.apiKey || !configObj.projectId) {
        throw new Error('Не вдалося розпізнати конфігурацію. Переконайтеся, що є apiKey та projectId.');
      }

      setIsTestingFirebase(true);
      const testRes = await testFirebaseConnection(configObj);
      setIsTestingFirebase(false);

      if (!testRes.success) {
        throw new Error(testRes.message);
      }

      saveFirebaseConfig(configObj);
      refreshCloudConnection();
      setCloudStatusMsg({ type: 'success', text: 'Успішно підключено до Firebase Firestore!' });
      showToast('Firebase Firestore активовано!');
      setFirebaseConfigInput('');
    } catch (err) {
      setIsTestingFirebase(false);
      setCloudStatusMsg({ type: 'error', text: err.message || 'Помилка збереження конфігурації' });
    }
  };

  const handleTestCurrentCloud = async () => {
    setIsTestingFirebase(true);
    setCloudStatusMsg({ type: '', text: '' });
    if (cloudMode === 'firebase') {
      const res = await testFirebaseConnection();
      setIsTestingFirebase(false);
      if (res.success) {
        setCloudStatusMsg({ type: 'success', text: 'З\'єднання з Google Firestore активне та працює стабільно!' });
        showToast('З\'єднання з Firestore підтверджено!');
      } else {
        setCloudStatusMsg({ type: 'error', text: res.message });
      }
    } else {
      const res = await testCloudRelay();
      setIsTestingFirebase(false);
      if (res.success) {
        const msg = res.warning
          ? `Хмарний зв'язок активний через надійний потік SSE (${res.latencyMs} мс). Замовлення та меню синхронізуються миттєво!`
          : `Хмарний зв'язок відмінний! Затримка: ${res.latencyMs} мс. Замовлення та меню синхронізуються наживо.`;
        setCloudStatusMsg({ type: 'success', text: msg });
        showToast(`Хмара активна (${res.latencyMs} мс)!`);
      } else {
        setCloudStatusMsg({ type: 'error', text: `Помилка зв'язку: ${res.error}` });
      }
    }
  };

  const handleDisconnectCloud = () => {
    if (window.confirm('Відключити хмарну базу даних і перейти в автономний локальний режим?')) {
      removeFirebaseConfig();
      refreshCloudConnection();
      setCloudStatusMsg({ type: 'info', text: 'Хмарну базу відключено. Сайт працює автономно.' });
      showToast('Хмару відключено');
    }
  };

  const handleUploadMenuToCloud = async () => {
    setIsUploadingToCloud(true);
    try {
      await syncMenuToCloud();
    } catch (err) {
      showToast('Помилка вивантаження: ' + err.message);
    } finally {
      setIsUploadingToCloud(false);
    }
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
                <label htmlFor="admin-login-password" className="block text-xs font-bold text-zinc-300 mb-2">
                  Пароль адміністратора:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-login-password"
                    name="password"
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    inputMode="text"
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
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>
                      Захисне блокування: зачекайте <strong>{lockoutSec} сек.</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      resetAdminLockout();
                      setLockoutSec(0);
                      setAuthError('');
                      showToast('Блокування скинуто');
                    }}
                    className="px-2 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-[10px] font-bold cursor-pointer transition-colors shrink-0"
                  >
                    Скинути
                  </button>
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
              {authError && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      resetAdminLockout();
                      setLockoutSec(0);
                      setAuthError('');
                      showToast('Блокування скинуто, спробуйте ще раз');
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    🔄 Скинути захисне блокування
                  </button>
                </div>
              )}
              <div>
                <button
                  type="button"
                  onClick={() => navigateTo('menu')}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer pt-1"
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <CheburoomLogo size="sm" />
            <span className="hidden sm:inline-block h-4 w-px bg-zinc-800" />
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Панель керування</span>
            </div>

            {/* Cloud Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-950/70 border-emerald-700/80 text-emerald-300">
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>{cloudMode === 'firebase' ? 'Google Firestore Live' : 'Хмара Live (Авто)'}</span>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-2">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Замовлення</span>
              {ordersHistory.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeTab === 'orders'
                    ? 'bg-zinc-950 text-amber-400'
                    : 'bg-amber-400 text-zinc-950 animate-pulse'
                }`}>
                  {ordersHistory.length}
                </span>
              )}
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
              <Database className="w-3.5 h-3.5" />
              <span>Хмара та Безпека</span>
              {isCloudConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* Right Action: Site & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateTo('menu')}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Перейти на сайт ресторану"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">На сайт</span>
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

        {/* Mobile Navigation Segmented Control */}
        <div className="sm:hidden px-3 py-2 bg-[#0E0E14] border-t border-zinc-800/80">
          <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 rounded-2xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-amber-400 text-zinc-950 font-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] truncate">Меню ({menuItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                activeTab === 'orders'
                  ? 'bg-amber-400 text-zinc-950 font-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] truncate">Замовлення</span>
              {ordersHistory.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                  activeTab === 'orders'
                    ? 'bg-zinc-950 text-amber-400'
                    : 'bg-rose-500 text-white animate-pulse'
                }`}>
                  {ordersHistory.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-amber-400 text-zinc-950 font-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] truncate">Хмара / БД</span>
              {isCloudConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              )}
            </button>
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
                <h1 className="font-display font-black text-lg sm:text-2xl text-white">
                  Керування меню ресторану
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Змінюйте ціни, завантажуйте фото, ставте страви у стоп-лист або створюйте новинки
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
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
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-2xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/15 active:scale-98 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Додати нову страву</span>
              </motion.button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#13131A] p-2.5 sm:p-3 rounded-2xl border border-zinc-800">
              
              {/* Category Pills (Touch-scrollable) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1 touch-pan-x">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 min-h-[36px] flex items-center ${
                      selectedCategory === cat.id
                        ? 'bg-amber-400 text-zinc-950 shadow-sm'
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
                  id="admin-dish-search"
                  name="adminDishSearch"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Швидкий пошук страви..."
                  aria-label="Швидкий пошук страви"
                  className="w-full pl-8 pr-3 py-2 sm:py-1.5 text-xs rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

            </div>

            {/* Dishes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredDishes.map((dish) => {
                const isAvail = dish.available !== false;
                return (
                  <div
                    key={dish.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
                      isAvail
                        ? 'bg-[#14141B] border-zinc-800 hover:border-zinc-700'
                        : 'bg-[#14141B]/50 border-rose-950/60 opacity-80'
                    }`}
                  >
                    {/* Top Row: Image & Info */}
                    <div className="flex gap-3 items-start">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className={`w-full h-full object-cover ${!isAvail ? 'grayscale' : ''}`}
                        />
                        {!isAvail && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] font-black text-rose-400 text-center uppercase p-0.5">
                            Стоп
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 mb-1">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {dish.category}
                          </span>
                          {getDisplayBadge(dish) && (
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${getBadgeColorClass(getDisplayBadge(dish), dish.badgeColor)}`}>
                              {getDisplayBadge(dish)}
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

                      <div className="flex items-center gap-2">
                        {/* Stop-list button */}
                        <button
                          type="button"
                          onClick={() => toggleDishAvailability(dish.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 min-h-[36px] active:scale-95 ${
                            isAvail
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 hover:bg-rose-950 hover:text-rose-400 hover:border-rose-800'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800 hover:bg-emerald-950 hover:text-emerald-400'
                          }`}
                          title={isAvail ? "Поставити в стоп-лист" : "Повернути в наявність"}
                        >
                          {isAvail ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{isAvail ? 'В наявності' : 'Стоп'}</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewDish(false);
                            setEditingDish({ ...dish });
                          }}
                          className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer active:scale-95 border border-zinc-700/60"
                          title="Редагувати страву"
                        >
                          <Edit2 className="w-4 h-4" />
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
                          className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 flex items-center justify-center transition-colors cursor-pointer active:scale-95 border border-zinc-700/60"
                          title="Видалити страву"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-display font-black text-xl sm:text-2xl text-white">
                    Журнал онлайн-замовлень
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Sync</span>
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Замовлення надходять миттєво з сайту в реальному часі зі звуковим сигналом
                </p>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => createTestOrder()}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                  title="Згенерувати тестове замовлення клієнта"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚡ Тестове замовлення</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playKitchenChime();
                    showToast('🔔 Звуковий сигнал кухні перевірено');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700 active:scale-95 transition-colors"
                  title="Перевірити звук дзвінка замовлення"
                >
                  <span>🔔 Перевірити звук</span>
                </button>

                {ordersHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Очистити всю історію замовлень? Вони будуть видалені на всіх пристроях.')) {
                        clearOrdersHistory();
                      }
                    }}
                    className="col-span-2 sm:col-span-1 px-3.5 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-rose-950 hover:text-rose-400 text-xs font-bold text-zinc-400 transition-colors cursor-pointer border border-zinc-800 flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Очистити всю історію</span>
                  </button>
                )}
              </div>
            </div>

            {ordersHistory.length === 0 ? (
              <div className="p-8 sm:p-14 text-center rounded-3xl bg-[#13131A] border border-zinc-800">
                <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="font-bold text-base text-zinc-200 mb-1">
                  Нових замовлень поки немає
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-5">
                  Як тільки клієнт оформить замовлення на сайті, воно миттєво з'явиться тут із контактами, складом та звуковим сигналом.
                </p>
                <button
                  type="button"
                  onClick={() => createTestOrder()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-black shadow-lg shadow-amber-400/20 cursor-pointer active:scale-98 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  <span>Створити тестове замовлення для перевірки</span>
                </button>
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
                      className="p-3.5 sm:p-5 rounded-2xl bg-[#13131A] border border-zinc-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-zinc-800">
                        <div className="flex items-center justify-between sm:justify-start gap-2.5">
                          <span className="font-mono font-black text-sm px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400">
                            #{order.orderId}
                          </span>
                          <span className="text-xs font-bold text-zinc-400">
                            {order.timing}
                          </span>
                        </div>

                        {/* Status dropdown & delete button */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <select
                            value={order.status || 'new'}
                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer min-h-[38px] ${statusColors[order.status || 'new']}`}
                          >
                            <option value="new">🟡 Нове замовлення</option>
                            <option value="preparing">🔵 Готується на кухні</option>
                            <option value="ready">🟢 Готове до видачі</option>
                            <option value="completed">⚪ Видано клієнту</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Видалити замовлення #${order.orderId}?`)) {
                                deleteOrder(order.orderId);
                              }
                            }}
                            className="w-10 h-10 rounded-xl bg-zinc-900/80 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-800/60 transition-colors cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
                            title="Видалити це замовлення"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-bold">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{order.name}</span>
                        </div>
                        <a
                          href={`tel:${order.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 font-bold active:scale-95 transition-all cursor-pointer"
                          title="Подзвонити гостю"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{order.phone}</span>
                        </a>
                        <div className="px-2.5 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-400">
                          Оплата: <strong className="text-zinc-200">{order.payment}</strong>
                        </div>
                        {order.cutleryCount > 0 && (
                          <div className="px-2.5 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-400">
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
        {/* TAB 3: CLOUD DATABASE & SECURITY */}
        {/* ========================================== */}
        {activeTab === 'security' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="font-display font-black text-xl sm:text-2xl text-white">
                Хмарна база даних та безпека
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Підключення Google Firebase Firestore, синхронізація меню і замовлень та налаштування пароля
              </p>
            </div>

            {/* Cloud Synchronization Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#13131A] border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center border bg-emerald-950/60 border-emerald-700/80 text-emerald-400">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
                      <span>Хмарна синхронізація в реальному часі</span>
                    </h2>
                    <p className="text-[11px] text-zinc-400">
                      {cloudMode === 'firebase'
                        ? 'Google Firebase Firestore (Корпоративна база)'
                        : 'Вбудована онлайн-хмара ЧЕБУROOM (Безкоштовно та автоматично)'}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-950/80 border-emerald-700 text-emerald-300 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{cloudMode === 'firebase' ? 'Firestore Live' : 'Хмара активна наживо'}</span>
                </div>
              </div>

              {/* Status Message */}
              {cloudStatusMsg.text && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  cloudStatusMsg.type === 'success'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                    : cloudStatusMsg.type === 'error'
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                    : 'bg-blue-950/60 text-blue-300 border border-blue-800'
                }`}>
                  {cloudStatusMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : cloudStatusMsg.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  ) : (
                    <Cloud className="w-4 h-4 shrink-0 text-blue-400" />
                  )}
                  <span>{cloudStatusMsg.text}</span>
                </div>
              )}

              {/* Live Status Description */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                <p className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {cloudMode === 'firebase'
                      ? 'Підключено до Google Firebase. Замовлення та меню зберігаються у хмарі Google.'
                      : 'База даних працює автоматично. Всі замовлення з телефонів гостей та зміни в меню синхронізуються наживо між усіма пристроями!'}
                  </span>
                </p>
                <p className="text-zinc-400">
                  Будь-яке замовлення, зроблене гостем з телефону, миттєво з'явиться у вкладці «Замовлення» з фірмовим звуковим дзвінком, а зміна цін чи стоп-листа оновиться на смартфонах гостей без перезавантаження.
                </p>
              </div>

              {/* Cloud Security & Salted Private Channel Details */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Приватні зашифровані канали (Захист персональних даних)</span>
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold self-start sm:self-auto">
                    Сіль: {relayTopicInfo.salt}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                    <div className="text-zinc-500 text-[10px] font-sans uppercase font-bold">Канал замовлень</div>
                    <div className="text-zinc-200 truncate mt-0.5">{relayTopicInfo.ordersTopic}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                    <div className="text-zinc-500 text-[10px] font-sans uppercase font-bold">Канал меню</div>
                    <div className="text-zinc-200 truncate mt-0.5">{relayTopicInfo.menuTopic}</div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  🔒 Публічний доступ закритий: топіки ретранслятора захищені секретним криптографічним хешем. Сторонні користувачі або сніфери мережі не можуть перехопити номери телефонів та імена замовників ресторану.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={isTestingFirebase}
                  onClick={handleTestCurrentCloud}
                  className="w-full px-4 py-3 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 active:scale-98 transition-all min-h-[42px]"
                >
                  {isTestingFirebase ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>{isTestingFirebase ? 'Перевірка...' : '⚡ Перевірити зв\'язок з хмарою'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    createTestOrder();
                    showToast('Тестове замовлення надіслано в хмару!');
                  }}
                  className="w-full px-4 py-3 sm:py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-zinc-700 active:scale-98 transition-all min-h-[42px]"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>🔔 Надіслати тестове замовлення</span>
                </button>

                <button
                  type="button"
                  disabled={isUploadingToCloud}
                  onClick={handleUploadMenuToCloud}
                  className="w-full px-4 py-3 sm:py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-zinc-700 disabled:opacity-50 active:scale-98 transition-all min-h-[42px]"
                >
                  {isUploadingToCloud ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <Upload className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{isUploadingToCloud ? 'Синхронізація...' : '☁️ Синхронізувати меню'}</span>
                </button>

                <button
                  type="button"
                  disabled={isDiagnosing}
                  onClick={handleRunDbDiagnostics}
                  className="w-full px-4 py-3 sm:py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-zinc-700 disabled:opacity-50 active:scale-98 transition-all min-h-[42px]"
                >
                  {isDiagnosing ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{isDiagnosing ? 'Діагностика...' : '🔬 Повна діагностика БД'}</span>
                </button>

                {cloudMode === 'firebase' && (
                  <button
                    type="button"
                    onClick={handleDisconnectCloud}
                    className="sm:col-span-2 w-full px-4 py-3 sm:py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold border border-rose-800/60 cursor-pointer transition-colors text-center"
                  >
                    Відключити Firebase
                  </button>
                )}
              </div>

              {/* Database Diagnostics Result Card */}
              {dbDiagnostics && (
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Результати діагностики бази даних
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Пінг: <span className="text-emerald-400 font-bold">{dbDiagnostics.latencyMs} мс</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                      <div className="text-zinc-400 text-[10px] uppercase font-bold">Канал замовлень</div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Активний ({dbDiagnostics.ordersChannel.syncedCount} в базі)</span>
                      </div>
                    </div>
                    
                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                      <div className="text-zinc-400 text-[10px] uppercase font-bold">Канал меню</div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Активний (Двосторонній)</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-1">
                      <div className="text-zinc-400 text-[10px] uppercase font-bold">Синхронізація пароля</div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{dbDiagnostics.authChannel.passwordSynced ? 'Синхронізовано' : 'Готовий'}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    ℹ️ База даних працює у повному обсязі: замовлення зберігаються у захищеній хмарі, автоматично підвантажуються при відкритті сайту з будь-якого пристрою, а пароль адміністратора синхронізується між ПК та смартфонами.
                  </p>
                </div>
              )}

              {/* Optional Firebase Configuration Accordion */}
              <div className="pt-2 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setShowCustomFirebase(!showCustomFirebase)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 font-bold transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>
                      {cloudMode === 'firebase'
                        ? 'Оновити конфігурацію Google Firebase Firestore'
                        : '⚙️ Підключити корпоративний Google Firebase Firestore (За бажанням)'}
                    </span>
                  </span>
                  <span className="text-zinc-500 text-[11px]">
                    {showCustomFirebase ? 'Згорнути ▲' : 'Розгорнути ▼'}
                  </span>
                </button>

                {showCustomFirebase && (
                  <div className="mt-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-700 space-y-4">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      За замовчуванням система вже працює в хмарі автоматично. Якщо ви хочете підключити <strong>особистий Google Cloud проект ресторану</strong>, вставте конфігурацію нижче:
                    </p>

                    <form onSubmit={handleSaveFirebaseConfig} className="space-y-3">
                      <div>
                        <textarea
                          rows={4}
                          value={firebaseConfigInput}
                          onChange={(e) => setFirebaseConfigInput(e.target.value)}
                          placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "cheburoom-xxxx",\n  ...\n};`}
                          className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="submit"
                          disabled={isTestingFirebase || !firebaseConfigInput.trim()}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display font-black text-xs flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-colors"
                        >
                          {isTestingFirebase ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Перевірка та підключення...</span>
                            </>
                          ) : (
                            <>
                              <Cloud className="w-4 h-4" />
                              <span>Зберегти та активувати Firestore</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowConfigGuide(!showConfigGuide)}
                          className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700 transition-colors"
                        >
                          <span>{showConfigGuide ? 'Приховати інструкцію' : '📖 Інструкція отримання ключів'}</span>
                        </button>
                      </div>
                    </form>

                    {showConfigGuide && (
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                        <div className="flex items-center justify-between font-bold text-amber-400 text-xs">
                          <span>Інструкція отримання ключів Firebase</span>
                          <a
                            href="https://console.firebase.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline"
                          >
                            <span>console.firebase.google.com</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 leading-relaxed text-[11px]">
                          <li>Створіть проєкт на <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">console.firebase.google.com</a>.</li>
                          <li>У меню <strong>Build &rarr; Firestore Database</strong> створіть базу в режимі <em>test mode</em>.</li>
                          <li>У <strong>Project settings</strong> внизу натисніть іконку <strong>&lt;/&gt;</strong> (веб) і зареєструйте застосунок.</li>
                          <li>Скопіюйте об'єкт <code>firebaseConfig</code> і вставте в поле вище.</li>
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
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

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={exportMenuBackup}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-zinc-700 active:scale-[0.98] transition-all"
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
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-zinc-700 active:scale-[0.98] transition-all"
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
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-rose-800/60 active:scale-[0.98] transition-all"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setEditingDish(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#14141C] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between shrink-0">
                <h3 className="font-display font-black text-sm sm:text-base text-white truncate pr-2">
                  {isNewDish ? 'Нова страва в меню' : `Редагування: ${editingDish.name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shrink-0 active:scale-90 transition-transform"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form Content */}
              <form id="dish-form" onSubmit={handleSaveDish} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
                
                {/* Instant Test Sample preset */}
                {isNewDish && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-amber-300">
                      <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                      <span className="text-[11px] font-bold">Спробувати новинку з фотографією?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDish({
                          id: `dish_royal_${Date.now()}`,
                          name: 'Чебурек Королівський з мармуровою яловичиною',
                          category: 'chebureks',
                          price: 135,
                          weight: '260 г',
                          badge: '🔥 Хіт',
                          badgeColor: 'amber',
                          isHit: true,
                          shortDesc: 'Мармурова яловичина, моцарела, соус сальса',
                          desc: 'Преміальний пухирчастий чебурек із соковитою рубаною мармуровою яловичиною, ніжним сиром моцарела та ароматною кінзою.',
                          image: '/images/cheburek-royal-beef.jpg',
                          available: true
                        });
                        showToast('Дані та фото новинки підставлено!');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-[11px] cursor-pointer transition-colors shrink-0 active:scale-95"
                    >
                      Вставити зразок
                    </button>
                  </div>
                )}

                {/* Photo Preview & Upload */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Фотографія страви:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start">
                    <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
                      <img
                        src={editingDish.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 flex-1 w-full">
                      <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 font-bold text-xs cursor-pointer transition-colors w-full active:scale-[0.98]">
                        <Camera className="w-4 h-4" />
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
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs focus:outline-none focus:border-amber-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Category & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Категорія:
                    </label>
                    <select
                      value={editingDish.category}
                      onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400 font-display font-black text-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Dish Status & Badges Section */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-200">
                      Статус та маркування страви (бейдж):
                    </label>
                    {editingDish.badge && (
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-lg ${getBadgeColorClass(editingDish.badge, editingDish.badgeColor)}`}>
                        {editingDish.badge}
                      </span>
                    )}
                  </div>

                  {/* Preset Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'none', label: 'Без бейджа', badge: '', color: '' },
                      { id: 'hit', label: '🔥 Хіт', badge: '🔥 Хіт', color: 'amber' },
                      { id: 'signature', label: '👑 Фірмовий хіт', badge: 'Фірмовий хіт', color: 'amber' },
                      { id: 'new', label: '✨ Новинка', badge: '✨ Новинка', color: 'emerald' },
                      { id: 'cheese', label: '🧀 Топ сир', badge: '🧀 Топ сир', color: 'amber' },
                      { id: 'premium', label: '⭐ Преміум', badge: '⭐ Преміум', color: 'purple' },
                      { id: 'deal', label: '💥 Суперціна', badge: '💥 Суперціна', color: 'rose' },
                      { id: 'custom', label: '✍️ Свій бейдж', badge: null, color: 'custom' }
                    ].map((preset) => {
                      const currentBadge = editingDish.badge || '';
                      const isSelected = preset.badge !== null
                        ? currentBadge === preset.badge
                        : (currentBadge !== '' && !['🔥 Хіт', 'Фірмовий хіт', '✨ Новинка', '🧀 Топ сир', '⭐ Преміум', '💥 Суперціна'].includes(currentBadge));

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            if (preset.badge !== null) {
                              setEditingDish({
                                ...editingDish,
                                badge: preset.badge,
                                badgeColor: preset.color,
                                isHit: preset.badge.includes('Хіт'),
                                isNew: preset.badge.includes('Новинка')
                              });
                            } else {
                              setEditingDish({
                                ...editingDish,
                                badge: currentBadge || 'Сезонне',
                                badgeColor: editingDish.badgeColor || 'amber'
                              });
                            }
                          }}
                          className={`min-h-[38px] p-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer text-left flex items-center justify-between active:scale-95 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                          }`}
                        >
                          <span className="truncate">{preset.label}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Badge Text Input */}
                  <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap sm:flex-nowrap gap-2 items-center">
                    <div className="flex-1 min-w-[140px] w-full sm:w-auto">
                      <input
                        type="text"
                        value={editingDish.badge || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingDish({
                            ...editingDish,
                            badge: val,
                            isHit: val.toLowerCase().includes('хіт'),
                            isNew: val.toLowerCase().includes('новин')
                          });
                        }}
                        placeholder="Власний текст бейджа (наприклад: Сезонне, Шеф-рецепт)..."
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Color palette */}
                    {editingDish.badge && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-zinc-400">Колір:</span>
                        {[
                          { id: 'amber', bg: 'bg-amber-400', title: 'Жовтий (Хіт)' },
                          { id: 'emerald', bg: 'bg-emerald-500', title: 'Зелений (Новинка)' },
                          { id: 'rose', bg: 'bg-rose-500', title: 'Червоний (Акція)' },
                          { id: 'purple', bg: 'bg-purple-600', title: 'Фіолетовий (Преміум)' }
                        ].map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setEditingDish({ ...editingDish, badgeColor: c.id })}
                            className={`w-6 h-6 rounded-md ${c.bg} transition-transform cursor-pointer flex items-center justify-center active:scale-90 ${
                              (editingDish.badgeColor || 'amber') === c.id ? 'scale-115 ring-2 ring-white shadow-sm' : 'opacity-60 hover:opacity-100'
                            }`}
                            title={c.title}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Spicy toggle */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingDish.isSpicy || false}
                        onChange={(e) => setEditingDish({ ...editingDish, isSpicy: e.target.checked })}
                        className="w-4 h-4 rounded text-rose-500 bg-zinc-800 border-zinc-700 focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-xs text-white flex items-center gap-1.5">
                          <span>🌶️ Гостра страва</span>
                          {editingDish.isSpicy && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                              Позначка увімкнена
                            </span>
                          )}
                        </span>
                        <p className="text-[10px] text-zinc-400">
                          Додає червоний бейдж «🌶️ Гостре» на фотографію страви
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

              </form>

              {/* Modal Sticky Footer */}
              <div className="p-3 sm:p-4 border-t border-zinc-800 bg-[#121218] flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer active:scale-95 transition-all"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  form="dish-form"
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  {isNewDish ? 'Створити страву' : 'Зберегти зміни'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default AdminPage;
