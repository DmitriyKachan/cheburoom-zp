import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import {
  X,
  RefreshCw,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Link,
  ShieldCheck,
  Eye,
  EyeOff,
  Search,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { downloadMenuCSVTemplate } from '../services/googleSheetsService';

export function AdminSyncModal() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    menuItems,
    sheetId,
    setSheetIdAndSave,
    lastSyncTime,
    isSyncing,
    syncFromGoogleSheets,
    resetToDefaultMenu,
    toggleDishAvailability,
    showToast
  } = useCart();

  const [inputUrl, setInputUrl] = useState(sheetId || '');
  const [activeTab, setActiveTab] = useState('sync'); // 'sync' | 'stoplist'
  const [stopListSearch, setStopListSearch] = useState('');

  if (!isAdminOpen) return null;

  const handleSyncSubmit = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      showToast('Вкажіть посилання або ID Google Таблиці');
      return;
    }

    try {
      await syncFromGoogleSheets(inputUrl.trim());
      showToast('Меню успішно оновлено з Google Таблиці!');
    } catch (err) {
      showToast(err.message || 'Помилка завантаження таблиці');
    }
  };

  const handleDownloadTemplate = () => {
    downloadMenuCSVTemplate(menuItems);
    showToast('Шаблон cheburoom_menu_template.csv завантажено!');
  };

  const handleReset = () => {
    if (window.confirm('Скинути всі налаштування та повернути стандартне вбудоване меню?')) {
      resetToDefaultMenu();
      setInputUrl('');
      showToast('Меню скинуто до базового!');
    }
  };

  // Filtered dishes for quick stop-list
  const filteredDishes = menuItems.filter(d =>
    d.name.toLowerCase().includes(stopListSearch.toLowerCase()) ||
    d.category.toLowerCase().includes(stopListSearch.toLowerCase())
  );

  const unavailableCount = menuItems.filter(d => d.available === false).length;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-sm"
        onClick={() => setIsAdminOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white dark:bg-[#121215] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-[#23232E] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-[#23232E] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base sm:text-lg text-zinc-950 dark:text-white flex items-center gap-2">
                  <span>Керування меню</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Google Sheets CMS
                  </span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {lastSyncTime ? `Останнє оновлення: ${lastSyncTime}` : 'Працює на локальному каталозі'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#1A1A22] text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Закрити"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-100 dark:border-[#23232E] px-6 pt-2 bg-zinc-50/50 dark:bg-[#15151B]/50 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('sync')}
              className={`pb-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border-b-2 mr-6 ${
                activeTab === 'sync'
                  ? 'border-amber-500 text-zinc-950 dark:text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Підключення таблиці</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stoplist')}
              className={`pb-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border-b-2 ${
                activeTab === 'stoplist'
                  ? 'border-amber-500 text-zinc-950 dark:text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Швидкий стоп-лист</span>
              {unavailableCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {unavailableCount}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
            {activeTab === 'sync' ? (
              <>
                {/* Form to connect sheet */}
                <form onSubmit={handleSyncSubmit} className="space-y-3">
                  <label className="block text-xs font-bold text-zinc-900 dark:text-white">
                    Посилання або ID опублікованої Google Таблиці:
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/... або ID таблиці"
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isSyncing}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-5 py-2.5 rounded-xl bg-glovo-yellow hover:bg-glovo-yellow-hover text-zinc-950 font-display font-black text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Завантаження...' : 'Синхронізувати'}</span>
                    </motion.button>
                  </div>
                </form>

                {/* Quick actions box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#181820] border border-zinc-200 dark:border-[#262632] hover:border-amber-400/50 flex items-center gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white block">
                        Завантажити шаблон меню (.csv)
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Всі 24+ страви ЧЕБУROOM з колонками
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#181820] border border-zinc-200 dark:border-[#262632] hover:border-rose-400/50 flex items-center gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white block">
                        Скинути до стандартного меню
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Повернути початковий каталог страв
                      </span>
                    </div>
                  </button>
                </div>

                {/* Instructions Card */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#181820] border border-zinc-200/80 dark:border-[#262632] space-y-2 text-zinc-600 dark:text-zinc-400">
                  <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Як підключити вашу власну Google Таблицю за 1 хвилину:</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-[11px]">
                    <li>
                      Натисніть кнопку <strong>«Завантажити шаблон меню (.csv)»</strong> вище.
                    </li>
                    <li>
                      Відкрийте{' '}
                      <a
                        href="https://sheets.new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 hover:underline font-bold inline-flex items-center gap-0.5"
                      >
                        Google Sheets <ExternalLink className="w-2.5 h-2.5" />
                      </a>{' '}
                      та імпортуйте завантажений файл: <em>Файл → Імпортувати → Завантажити файл</em>.
                    </li>
                    <li>
                      Зробіть таблицю доступною для сайту: <em>Файл → Поділитися → Опублікувати в інтернеті → Натиснути «Опублікувати»</em>.
                    </li>
                    <li>
                      Скопіюйте посилання на таблицю, вставте в поле вище та натисніть <strong>«Синхронізувати»</strong>.
                    </li>
                  </ol>
                  <p className="text-[10px] text-zinc-400 pt-1">
                    💡 Будь-які зміни цін, описів чи наявності в таблиці з'являться на сайті після натискання «Синхронізувати» або при перезавантаженні сторінки!
                  </p>
                </div>
              </>
            ) : (
              /* Stop-list Management */
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={stopListSearch}
                      onChange={(e) => setStopListSearch(e.target.value)}
                      placeholder="Швидкий пошук страви для стоп-листа..."
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 font-semibold shrink-0">
                    У стоп-листі: <strong className="text-rose-500">{unavailableCount}</strong>
                  </span>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-[#1F1F28] max-h-96 overflow-y-auto pr-1">
                  {filteredDishes.map((dish) => {
                    const isAvailable = dish.available !== false;
                    return (
                      <div key={dish.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-9 h-9 rounded-xl object-cover bg-zinc-100 dark:bg-[#1A1A22] shrink-0 border border-zinc-200 dark:border-zinc-800"
                          />
                          <div className="min-w-0">
                            <p className={`font-bold truncate text-xs ${isAvailable ? 'text-zinc-900 dark:text-white' : 'line-through text-zinc-400'}`}>
                              {dish.name}
                            </p>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {dish.price} ₴ • {dish.weight}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleDishAvailability(dish.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                            isAvailable
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-500/30'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                        >
                          {isAvailable ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>В наявності</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Стоп-лист</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-[#23232E] bg-[#F8F9FA] dark:bg-[#09090B] flex justify-between items-center shrink-0">
            <span className="text-[11px] text-zinc-400">
              Всього страв у системі: <strong>{menuItems.length}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="px-5 py-2 rounded-xl bg-zinc-200 dark:bg-[#20202A] hover:bg-zinc-300 dark:hover:bg-[#2A2A36] text-zinc-900 dark:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Закрити
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AdminSyncModal;
