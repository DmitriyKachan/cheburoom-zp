import { MENU_DATA } from '../data/menuData.js';

const STORAGE_KEYS = {
  MENU_ITEMS: 'cheburoom_custom_menu',
  SHEET_ID: 'cheburoom_sheet_id',
  LAST_SYNC: 'cheburoom_last_sync'
};

// Friendly Ukrainian category names mapping
export const CATEGORY_MAP = {
  'чебуреки': 'chebureks',
  'чебурек': 'chebureks',
  'chebureks': 'chebureks',
  'вок': 'wok',
  'wok': 'wok',
  'локшина': 'wok',
  'фритюр': 'deepfry',
  'закуски': 'deepfry',
  'снеки': 'deepfry',
  'deepfry': 'deepfry',
  'сніданки': 'breakfast',
  'сніданок': 'breakfast',
  'ранок': 'breakfast',
  'breakfast': 'breakfast',
  'салати': 'salads',
  'салат': 'salads',
  'salads': 'salads',
  'кава': 'coffee',
  'чай': 'coffee',
  'напої гарячі': 'coffee',
  'coffee': 'coffee',
  'десерти': 'desserts',
  'десерт': 'desserts',
  'солодке': 'desserts',
  'desserts': 'desserts',
  'напої': 'drinks',
  'напій': 'drinks',
  'лимонади': 'drinks',
  'drinks': 'drinks',
  'сети': 'sets',
  'сет': 'sets',
  'комбо': 'sets',
  'набори': 'sets',
  'sets': 'sets'
};

export const CATEGORY_DISPLAY_NAMES = {
  chebureks: 'Чебуреки',
  wok: 'WOK',
  deepfry: 'Фритюр',
  breakfast: 'Сніданки',
  salads: 'Салати',
  coffee: 'Кава',
  desserts: 'Десерти',
  drinks: 'Напої',
  sets: 'Сети'
};

/**
 * Extracts a Google Spreadsheet ID or valid CSV export URL from various user input formats
 */
export function extractSheetId(input) {
  if (!input) return null;
  const str = input.trim();

  // Full published CSV URL
  if (str.includes('pub?output=csv') || str.includes('output=csv')) {
    return str;
  }

  // Published web url: https://docs.google.com/spreadsheets/d/e/2PACX-xxxx/pubhtml...
  const pubMatch = str.match(/spreadsheets\/d\/e\/([a-zA-Z0-9_-]+)/);
  if (pubMatch && pubMatch[1]) {
    return `https://docs.google.com/spreadsheets/d/e/${pubMatch[1]}/pub?output=csv`;
  }

  // Standard sheet URL: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit...
  const stdMatch = str.match(/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (stdMatch && stdMatch[1]) {
    return stdMatch[1];
  }

  // Raw Sheet ID
  if (/^[a-zA-Z0-9_-]{20,}$/.test(str)) {
    return str;
  }

  return str;
}

/**
 * Constructs the CSV fetch URL for a given Sheet ID or URL
 */
export function buildCsvUrl(sheetIdOrUrl) {
  if (!sheetIdOrUrl) return null;
  const clean = sheetIdOrUrl.trim();

  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    if (clean.includes('output=csv')) return clean;
    if (clean.includes('/pub')) return `${clean.split('/pub')[0]}/pub?output=csv`;
    const idMatch = clean.match(/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://docs.google.com/spreadsheets/d/${idMatch[1]}/gviz/tq?tqx=out:csv`;
    }
  }

  return `https://docs.google.com/spreadsheets/d/${clean}/gviz/tq?tqx=out:csv`;
}

/**
 * Robust CSV parser that handles quoted fields, commas inside quotes, and newlines
 */
export function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function parseBool(val, defaultVal = false) {
  if (val === undefined || val === null || val === '') return defaultVal;
  const s = String(val).trim().toLowerCase();
  return ['так', 'yes', 'true', '1', '+', 'да', 'є', '+'].includes(s);
}

/**
 * Cleans and converts image values (including Google Drive links and =IMAGE formulas)
 */
