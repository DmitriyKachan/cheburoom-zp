// Cryptographic Auth Service for Cheburoom Admin
// Works in both Secure Contexts (HTTPS/localhost) and Non-Secure Contexts (HTTP on local IP 192.168.x.x)
import { broadcastPasswordHash, subscribeToPasswordHash, fetchCloudPasswordHash } from './orderSyncService';

const STORAGE_KEYS = {
  PASS_HASH: 'cheburoom_admin_hash_v1',
  LOCKOUT_UNTIL: 'cheburoom_admin_lockout_until',
  FAILED_ATTEMPTS: 'cheburoom_admin_failed_attempts'
};

// Initial Cloud Hydration & live listener for password updates across devices
try {
  if (typeof window !== 'undefined') {
    fetchCloudPasswordHash().then(cloudHash => {
      if (cloudHash && typeof cloudHash === 'string' && cloudHash.length === 64) {
        localStorage.setItem(STORAGE_KEYS.PASS_HASH, cloudHash);
      }
    }).catch(() => {});

    subscribeToPasswordHash((cloudHash) => {
      if (cloudHash && typeof cloudHash === 'string' && cloudHash.length === 64) {
        localStorage.setItem(STORAGE_KEYS.PASS_HASH, cloudHash);
      }
    });
  }
} catch (e) {
  console.warn('Password hash cloud sync listener error', e);
}

const SESSION_KEY = 'cheburoom_admin_session_token';
const DEFAULT_PASSWORD = 'chebu2026';
const SALT = '_cheburoom_salt_2026';

export async function syncCurrentPasswordToCloud() {
  try {
    const storedHash = localStorage.getItem(STORAGE_KEYS.PASS_HASH);
    if (storedHash) {
      await broadcastPasswordHash(storedHash);
    }
  } catch {}
}

/**
 * Normalizes input from mobile & desktop keyboards:
 * - Trims whitespace and zero-width spaces
 * - Replaces Cyrillic lookalikes (e.g. Cyrillic 'с' and 'е' -> Latin 'c' and 'e')
 * - Maps phonetic 'чебу' -> 'chebu'
 */
export function normalizePassword(raw) {
  if (!raw) return '';
  let s = String(raw).replace(/[\s\uFEFF\xA0]+/g, '').trim();
  const charMap = {
    'а': 'a', 'А': 'A',
    'с': 'c', 'С': 'C',
    'е': 'e', 'Е': 'E',
    'о': 'o', 'О': 'O',
    'р': 'p', 'Р': 'P',
    'х': 'x', 'Х': 'X',
    'у': 'y', 'У': 'Y',
    'і': 'i', 'І': 'I',
    'ї': 'i', 'Ї': 'I',
    'В': 'B', 'М': 'M', 'Т': 'T', 'Н': 'H', 'К': 'K'
  };
  s = s.replace(/^[чЧ][еЕ][бБ][уУ]/, 'chebu');
  let result = '';
  for (const ch of s) {
    result += charMap[ch] || ch;
  }
  return result;
}

/**
 * Pure JavaScript SHA-256 implementation (RFC 6234 compliant with full UTF-8 support)
 * Works 100% reliably on HTTP, HTTPS, mobile Safari, Chrome, and local network IPs
 */
function jsSha256(str) {
  let ascii;
  try {
    ascii = unescape(encodeURIComponent(str));
  } catch {
    ascii = str;
  }

  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;
  let result = '';

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  const k = [];
  let primeCounter = 0;

  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  let padded = ascii + '\x80';
  while ((padded[lengthProperty] % 64) - 56) padded += '\x00';
  for (i = 0; i < padded[lengthProperty]; i++) {
    j = padded.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = (hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        )) | 0;
      const temp2 = ((rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]))) | 0;

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Computes SHA-256 hex string with salt
 */
export async function hashPassword(password) {
  const salted = password + SALT;

  // Prefer Web Crypto API if available in secure context
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle?.digest) {
      const encoder = new TextEncoder();
      const data = encoder.encode(salted);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fallback to pure JS below
  }

  return jsSha256(salted);
}

// Pre-computed hash of default password 'chebu2026'
const DEFAULT_HASH = jsSha256(DEFAULT_PASSWORD + SALT);

/**
 * Checks lockout state (returns seconds remaining if locked, or 0)
 */
export function getLockoutRemainingSeconds() {
  try {
    const lockoutUntil = localStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL);
    if (!lockoutUntil) return 0;
    const diff = parseInt(lockoutUntil, 10) - Date.now();
    if (diff <= 0) {
      localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
      localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
      return 0;
    }
    return Math.ceil(diff / 1000);
  } catch {
    return 0;
  }
}

