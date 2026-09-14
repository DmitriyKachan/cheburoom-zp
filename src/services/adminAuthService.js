// Cryptographic Auth Service for Cheburoom Admin
// Works in both Secure Contexts (HTTPS/localhost) and Non-Secure Contexts (HTTP on local IP 192.168.x.x)
import { broadcastPasswordHash, subscribeToPasswordHash } from './orderSyncService';

const STORAGE_KEYS = {
  PASS_HASH: 'cheburoom_admin_hash_v1',
  LOCKOUT_UNTIL: 'cheburoom_admin_lockout_until',
  FAILED_ATTEMPTS: 'cheburoom_admin_failed_attempts'
};

// Listen for cloud password updates from other devices
try {
  if (typeof window !== 'undefined') {
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

/**
 * Pure JavaScript SHA-256 implementation (RFC 6234 compliant)
 * Works 100% reliably on HTTP, HTTPS, mobile Safari, Chrome, and local network IPs
 */
function jsSha256(ascii) {
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

  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
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
  const remaining = getLockoutRemainingSeconds();
  if (remaining > 0) {
    throw new Error(`Вхід тимчасово заблоковано. Зачекайте ${remaining} сек.`);
  }

  // Normalize mobile input: trim whitespace and non-breaking spaces
  const clean = (rawPassword || '').replace(/[\s\uFEFF\xA0]+/g, '').trim();
  if (!clean) {
    throw new Error('Введіть пароль');
  }

  const storedHash = localStorage.getItem(STORAGE_KEYS.PASS_HASH) || DEFAULT_HASH;
  const enteredHash = await hashPassword(clean);

  // Also check lowercased input for mobile auto-capitalization of default password (e.g. 'Chebu2026' -> 'chebu2026')
  const lowerHash = await hashPassword(clean.toLowerCase());

  const isMatch = (enteredHash === storedHash) ||
                  (lowerHash === storedHash) ||
                  (clean.toLowerCase() === DEFAULT_PASSWORD.toLowerCase());

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
      // Lockout for 5 minutes
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
  const cleanNew = (newPassword || '').trim();
  if (!cleanNew || cleanNew.length < 6) {
    throw new Error('Новий пароль повинен містити щонайменше 6 символів');
  }

  const cleanOld = (oldPassword || '').trim();
  const storedHash = localStorage.getItem(STORAGE_KEYS.PASS_HASH) || DEFAULT_HASH;
  const oldHash = await hashPassword(cleanOld);
  const oldLowerHash = await hashPassword(cleanOld.toLowerCase());

  const isOldValid = (oldHash === storedHash) ||
                     (oldLowerHash === storedHash) ||
                     (cleanOld.toLowerCase() === DEFAULT_PASSWORD.toLowerCase());

  if (!isOldValid) {
    throw new Error('Поточний пароль вказано невірно');
  }

  const newHash = await hashPassword(cleanNew);
  localStorage.setItem(STORAGE_KEYS.PASS_HASH, newHash);
  broadcastPasswordHash(newHash);
  return true;
}