export function resolveImageUrl(val) {
  if (!val) return '';
  let str = String(val).trim();

  // Strip formula wrapper: =IMAGE("url") or =IMAGE('url')
  const formulaMatch = str.match(/=IMAGE\s*\(\s*["']([^"']+)["']/i);
  if (formulaMatch && formulaMatch[1]) {
    str = formulaMatch[1].trim();
  }

  // Google Drive links: convert to direct thumbnail / view URL
  // Formats:
  // https://drive.google.com/file/d/FILE_ID/view...
  // https://drive.google.com/open?id=FILE_ID
  // https://drive.google.com/uc?id=FILE_ID
  const driveMatch = str.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  // Raw Google Drive ID
  if (/^[a-zA-Z0-9_-]{28,35}$/.test(str)) {
    return `https://lh3.googleusercontent.com/d/${str}`;
  }

  return str;
}

/**
 * Transforms raw parsed CSV rows into standardized Dish objects
 */
export function normalizeMenuFromRows(rows) {
  if (!rows || rows.length < 2) return null;

  const rawHeaders = rows[0].map(h => h.toLowerCase().trim());

  const findIdx = (...candidates) => {
    return rawHeaders.findIndex(h => candidates.some(c => h.includes(c)));
  };

  const catIdx = findIdx('категор', 'category');
  const nameIdx = findIdx('назва', 'name', 'наименование', 'блюдо', 'страва');
  const priceIdx = findIdx('ціна', 'price', 'цена');
  const weightIdx = findIdx('вага', 'weight', 'вес', 'обєм');
  const availIdx = findIdx('наявн', 'avail', 'доступ', 'наличи');
  const descIdx = findIdx('опис', 'desc', 'описание', 'склад');
  const imageIdx = findIdx('фото', 'image', 'зображен', 'картинк');

  // Optional legacy headers if present
  const idIdx = findIdx('id', 'код');
  const hitIdx = findIdx('хіт', 'hit', 'популяр');
  const newIdx = findIdx('нов', 'new');
  const spicyIdx = findIdx('гостр', 'spicy', 'остр');

  // Fallback defaults mapping by category
  const defaultImages = {
    chebureks: '/images/dishes/cheb-beef-pork.jpg',
    deepfry: '/images/dishes/fry-fries.jpg',
    wok: '/images/dishes/wok-chicken.jpg',
    breakfast: '/images/dishes/breakfast-shakshuka.jpg',
    salads: '/images/dishes/salad-caesar.jpg',
    coffee: '/images/dishes/coffee-cappuccino.jpg',
    desserts: '/images/dishes/dessert-cheesecake.jpg',
    drinks: '/images/dishes/drink-lemonade.jpg',
    sets: '/images/dishes/set-party.jpg'
  };

  const dishes = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const name = nameIdx !== -1 ? row[nameIdx] : '';
    if (!name || name.length < 2) continue; // Skip empty rows

    // Determine category from Ukrainian or English value
    let rawCategory = catIdx !== -1 && row[catIdx] ? row[catIdx].trim().toLowerCase() : 'chebureks';
    let category = CATEGORY_MAP[rawCategory] || 'chebureks';

    const rawPrice = priceIdx !== -1 ? row[priceIdx].replace(/[^\d.]/g, '') : '0';
    const price = Math.max(0, parseInt(rawPrice, 10) || 0);

    const id = (idIdx !== -1 && row[idIdx])
      ? row[idIdx].trim()
      : `dish-${r}-${name.toLowerCase().replace(/[^a-z0-9а-яіїєґ]/gi, '-').substring(0, 20)}`;

    const weight = weightIdx !== -1 && row[weightIdx] ? row[weightIdx].trim() : '200 г';
    const available = availIdx !== -1 ? parseBool(row[availIdx], true) : true;

    const fullDesc = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : name;
    const shortDesc = fullDesc.length > 80 ? fullDesc.substring(0, 77) + '...' : fullDesc;

    // Detect badges from text or optional columns
    const lowerText = (name + ' ' + fullDesc).toLowerCase();
    const isHit = (hitIdx !== -1 && parseBool(row[hitIdx], false)) || lowerText.includes('хіт') || lowerText.includes('топ') || lowerText.includes('фірмов');
    const isNew = (newIdx !== -1 && parseBool(row[newIdx], false)) || lowerText.includes('новинк') || lowerText.includes('сезонн');
    const isSpicy = (spicyIdx !== -1 && parseBool(row[spicyIdx], false)) || lowerText.includes('гостр') || lowerText.includes('спайсі') || lowerText.includes('🌶');

    // Resolve Image: Handles Drive links, =IMAGE(), or falls back to matching local image
    let rawImg = imageIdx !== -1 && row[imageIdx] ? row[imageIdx].trim() : '';
    let image = resolveImageUrl(rawImg);

    if (!image || (!image.startsWith('http') && !image.startsWith('/'))) {
      const localMatch = MENU_DATA.items.find(d => d.id === id || d.name.toLowerCase() === name.toLowerCase());
      image = localMatch ? localMatch.image : (defaultImages[category] || '/images/dishes/cheb-beef-pork.jpg');
    }

    const isCustomizable = category === 'chebureks' || category === 'deepfry';

    // Attach options based on category
    let options = null;
    if (category === 'chebureks') {
      options = {
        crusts: [
          { id: 'classic', name: 'Класичне пухирчасте', priceDelta: 0 },
          { id: 'cheese-crust', name: 'Сирний бортик', priceDelta: 25 },
          { id: 'puff', name: 'Листкове хрустке', priceDelta: 15 }
        ],
        extras: [
          { id: 'double-cheese', name: 'Подвійний сир', price: 25 },
          { id: 'jalapeno', name: 'Халапеньйо', price: 20 },
          { id: 'tomatoes', name: 'Томати', price: 15 },
          { id: 'garlic-greens', name: 'Часник та зелень', price: 15 }
        ]
      };
    } else if (category === 'deepfry') {
      options = {
        extras: [
          { id: 'cheese-sauce', name: 'Сирний соус', price: 25 },
          { id: 'bbq-sauce', name: 'Соус Барбекю', price: 25 },
          { id: 'garlic-sauce', name: 'Часниковий соус', price: 25 },
          { id: 'sweet-sour', name: 'Кисло-солодкий', price: 25 },
          { id: 'jalapeno', name: 'Халапеньйо', price: 20 },
          { id: 'extra-cheese', name: 'Подвійний сир', price: 30 }
        ]
      };
    }

    dishes.push({
      id,
      name,
      category,
      price,
      weight,
      available,
      isHit,
      isNew,
      isSpicy,
      shortDesc,
      desc: fullDesc,
      image,
      customizable: isCustomizable,
      options
    });
  }

  return dishes;
}

