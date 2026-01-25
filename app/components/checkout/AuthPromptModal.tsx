'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCustomerAuth } from '@/app/components/auth/CustomerAuthProvider';

type AuthPromptModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export function AuthPromptModal({ onClose, onSuccess }: AuthPromptModalProps) {
  const { login, register } = useCustomerAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
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
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Checkout
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 mt-1">
              Sign in to continue
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-2 text-sm text-neutral-600">
          Please sign in or create an account to complete your order.
        </p>

        <div className="mt-6 flex gap-2 rounded-full bg-neutral-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 rounded-full py-2 font-medium transition-colors ${
              mode === 'login'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 rounded-full py-2 font-medium transition-colors ${
              mode === 'register'
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              minLength={6}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-400 transition-all disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-emerald-700 text-white py-3 font-semibold hover:bg-emerald-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'register' ? 'Create account & Checkout' : 'Sign in & Checkout'}
          </button>
        </form>
      </div>
    </div>
  );
}
