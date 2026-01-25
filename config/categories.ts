import type { NewCategory } from '@/lib/db/schema';

/**
 * Initial categories to seed the database
 */
export const initialCategories: Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Dairy', slug: 'dairy', displayOrder: 1 },
  { name: 'Produce', slug: 'produce', displayOrder: 2 },
  { name: 'Canned Goods', slug: 'canned', displayOrder: 3 },
  { name: 'Rice & Grains', slug: 'grains', displayOrder: 4 },
  { name: 'Beverages', slug: 'beverages', displayOrder: 5 },
  { name: 'Snacks', slug: 'snacks', displayOrder: 6 },
  { name: 'Frozen', slug: 'frozen', displayOrder: 7 },
  { name: 'Household', slug: 'household', displayOrder: 8 },
];

/**
 * Category icons mapping (using Lucide icon names)
 */
export const categoryIcons: Record<string, string> = {
  dairy: 'Milk',
  produce: 'Apple',
  canned: 'Package',
  grains: 'Wheat',
  beverages: 'Coffee',
  snacks: 'Cookie',
  frozen: 'Snowflake',
  household: 'Home',
};