/**
 * Fetches and parses menu items from a published Google Sheet
 */
export async function fetchMenuFromGoogleSheet(sheetIdOrUrl) {
  const url = buildCsvUrl(sheetIdOrUrl);
  if (!url) {
    throw new Error('Не вказано посилання або ID Google Таблиці');
  }

  const fetchUrl = url + (url.includes('?') ? '&' : '?') + `t=${Date.now()}`;

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Помилка завантаження таблиці: HTTP ${response.status}`);
  }

  const csvText = await response.text();
  const rows = parseCSV(csvText);
  const dishes = normalizeMenuFromRows(rows);

  if (!dishes || dishes.length === 0) {
    throw new Error('У таблиці не знайдено страв або некоректні колонки');
  }

  return dishes;
}

/**
 * Generates an ultra-clean, simplified 6-column CSV template
 * Friendly for restaurant staff without technical IDs or complex tags
 */
export function exportMenuToCSV(dishes = MENU_DATA.items) {
  const headers = [
    'Категорія',
    'Назва страви',
    'Ціна (грн)',
    'Вага',
    'В наявності (ТАК/НІ)',
    'Опис страви',
    'Фото (Google Drive або посилання)'
  ];

  const escapeCSV = (val) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines = [headers.map(escapeCSV).join(',')];

  dishes.forEach(d => {
    const categoryName = CATEGORY_DISPLAY_NAMES[d.category] || d.category;
    const description = d.desc || d.shortDesc || '';
    const photoVal = d.image || '';

    lines.push([
      escapeCSV(categoryName),
      escapeCSV(d.name),
      escapeCSV(d.price),
      escapeCSV(d.weight),
      escapeCSV(d.available !== false ? 'ТАК' : 'НІ'),
      escapeCSV(description),
      escapeCSV(photoVal)
    ].join(','));
  });

  return '\uFEFF' + lines.join('\r\n');
}

/**
 * Triggers browser download of the clean CSV template
 */
export function downloadMenuCSVTemplate(dishes = MENU_DATA.items) {
  const csvContent = exportMenuToCSV(dishes);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'cheburoom_menu_prostiy.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export { STORAGE_KEYS };
