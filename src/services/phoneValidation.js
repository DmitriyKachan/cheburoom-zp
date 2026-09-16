/**
 * Ukrainian phone number and operator validation service
 * Reference: Ukrainian National Numbering Plan (НКЕК / ITU-T E.164)
 */

export const UA_OPERATOR_CODES = {
  // Vodafone Ukraine
  '50': { name: 'Vodafone', type: 'mobile', color: 'text-red-500 dark:text-red-400', badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50' },
  '66': { name: 'Vodafone', type: 'mobile', color: 'text-red-500 dark:text-red-400', badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50' },
  '95': { name: 'Vodafone', type: 'mobile', color: 'text-red-500 dark:text-red-400', badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50' },
  '99': { name: 'Vodafone', type: 'mobile', color: 'text-red-500 dark:text-red-400', badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50' },
  '75': { name: 'Vodafone', type: 'mobile', color: 'text-red-500 dark:text-red-400', badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50' },

  // Kyivstar
  '67': { name: 'Kyivstar', type: 'mobile', color: 'text-sky-500 dark:text-sky-400', badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/50' },
  '68': { name: 'Kyivstar', type: 'mobile', color: 'text-sky-500 dark:text-sky-400', badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/50' },
  '96': { name: 'Kyivstar', type: 'mobile', color: 'text-sky-500 dark:text-sky-400', badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/50' },
  '97': { name: 'Kyivstar', type: 'mobile', color: 'text-sky-500 dark:text-sky-400', badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/50' },
  '98': { name: 'Kyivstar', type: 'mobile', color: 'text-sky-500 dark:text-sky-400', badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/50' },
  '77': { name: 'Kyivstar', type: 'mobile', color: 'text-sky-500 dark:text-sky-400', badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/50' },

  // lifecell
  '63': { name: 'lifecell', type: 'mobile', color: 'text-amber-500 dark:text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
  '73': { name: 'lifecell', type: 'mobile', color: 'text-amber-500 dark:text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },
  '93': { name: 'lifecell', type: 'mobile', color: 'text-amber-500 dark:text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50' },

  // Other mobile / CDMA
  '91': { name: '3Mob', type: 'mobile', color: 'text-emerald-500 dark:text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' },
  '92': { name: 'PEOPLEnet', type: 'mobile', color: 'text-teal-500 dark:text-teal-400', badgeBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900/50' },
  '94': { name: 'Інтертелеком', type: 'mobile', color: 'text-cyan-500 dark:text-cyan-400', badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50' },

  // SIP / Regional fixed-line codes
  '89': { name: 'SIP-телефонія', type: 'sip', color: 'text-purple-500 dark:text-purple-400', badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' },
  '61': { name: 'Запоріжжя (міський)', type: 'landline', color: 'text-zinc-500 dark:text-zinc-400', badgeBg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700' },
  '44': { name: 'Київ (міський)', type: 'landline', color: 'text-zinc-500 dark:text-zinc-400', badgeBg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700' },
  '56': { name: 'Дніпро (міський)', type: 'landline', color: 'text-zinc-500 dark:text-zinc-400', badgeBg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700' },
  '57': { name: 'Харків (міський)', type: 'landline', color: 'text-zinc-500 dark:text-zinc-400', badgeBg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700' },
  '48': { name: 'Одеса (міський)', type: 'landline', color: 'text-zinc-500 dark:text-zinc-400', badgeBg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700' },
  '32': { name: 'Львів (міський)', type: 'landline', color: 'text-zinc-500 dark:text-zinc-400', badgeBg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700' },
};

/**
 * Extracts normalized 9 national digits from any Ukrainian phone input string
 * (e.g. "+380 (95) 123 45 67" -> "951234567")
 */
export function extractUkrainianDigits(phoneStr) {
  if (!phoneStr) return '';
  let val = String(phoneStr).replace(/\D/g, '');
  if (val.startsWith('380')) {
    val = val.substring(3);
  } else if (val.startsWith('0')) {
    val = val.substring(1);
  }
  return val.substring(0, 9);
}

/**
 * Validates Ukrainian phone number and identifies operator
 * @param {string} phoneStr
 * @returns {object} validation result
 */
export function getUkrainianPhoneInfo(phoneStr) {
  const digits = extractUkrainianDigits(phoneStr);

  if (!digits || digits.length === 0) {
    return {
      isValid: false,
      reason: 'empty',
      digits: '',
      code: '',
      fullCode: '',
      operator: null,
      message: 'Вкажіть номер телефону'
    };
  }

  if (digits.length === 1) {
    return {
      isValid: false,
      reason: 'incomplete_code',
      digits,
      code: digits,
      fullCode: `0${digits}`,
      operator: null,
      message: 'Введіть код оператора'
    };
  }

  const code = digits.substring(0, 2);
  const fullCode = `0${code}`;
  const operator = UA_OPERATOR_CODES[code] || null;

  // If 2 digits entered and code does NOT exist in UA operator registry
  if (!operator) {
    return {
      isValid: false,
      reason: 'invalid_operator',
      digits,
      code,
      fullCode,
      operator: null,
      message: `Неіснуючий код оператора (${fullCode}). Вкажіть дійсний номер`
    };
  }

  // Code is valid, now check completeness (total 9 digits required)
  if (digits.length < 9) {
    return {
      isValid: false,
      reason: 'incomplete_number',
      digits,
      code,
      fullCode,
      operator,
      message: `Заповніть повний номер (${digits.length}/9 цифр)`
    };
  }

  // Check for fake repeating subscriber numbers (e.g. 095-000-00-00, 095-111-11-11) or 0000000
  const subscriberPart = digits.substring(2); // 7 digits
  if (/^(\d)\1{6}$/.test(subscriberPart) || subscriberPart === '0000000') {
    return {
      isValid: false,
      reason: 'repetitive_digits',
      digits,
      code,
      fullCode,
      operator,
      message: 'Будь ласка, вкажіть реальний контактний номер'
    };
  }

  return {
    isValid: true,
    reason: 'ok',
    digits,
    code,
    fullCode,
    operator,
    message: ''
  };
}
