import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, adminUsers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { isSimplifiedMode } from '@/lib/config/simplified';

export const runtime = 'edge';

type LoginRequest = {
  username: string;
  password: string;
};

type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

/**
 * Hash a password using SHA-256 (Edge-compatible)
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * POST /api/admin/auth - Login
 */
export async function POST(request: NextRequest) {
  try {
    if (isSimplifiedMode()) {
      return NextResponse.json(
        { success: false, message: 'Admin login is disabled in simplified mode.' },
        { status: 403 }
      );
    }

    const { username, password } =
      (await request.json()) as Partial<LoginRequest>;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password required' },
        { status: 400 }
      );
    }

    const { env } = getRequestContext();
    const db = getDb(env.DB);

    // Find admin user
    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, user.id));

    // Generate session token
    const token = crypto.randomUUID();

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

    // Set auth cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Store username for display
    response.cookies.set('admin_user', user.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

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
 * DELETE /api/admin/auth - Logout
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  response.cookies.delete('admin_user');
  return response;
}

/**
 * PUT /api/admin/auth - Register new admin (first-time setup only)
 */
export async function PUT(request: NextRequest) {
  try {
    if (isSimplifiedMode()) {
      return NextResponse.json(
        { success: false, message: 'Admin registration is disabled in simplified mode.' },
        { status: 403 }
      );
    }

    const { username, email, password } =
      (await request.json()) as Partial<RegisterRequest>;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const { env } = getRequestContext();
    const db = getDb(env.DB);

    // Check if any admin exists (only allow registration if none exist)
    const existingAdmins = await db.select().from(adminUsers).limit(1);

    if (existingAdmins.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Admin registration is closed' },
        { status: 403 }
      );
    }

    // Hash password and create admin
    const passwordHash = await hashPassword(password);

    const result = await db
      .insert(adminUsers)
      .values({
        username,
        email,
        passwordHash,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Admin account created',
      user: {
        id: result[0].id,
        username: result[0].username,
        email: result[0].email,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle unique constraint errors
    if (error.message?.includes('UNIQUE')) {
      return NextResponse.json(
        { success: false, message: 'Username or email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
