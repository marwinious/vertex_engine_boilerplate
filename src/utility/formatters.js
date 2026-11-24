/**
 * Formats a number or numeric string into a human-readable format.
 *
 * @param {number|string} value - The number or string to format.
 * @param {Object} [options={}] - Formatting configuration.
 * @param {boolean} [options.useGrouping=true] - Whether to include thousands separators.
 * @param {number} [options.decimals=null] - Exact number of decimal places (overrides min/max).
 * @param {number} [options.minDecimals=0] - Minimum decimal places (used if `decimals` is null).
 * @param {number} [options.maxDecimals=2] - Maximum decimal places (used if `decimals` is null).
 * @param {string} [options.currency=null] - ISO currency code (e.g., 'USD', 'EUR', 'JPY').
 * @param {boolean} [options.compact=false] - Use compact notation (e.g., 1.2K, 3.4M).
 * @param {boolean} [options.isPercent=false] - Format as percentage (multiplies by 100, e.g., 0.25 -> 25%).
 * @param {string} [options.prefix=''] - Text to prepend (ignored if `currency` is set).
 * @param {string} [options.suffix=''] - Text to append (ignored if `isPercent` is true).
 * @param {string} [options.locale='en-US'] - BCP 47 language tag for regional formatting.
 * @param {string} [options.fallback='N/A'] - Returned string if input cannot be parsed as a valid number.
 * @returns {string}
 */
/*
EXAMPLES:

// 1. Basic usage (defaults: commas on, up to 2 decimals)
formatNumber(1234567.891);                 // "1,234,567.89"
formatNumber("1234567.8");                 // "1,234,567.8" (string input)
formatNumber("1,234,567.899");             // "1,234,567.9" (strips existing commas first)

// 2. Controlling decimals & separators
formatNumber(1234567.89, { decimals: 0 }); // "1,234,568" (no decimals, rounded)
formatNumber(1234.5, { decimals: 3 });     // "1,234.500" (padded zeros)
formatNumber(1234567.89, { useGrouping: false }); // "1234567.89"

// 3. Common real-world scenarios
formatNumber(1499.9, { currency: 'USD', decimals: 2 }); // "$1,499.90"
formatNumber(1540000, { compact: true, maxDecimals: 1 }); // "1.5M"
formatNumber(0.854, { isPercent: true, decimals: 1 });    // "85.4%"
formatNumber(42, { suffix: ' kg' });                      // "42 kg"

// 4. Internationalization & Edge Cases
formatNumber(1234567.89, { locale: 'de-DE' }); // "1.234.567,89"
formatNumber("not-a-number", { fallback: "--" }); // "--"
*/
export function formatNumber(value, options = {}) {
  const {
    useGrouping = true,
    decimals = null,
    minDecimals = 0,
    maxDecimals = 2,
    currency = null,
    compact = false,
    isPercent = false,
    prefix = '',
    suffix = '',
    locale = 'en-US',
    fallback = 'N/A',
  } = options;

  // 1. Handle null, undefined, empty strings, or booleans
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
    return fallback;
  }

  // 2. Clean string inputs (remove existing commas or whitespace) and parse
  const cleanedValue = typeof value === 'string' 
    ? value.replace(/,/g, '').trim() 
    : value;
    
  const num = Number(cleanedValue);

  // 3. Catch NaN or Infinity
  if (!Number.isFinite(num)) {
    return fallback;
  }

  // 4. Configure Intl.NumberFormat options
  const intlOptions = {
    useGrouping,
    minimumFractionDigits: decimals !== null ? decimals : minDecimals,
    maximumFractionDigits: decimals !== null ? decimals : maxDecimals,
  };

  if (currency) {
    intlOptions.style = 'currency';
    intlOptions.currency = currency;
  } else if (isPercent) {
    intlOptions.style = 'percent';
  }

  if (compact) {
    intlOptions.notation = 'compact';
    intlOptions.compactDisplay = 'short';
  }

  // 5. Format and apply manual prefix/suffix if applicable
  let formatted = new Intl.NumberFormat(locale, intlOptions).format(num);

  if (prefix && !currency) {
    formatted = `${prefix}${formatted}`;
  }
  if (suffix && !isPercent) {
    formatted = `${formatted}${suffix}`;
  }

  return formatted;
}