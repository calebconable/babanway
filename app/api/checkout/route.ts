import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, orders, type OrderItem } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { isSimplifiedMode } from '@/lib/config/simplified';

export const runtime = 'edge';

type CheckoutRequest = {
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
};

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

export async function POST(request: NextRequest) {
  try {
    if (isSimplifiedMode()) {
      return NextResponse.json(
        { success: false, message: 'Ordering is disabled in simplified mode.' },
        { status: 403 }
      );
    }

    const customerData = request.cookies.get('customer_data')?.value;

    if (!customerData) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to checkout' },
        { status: 401 }
      );
    }

    let customer: { id: number; name: string; email: string };
    try {
      customer = JSON.parse(customerData);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as Partial<CheckoutRequest>;

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }

    const orderItems: OrderItem[] = body.items.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
    }));

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const { env } = getRequestContext();
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
        customerId: customer.id,
        items: orderItems,
        totalPrice,
        status: 'pending',
      })
      .returning();

    const order = result[0];

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        referenceCode: order.referenceCode,
        totalPrice: order.totalPrice,
        items: orderItems,
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during checkout' },
      { status: 500 }
    );
  }
}
