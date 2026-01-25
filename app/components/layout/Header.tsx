'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Milk, Apple, Package, Wheat, Coffee, Cookie, Snowflake, Home, User, Loader2 } from 'lucide-react';
import { HeaderSearchBar } from './HeaderSearchBar';
import { GoogleTranslate } from './GoogleTranslate';
import { useCustomerAuth } from '@/app/components/auth/CustomerAuthProvider';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

const categories = [
  { name: 'Dairy', slug: 'dairy', icon: Milk },
  { name: 'Produce', slug: 'produce', icon: Apple },
  { name: 'Canned', slug: 'canned', icon: Package },
  { name: 'Rice & Grains', slug: 'grains', icon: Wheat },
  { name: 'Beverages', slug: 'beverages', icon: Coffee },
  { name: 'Snacks', slug: 'snacks', icon: Cookie },
  { name: 'Frozen', slug: 'frozen', icon: Snowflake },
  { name: 'Household', slug: 'household', icon: Home },
];

export function Header() {
  const { customer, isLoading: authLoading, login, register, logout } = useCustomerAuth();
  const simplified = useSimplified();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountMode, setAccountMode] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const closeAccountModal = () => {
    setIsAccountOpen(false);
    setAccountMode('login');
    setFormData({ name: '', email: '', password: '' });
    setError(null);
  };

  const handleAccountSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (accountMode === 'register') {
        const result = await register(
          formData.name.trim(),
          formData.email.trim(),
          formData.password
        );
        if (!result.success) {
          setError(result.message || 'Registration failed');
          return;
        }
      } else {
        const result = await login(formData.email.trim(), formData.password);
        if (!result.success) {
          setError(result.message || 'Login failed');
          return;
        }
      }
      closeAccountModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    closeAccountModal();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      {/* Top bar */}
      <div className="bg-emerald-700 text-white text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-1.5 flex items-center justify-between sm:grid sm:grid-cols-[1fr_auto_1fr]">
          <div className="hidden sm:block" />
          <div className="text-left sm:text-center">Open Daily: 9 AM - 12 AM | Biban, Nineveh</div>
          <div className="sm:justify-self-end">
            <GoogleTranslate />
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex sm:hidden flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-emerald-700">
                BEBAN WAY
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                Market
              </span>
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-tight text-emerald-700">
                Beban Way
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                Market
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Home
            </Link>

            {/* Categories dropdown */}
            {!simplified && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCategoriesOpen(!isCategoriesOpen);
                    setIsAccountOpen(false);
                  }}
                  onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 150)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                    <Link
                      href="/products"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      All Products
                    </Link>
                    <div className="h-px bg-neutral-100 my-1" />
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products/${category.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <category.icon className="w-4 h-4 text-neutral-400" />
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              All Products
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 p-2.5 text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              onClick={() => {
                if (simplified) {
                  return;
                }
                setIsAccountOpen(true);
                setIsCategoriesOpen(false);
              }}
              aria-label="Account"
              aria-disabled={simplified}
              title={simplified ? 'Accounts are disabled in simplified mode.' : undefined}
            >
              <User className="w-5 h-5" />
              {!authLoading && customer && (
                <span className="hidden sm:inline text-sm font-medium text-neutral-600">
                  {customer.name}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2.5 text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsAccountOpen(false);
              }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <HeaderSearchBar placeholder="Search products..." />

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-white">
          <nav className="px-4 py-4">
            <Link
              href="/"
              className="block py-3 px-3 text-neutral-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block py-3 px-3 text-neutral-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>

            {/* Category links */}
            {!simplified && (
              <div className="mt-2 pt-2 border-t border-neutral-100">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products/${category.slug}`}
                      className="flex items-center gap-2 py-2.5 px-3 text-sm text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      )}

      {isAccountOpen && !simplified && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeAccountModal}
            aria-label="Close login modal"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Account
                </p>
                <h2 className="text-lg font-semibold text-neutral-900 mt-1">
                  {customer ? `Welcome, ${customer.name}` : 'Sign in or create an account'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeAccountModal}
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!customer ? (
              <>
                <div className="mt-6 flex gap-2 rounded-full bg-neutral-100 p-1 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMode('login');
                      setFormData((prev) => ({ ...prev, name: '' }));
                      setError(null);
                    }}
                    className={`flex-1 rounded-full py-2 font-medium transition-colors ${
                      accountMode === 'login'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMode('register');
                      setError(null);
                    }}
                    className={`flex-1 rounded-full py-2 font-medium transition-colors ${
                      accountMode === 'register'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    Create account
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleAccountSubmit} className="mt-6 space-y-4">
                  {accountMode === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                        placeholder="Your name"
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-400 transition-all disabled:opacity-50"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                      placeholder="you@example.com"
                      required
                      disabled={isSubmitting}
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-400 transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                      placeholder="••••••••"
                      required
                      disabled={isSubmitting}
                      minLength={6}
                      autoComplete={accountMode === 'register' ? 'new-password' : 'current-password'}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-400 transition-all disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-emerald-700 text-white py-3 font-semibold hover:bg-emerald-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {accountMode === 'register' ? 'Create account' : 'Sign in'}
                  </button>
                </form>
              </>
            ) : (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-neutral-600">
                  You are signed in as <span className="font-medium">{customer.email}</span>
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-full border border-neutral-200 py-3 text-sm font-semibold text-neutral-700 hover:border-neutral-300 hover:text-neutral-900 transition-colors"
                >
                  Log out
                </button>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/login"
                  className="text-neutral-600 hover:text-emerald-700 transition-colors"
                >
                  Admin login
                </Link>
                <span className="text-neutral-300">|</span>
                <Link
                  href="/admin/login?role=company"
                  className="hover:text-emerald-700 transition-colors"
                >
                  Login as company
                </Link>
                <span className="text-neutral-300">|</span>
                <Link
                  href="/admin/login?role=owner"
                  className="hover:text-emerald-700 transition-colors"
                >
                  Login as owner
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
