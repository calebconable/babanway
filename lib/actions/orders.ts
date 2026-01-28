'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, orders, customers, type Order, type OrderItem } from '../db';
import { eq, desc, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { isSimplifiedMode } from '@/lib/config/simplified';

function generateReferenceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) {
    code += chars[array[i] % chars.length];
  }
  return code;
}

export async function createOrder(
  customerId: number,
  items: OrderItem[],
  totalPrice: number
): Promise<Order> {
  if (isSimplifiedMode()) {
    throw new Error('Simplified mode is enabled. Ordering is disabled.');
  }

  const { env } = await getCloudflareContext();
  const db = getDb(env.DB);

  let referenceCode = generateReferenceCode();
  let attempts = 0;

  while (attempts < 5) {
    const existing = await db
      .select()
      .from(orders)
      .where(eq(orders.referenceCode, referenceCode))
      .limit(1);

    if (existing.length === 0) {
      break;
    }

    referenceCode = generateReferenceCode();
    attempts++;
  }

  const result = await db
    .insert(orders)
    .values({
      referenceCode,
      customerId,
      items,
      totalPrice,
      status: 'pending',
    })
    .returning();

  revalidatePath('/admin/orders');

  return result[0];
}

export async function getOrderByReference(
  referenceCode: string
): Promise<(Order & { customer: { id: number; name: string; email: string } }) | null> {
  if (isSimplifiedMode()) {
    return null;
  }

  const { env } = await getCloudflareContext();
  const db = getDb(env.DB);

  const result = await db
    .select({
      order: orders,
      customer: {
        id: customers.id,
        name: customers.name,
        email: customers.email,
      },
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.referenceCode, referenceCode.toUpperCase()))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return {
    ...result[0].order,
    customer: result[0].customer,
  };
}

export async function getOrdersByCustomer(customerId: number): Promise<Order[]> {
  if (isSimplifiedMode()) {
    return [];
  }

  const { env } = await getCloudflareContext();
  const db = getDb(env.DB);

  return db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customerId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrders(options?: {
  status?: 'pending' | 'completed' | 'cancelled';
  limit?: number;
  offset?: number;
}): Promise<(Order & { customer: { id: number; name: string; email: string } })[]> {
  if (isSimplifiedMode()) {
    return [];
  }

  const { env } = await getCloudflareContext();
  const db = getDb(env.DB);

  const conditions = [];
  if (options?.status) {
    conditions.push(eq(orders.status, options.status));
  }

  const query = db
    .select({
      order: orders,
      customer: {
        id: customers.id,
        name: customers.name,
        email: customers.email,
      },
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(options?.limit ?? 50)
    .offset(options?.offset ?? 0);

  const result = await query;

  return result.map((row) => ({
    ...row.order,
    customer: row.customer,
  }));
}

export async function completeOrder(orderId: number): Promise<Order | null> {
  if (isSimplifiedMode()) {
    return null;
  }

  const { env } = await getCloudflareContext();
  const db = getDb(env.DB);

  const result = await db
    .update(orders)
    .set({
      status: 'completed',
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  revalidatePath('/admin/orders');

  return result[0] ?? null;
}

export async function cancelOrder(orderId: number): Promise<Order | null> {
  if (isSimplifiedMode()) {
    return null;
  }

  const { env } = await getCloudflareContext();
  const db = getDb(env.DB);

  const result = await db
    .update(orders)
    .set({
      status: 'cancelled',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  revalidatePath('/admin/orders');

  return result[0] ?? null;
}

export async function getOrderStats(): Promise<{
  pending: number;
  completed: number;
  cancelled: number;
  todayRevenue: number;
}> {
  if (isSimplifiedMode()) {
    return {
      pending: 0,
      completed: 0,
      cancelled: 0,
      todayRevenue: 0,
    };
  }

  const { env } = await getCloudflareContext();
  const db = getDb(env.DB);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pendingResult, completedResult, cancelledResult, revenueResult] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'pending')),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'completed')),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'cancelled')),
    db
      .select({ total: sql<number>`coalesce(sum(total_price), 0)` })
      .from(orders)
      .where(
        and(
          eq(orders.status, 'completed'),
          sql`created_at >= ${Math.floor(today.getTime() / 1000)}`
        )
      ),
  ]);

  return {
    pending: pendingResult[0]?.count ?? 0,
    completed: completedResult[0]?.count ?? 0,
    cancelled: cancelledResult[0]?.count ?? 0,
    todayRevenue: revenueResult[0]?.total ?? 0,
  };
}
