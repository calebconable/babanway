import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, customers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { isSimplifiedMode } from '@/lib/config/simplified';

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * GET /api/customer/auth - Get current customer from cookie
 */
export async function GET(request: NextRequest) {
  try {
    if (isSimplifiedMode()) {
      return NextResponse.json({ customer: null });
    }

    const customerData = request.cookies.get('customer_data')?.value;

    if (!customerData) {
      return NextResponse.json({ customer: null });
    }

    const customer = JSON.parse(customerData);
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ customer: null });
  }
}

/**
 * POST /api/customer/auth - Login
 */
export async function POST(request: NextRequest) {
  try {
    if (isSimplifiedMode()) {
      return NextResponse.json(
        { success: false, message: 'Customer login is disabled in simplified mode.' },
        { status: 403 }
      );
    }

    const { email, password } = (await request.json()) as Partial<LoginRequest>;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const users = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email.toLowerCase()))
      .limit(1);

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await db
      .update(customers)
      .set({ lastLogin: new Date() })
      .where(eq(customers.id, user.id));

    const token = crypto.randomUUID();

    const response = NextResponse.json({
      success: true,
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    response.cookies.set(
      'customer_data',
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      }
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/customer/auth - Logout
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('customer_token');
  response.cookies.delete('customer_data');
  return response;
}

/**
 * PUT /api/customer/auth - Register new customer
 */
export async function PUT(request: NextRequest) {
  try {
    if (isSimplifiedMode()) {
      return NextResponse.json(
        { success: false, message: 'Customer registration is disabled in simplified mode.' },
        { status: 403 }
      );
    }

    const { name, email, password } =
      (await request.json()) as Partial<RegisterRequest>;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const passwordHash = await hashPassword(password);

    const result = await db
      .insert(customers)
      .values({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
      })
      .returning();

    const newCustomer = result[0];

    const token = crypto.randomUUID();

    const response = NextResponse.json({
      success: true,
      message: 'Account created',
      customer: {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
      },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    response.cookies.set(
      'customer_data',
      JSON.stringify({
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      }
    );

    return response;
  } catch (error: unknown) {
    console.error('Registration error:', error);

    if (
      error instanceof Error &&
      error.message?.includes('UNIQUE')
    ) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