/**
 * Resets lockout (for administrator troubleshooting)
 */
export function resetAdminLockout() {
  try {
    localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
    localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
  } catch {}
}

/**
 * Authenticates user with entered password
 */
export async function authenticateAdmin(rawPassword) {
  const norm = normalizePassword(rawPassword);
  if (!norm) {
    throw new Error('Введіть пароль');
  }

  const remaining = getLockoutRemainingSeconds();
  if (remaining > 0) {
    throw new Error(`Вхід тимчасово заблоковано. Зачекайте ${remaining} сек.`);
  }

  const rawTrimmed = (rawPassword || '').trim();
  const lowerNorm = norm.toLowerCase();
  const enteredHash = await hashPassword(norm);
  const lowerHash = await hashPassword(lowerNorm);
  const rawHash = await hashPassword(rawTrimmed);

  let storedHash = localStorage.getItem(STORAGE_KEYS.PASS_HASH);

  // If no local password hash is stored, check cloud or fallback to default
  if (!storedHash) {
    try {
      const cloudHash = await fetchCloudPasswordHash();
      if (cloudHash && typeof cloudHash === 'string' && cloudHash.length === 64) {
        localStorage.setItem(STORAGE_KEYS.PASS_HASH, cloudHash);
        storedHash = cloudHash;
      }
    } catch {}
  }

  const targetHash = storedHash || DEFAULT_HASH;
  let isMatch = (enteredHash === targetHash || lowerHash === targetHash || rawHash === targetHash);

  // If match failed and we had a stored hash, check if cloud has an updated hash
  if (!isMatch && storedHash) {
    try {
      const cloudHash = await fetchCloudPasswordHash();
      if (cloudHash && cloudHash !== storedHash) {
        localStorage.setItem(STORAGE_KEYS.PASS_HASH, cloudHash);
        isMatch = (enteredHash === cloudHash || lowerHash === cloudHash || rawHash === cloudHash);
      }
    } catch {}
  }

  if (isMatch) {
    // Success: reset failed attempts, grant session
    resetAdminLockout();

    const token = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    try {
      sessionStorage.setItem(SESSION_KEY, token);
    } catch {}
    return true;
  } else {
    // Failure: increment attempt counter
    const currentAttempts = parseInt(localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS) || '0', 10) + 1;
    localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, currentAttempts.toString());

    if (currentAttempts >= 5) {
      const lockUntil = Date.now() + 5 * 60 * 1000;
      localStorage.setItem(STORAGE_KEYS.LOCKOUT_UNTIL, lockUntil.toString());
      throw new Error('5 невірних спроб! Вхід заблоковано на 5 хв. для захисту.');
    }

    const attemptsLeft = 5 - currentAttempts;
    throw new Error(`Невірний пароль! Залишилось спроб: ${attemptsLeft}`);
  }
}

/**
 * Checks if current browser tab has an active admin session
 */
export function isAdminAuthenticated() {
  try {
    const token = sessionStorage.getItem(SESSION_KEY);
    return Boolean(token && token.startsWith('session_'));
  } catch {
    return false;
  }
}

/**
 * Destroys current session
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

/**
 * Changes admin password
 */
export async function changeAdminPassword(oldPassword, newPassword) {
  const normNew = normalizePassword(newPassword);
  if (!normNew || normNew.length < 6) {
    throw new Error('Новий пароль повинен містити щонайменше 6 символів');
  }

  const normOld = normalizePassword(oldPassword);
  const rawOld = (oldPassword || '').trim();
  let storedHash = localStorage.getItem(STORAGE_KEYS.PASS_HASH) || DEFAULT_HASH;
  const oldHash = await hashPassword(normOld);
  const oldLowerHash = await hashPassword(normOld.toLowerCase());
  const oldRawHash = await hashPassword(rawOld);

  let isOldValid = (oldHash === storedHash || oldLowerHash === storedHash || oldRawHash === storedHash);

  if (!isOldValid) {
    // Check cloud for recent password change
    try {
      const cloudHash = await fetchCloudPasswordHash();
      if (cloudHash && (oldHash === cloudHash || oldLowerHash === cloudHash || oldRawHash === cloudHash)) {
        isOldValid = true;
      }
    } catch {}
  }

  if (!isOldValid) {
    throw new Error('Поточний пароль вказано невірно');
  }

  const newHash = await hashPassword(normNew);
  localStorage.setItem(STORAGE_KEYS.PASS_HASH, newHash);
  await broadcastPasswordHash(newHash);
  return true;
}
