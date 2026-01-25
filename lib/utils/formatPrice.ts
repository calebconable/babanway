/**
 * Format price in Iraqi Dinar (IQD)
 */
export function formatPrice(price?: number | null): string {
  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return '';
  }
  return new Intl.NumberFormat('en-IQ', {
    style: 'currency',
    currency: 'IQD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price with custom currency symbol
 */
export function formatPriceSimple(price?: number | null): string {
  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return '—';
  }
  return `${price.toLocaleString()} IQD`;
}
