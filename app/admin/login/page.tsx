'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';
  const simplified = useSimplified();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (simplified) {
      setError('Admin login is disabled in simplified mode.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = '/api/admin/auth';
      const method = mode === 'login' ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: { success: boolean; message?: string } = await response.json();

      if (data.success) {
        if (mode === 'register') {
          setSuccess('Account created! You can now log in.');
          setMode('login');
          setFormData({ ...formData, password: '' });
        } else {
          router.push(from);
          router.refresh();
        }
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all";
  const labelStyles = "block text-sm font-medium text-neutral-700 mb-2";

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/60 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-semibold text-lg">B</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          {mode === 'login'
            ? 'Sign in to your admin account'
            : 'Set up the first admin account'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm">
          {success}
        </div>
      )}

      {simplified && (
        <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-sm">
          Admin login is disabled while simplified mode is enabled.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelStyles}>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            autoComplete="username"
            disabled={simplified}
            className={inputStyles}
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className={labelStyles}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
              disabled={simplified}
              className={inputStyles}
            />
          </div>
        )}

        <div>
          <label className={labelStyles}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            disabled={simplified}
            className={inputStyles}
          />
          {mode === 'register' && (
            <p className="text-xs text-neutral-400 mt-1.5">Minimum 8 characters</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={simplified}
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            if (simplified) {
              return;
            }
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
            setSuccess('');
          }}
          className="text-neutral-500 hover:text-neutral-900 text-sm transition-colors"
          disabled={simplified}
        >
          {mode === 'login'
            ? 'Need to create the first admin account?'
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/60 p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-semibold text-lg">B</span>
        </div>
        <div className="h-6 w-32 bg-neutral-200 rounded mx-auto animate-pulse" />
        <div className="h-4 w-48 bg-neutral-100 rounded mx-auto mt-2 animate-pulse" />
      </div>
      <div className="space-y-5">
        <div>
          <div className="h-4 w-20 bg-neutral-200 rounded mb-2 animate-pulse" />
          <div className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
        </div>
        <div>
          <div className="h-4 w-20 bg-neutral-200 rounded mb-2 animate-pulse" />
          <div className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
        </div>
        <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Back to site */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </Link>

        <Suspense fallback={<LoginFormFallback />}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
