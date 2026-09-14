import React, { useState, useRef } from 'react';
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
  RotateCcw,
  Camera,
  Image as ImageIcon,
  Sparkles
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
    updateDishImage,
    showToast
  } = useCart();

  const [inputUrl, setInputUrl] = useState(sheetId || '');
  const [activeTab, setActiveTab] = useState('sync'); // 'sync' | 'dishes'
  const [stopListSearch, setStopListSearch] = useState('');
  const fileInputRef = useRef(null);
  const [activeDishForPhoto, setActiveDishForPhoto] = useState(null);

  if (!isAdminOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeDishForPhoto) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Розмір фото не повинен перевищувати 5 МБ');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateDishImage(activeDishForPhoto, reader.result);
      setActiveDishForPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

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

          {/* Hidden File Input for Direct Photo Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

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
              onClick={() => setActiveTab('dishes')}
              className={`pb-3 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 border-b-2 ${
                activeTab === 'dishes'
                  ? 'border-amber-500 text-zinc-950 dark:text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Страви, фото та стоп-лист</span>
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
                        Завантажити простий шаблон (.csv)
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Легка таблиця: 6 колонок українською
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

                {/* Instructions Card: Simplified Columns and Photos */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#181820] border border-zinc-200/80 dark:border-[#262632] space-y-3 text-zinc-600 dark:text-zinc-400">
                  <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Таблиця тепер максимально проста: всього 6 колонок</span>
                  </div>
                  
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-zinc-800 dark:text-zinc-200 text-[11px] leading-relaxed">
                    <strong>Колонки таблиці:</strong> Категорія <em>(Чебуреки, WOK, Фритюр, Сніданки, Салати, Кава, Десерти, Напої, Сети)</em> • Назва • Ціна • Вага • В наявності <em>(ТАК/НІ)</em> • Опис • Фото
                  </div>

                  <div className="space-y-1.5 text-[11px] leading-relaxed">
                    <div className="font-bold text-zinc-900 dark:text-white">📸 Як додавати фотографії (3 простих способи):</div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        <strong>З Google Диска (із смартфона):</strong> сфотографуйте страву на телефон, завантажте на Google Диск → «Поділитися» → скопіюйте посилання та вставте в клітинку «Фото». Сайт сам автоматично відобразить його у високій якості.
                      </li>
                      <li>
                        <strong>Формула =IMAGE у самій таблиці:</strong> напишіть у клітинці формулу <code>=IMAGE("посилання")</code> і фото буде видно прямо всередині клітинки Google Таблиці!
                      </li>
                      <li>
                        <strong>Прямо на сайті:</strong> відкрийте вкладку «Страви, фото та стоп-лист» вище та натисніть кнопку 📷 біля будь-якої страви, щоб обрати файл із галереї телефона чи ПК.
                      </li>
                      <li>
                        <strong>Без фото:</strong> якщо залишити клітинку «Фото» порожньою, сайт автоматично підставить красиве фірмове фото для цієї страви!
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-[11px]">
                    <div className="font-bold text-zinc-900 dark:text-white mb-1">Швидке підключення:</div>
                    <p>
                      1. Завантажте шаблон (.csv) кнопкою вище → 2. Імпортуйте в Google Sheets → 3. <em>Файл → Поділитися → Опублікувати в інтернеті</em> → 4. Вставте посилання сюди та натисніть «Синхронізувати».
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Dishes Management, Direct Photo Upload & Stop-list */
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={stopListSearch}
                      onChange={(e) => setStopListSearch(e.target.value)}
                      placeholder="Пошук страви (за назвою або категорією)..."
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-[#1A1A22] border border-zinc-200 dark:border-[#23232E] text-zinc-900 dark:text-white focus:ring-2 focus:ring-glovo-yellow focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 font-semibold shrink-0">
                    У стоп-листі: <strong className="text-rose-500">{unavailableCount}</strong>
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400">
                  Тут ви можете миттєво змінити фото страви з телефона або перемкнути наявність у стоп-лист:
                </p>

                <div className="divide-y divide-zinc-100 dark:divide-[#1F1F28] max-h-96 overflow-y-auto pr-1">
                  {filteredDishes.map((dish) => {
                    const isAvailable = dish.available !== false;
                    return (
                      <div key={dish.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative w-10 h-10 shrink-0 group/photo">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full rounded-xl object-cover bg-zinc-100 dark:bg-[#1A1A22] border border-zinc-200 dark:border-zinc-800"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDishForPhoto(dish.id);
                                fileInputRef.current?.click();
                              }}
                              className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-white opacity-0 group-hover/photo:opacity-100 transition-opacity cursor-pointer"
                              title="Завантажити нове фото"
                            >
                              <Camera className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="min-w-0">
                            <p className={`font-bold truncate text-xs ${isAvailable ? 'text-zinc-900 dark:text-white' : 'line-through text-zinc-400'}`}>
                              {dish.name}
                            </p>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {dish.price} ₴ • {dish.weight}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Upload Photo Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDishForPhoto(dish.id);
                              fileInputRef.current?.click();
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-[#181820] hover:bg-amber-400 hover:text-zinc-950 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#262632] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Змінити фото страви з телефона або ПК"
                          >
                            <Camera className="w-3 h-3 text-amber-500" />
                            <span className="hidden sm:inline">Фото</span>
                          </button>

                          {/* Stop-list toggle */}
                          <button
                            type="button"
                            onClick={() => toggleDishAvailability(dish.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
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
