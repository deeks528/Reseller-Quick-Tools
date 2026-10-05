import crypto from 'crypto';

/**
 * Generate a short, URL-safe cryptographically secure random token (e.g. "K8f92LmQ")
 * @param {number} length
 * @returns {string}
 */
export const generateOrderToken = (length = 8) => {
  // Use URL-safe characters: letters and numbers
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
};

/**
 * Generate a clean, random, non-sensitive business code
 * e.g. "sri-sai-4x9a" or slug + random 4 chars
 * @param {string} businessName
 * @returns {string}
 */
export const generateBusinessCode = (businessName = 'biz') => {
  const slug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 15) || 'biz';
  const randomSuffix = crypto.randomBytes(3).toString('hex').slice(0, 4);
  return `${slug}-${randomSuffix}`;
};
