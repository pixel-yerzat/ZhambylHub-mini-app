/**
 * Formatting utilities for dates, numbers, and file sizes
 */

/**
 * Format bytes into human readable string (KB, MB)
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Format date string into readable format
 * @param {string|Date} dateInput
 * @param {string} locale
 * @returns {string}
 */
export const formatDate = (dateInput, locale = 'ru-RU') => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Truncate long text with ellipsis
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (str, maxLength = 80) => {
  if (!str || str.length <= maxLength) return str || '';
  return `${str.slice(0, maxLength).trim()}...`;
};
