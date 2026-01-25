'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, categories, type Category, type NewCategory } from '../db';
import { eq, asc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { isSimplifiedMode } from '@/lib/config/simplified';

/**
 * Get all categories ordered by display order
 */
export async function getCategories(): Promise<Category[]> {
  if (isSimplifiedMode()) {
    return [];
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder));
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isSimplifiedMode()) {
    return null;
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return result[0] || null;
}

/**
 * Get a category by ID
 */
export async function getCategoryById(id: number): Promise<Category | null> {
  if (isSimplifiedMode()) {
    return null;
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * Create a new category (Admin)
 */
export async function createCategory(
  data: Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Category> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Categories are read-only.');
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const result = await db.insert(categories).values(data).returning();

  revalidatePath('/products');
  revalidatePath('/admin/categories');
  revalidatePath('/');

  return result[0];
}

/**
 * Update a category (Admin)
 */
export async function updateCategory(
  id: number,
  data: Partial<Omit<NewCategory, 'id' | 'createdAt'>>
): Promise<Category | null> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Categories are read-only.');
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const result = await db
    .update(categories)
    .set({
      ...data,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(categories.id, id))
    .returning();

  revalidatePath('/products');
  revalidatePath('/admin/categories');
  revalidatePath('/');

  return result[0] || null;
}

/**
 * Delete a category (Admin)
 */
export async function deleteCategory(id: number): Promise<boolean> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Categories are read-only.');
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath('/products');
  revalidatePath('/admin/categories');
  revalidatePath('/');

  return true;
}

/**
 * Seed initial categories (Admin setup)
 */
export async function seedCategories(
  categoriesData: Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>[]
): Promise<Category[]> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Categories are read-only.');
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const results: Category[] = [];

  for (const categoryData of categoriesData) {
    // Check if already exists
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categoryData.slug))
      .limit(1);

    if (existing.length === 0) {
      const result = await db.insert(categories).values(categoryData).returning();
      results.push(result[0]);
    } else {
      results.push(existing[0]);
    }
  }

  revalidatePath('/products');
  revalidatePath('/');

  return results;
}
