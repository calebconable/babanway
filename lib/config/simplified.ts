const truthyValues = new Set(['1', 'true', 'yes', 'on']);

export function isSimplifiedMode(): boolean {
  const value = process.env.SIMPLIFIED;
  if (!value) {
    return false;
  }
  return truthyValues.has(value.toLowerCase());
}
