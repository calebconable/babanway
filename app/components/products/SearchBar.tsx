'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search',
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/products');
      }
    },
    [query, router]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    router.push('/products');
  }, [router]);

  return (
    <form onSubmit={handleSearch} className={`relative max-w-md ${className}`}>
      <div className="relative">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-6 pr-8 py-2 text-sm border-b border-neutral-200 bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </form>
  );
}

/**
 * Compact search bar for header
 */
export function SearchBarCompact() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        aria-label="Open search"
      >
        <Search className="w-4 h-4" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        autoFocus
        className="w-36 px-0 py-1 text-sm border-b border-neutral-200 bg-transparent focus:outline-none focus:border-neutral-900"
      />
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          setQuery('');
        }}
        className="p-1 text-neutral-400 hover:text-neutral-900"
      >
        <X className="w-3 h-3" />
      </button>
    </form>
  );
}
