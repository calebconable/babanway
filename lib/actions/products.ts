'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, products, categories, type Product, type NewProduct } from '../db';
import { eq, like, desc, and, sql, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { isSimplifiedMode } from '@/lib/config/simplified';
import { simplifiedProducts } from '@/lib/data/simplifiedProducts';

function getSimplifiedProducts(options?: {
  categoryId?: number;
  search?: string;
  limit?: number;
  offset?: number;
  activeOnly?: boolean;
}): Product[] {
  if (options?.categoryId) {
    return [];
  }

  let results = [...simplifiedProducts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  if (options?.activeOnly !== false) {
    results = results.filter((product) => product.isActive);
  }

  if (options?.search) {
    const term = options.search.toLowerCase();
    results = results.filter((product) => {
      const name = product.name.toLowerCase();
      const description = product.description?.toLowerCase() ?? '';
      return name.includes(term) || description.includes(term);
    });
  }

  const offset = options?.offset ?? 0;
  const limit = options?.limit ?? 50;
  return results.slice(offset, offset + limit);
}

/**
 * Get all products with optional filtering
 */
export async function getProducts(options?: {
  categoryId?: number;
  search?: string;
  limit?: number;
  offset?: number;
  activeOnly?: boolean;
}): Promise<Product[]> {
  if (isSimplifiedMode()) {
    return getSimplifiedProducts(options);
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const conditions = [];

  // Filter by active status (default to active only for public)
  if (options?.activeOnly !== false) {
    conditions.push(eq(products.isActive, true));
  }

  // Filter by category
  if (options?.categoryId) {
    conditions.push(eq(products.categoryId, options.categoryId));
  }

  // Search by name or description
  if (options?.search) {
    const searchTerm = `%${options.search}%`;
    conditions.push(
      or(
        like(products.name, searchTerm),
        like(products.description, searchTerm)
      )
    );
  }

  const query = db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt))
    .limit(options?.limit || 50)
    .offset(options?.offset || 0);

  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }

  return query;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: number): Promise<Product | null> {
  if (isSimplifiedMode()) {
    return simplifiedProducts.find((product) => product.id === id) ?? null;
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(
  categorySlug: string,
  options?: { limit?: number; offset?: number }
): Promise<Product[]> {
  if (isSimplifiedMode()) {
    return [];
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  // First get the category
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1);

  if (!category[0]) {
    return [];
  }

  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.categoryId, category[0].id),
        eq(products.isActive, true)
      )
    )
    .orderBy(desc(products.createdAt))
    .limit(options?.limit || 50)
    .offset(options?.offset || 0);
}

/**
 * Create a new product (Admin)
 */
export async function createProduct(
  data: Omit<NewProduct, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Products are read-only.');
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const result = await db.insert(products).values(data).returning();

  revalidatePath('/products');
  revalidatePath('/admin/products');
  revalidatePath('/');

  return result[0];
}

/**
 * Update a product (Admin)
 */
export async function updateProduct(
  id: number,
  data: Partial<Omit<NewProduct, 'id' | 'createdAt'>>
): Promise<Product | null> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Products are read-only.');
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const result = await db
    .update(products)
    .set({
      ...data,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(products.id, id))
    .returning();

  revalidatePath('/products');
  revalidatePath('/admin/products');
  revalidatePath('/');

  return result[0] || null;
}

/**
 * Delete a product (Admin)
 */
export async function deleteProduct(id: number): Promise<boolean> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Products are read-only.');
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  await db.delete(products).where(eq(products.id, id));

  revalidatePath('/products');
  revalidatePath('/admin/products');
  revalidatePath('/');

  return true;
}

/**
 * Update product stock (Admin)
 */
export async function updateStock(
  id: number,
  quantity: number
): Promise<Product | null> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Products are read-only.');
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const result = await db
    .update(products)
    .set({
      stockQuantity: quantity,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(products.id, id))
    .returning();

  revalidatePath('/products');
  revalidatePath('/admin/products');

  return result[0] || null;
}

/**
 * Toggle product active status (Admin)
 */
export async function toggleProductStatus(id: number): Promise<Product | null> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Products are read-only.');
  }

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  // Get current status
  const current = await getProductById(id);
  if (!current) return null;

  const result = await db
    .update(products)
    .set({
      isActive: !current.isActive,
      updatedAt: sql`(unixepoch())`,
    })
    .where(eq(products.id, id))
    .returning();

  revalidatePath('/products');
  revalidatePath('/admin/products');
  revalidatePath('/');

  return result[0] || null;
}
