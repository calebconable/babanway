'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { getProducts } from '@/lib/actions/products';
import type { Product } from '@/lib/db/schema';

interface HeaderSearchBarProps {
  placeholder?: string;
}

export function HeaderSearchBar({
  placeholder = 'Search products...',
}: HeaderSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await getProducts({ search: query, limit: 6 });
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/products?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
        inputRef.current?.blur();
      } else {
        router.push('/products');
      }
    },
    [query, router]
  );

  const handleSuggestionClick = useCallback(
    (product: Product) => {
      router.push(`/products/item/${product.id}`);
      setQuery('');
      setIsOpen(false);
    },
    [router]
  );

  const handleSearchAllClick = useCallback(() => {
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  }, [query, router]);

  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  const handleFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  }, [suggestions.length]);

  return (
    <div className="px-4 py-3 bg-white border-b border-neutral-100">
      <div ref={containerRef} className="relative max-w-2xl mx-auto">
        {/* Search form */}
        <form onSubmit={handleSearch} role="search">
          <div className="flex items-center bg-neutral-100 rounded-full">
            {/* Search button */}
            <button
              type="submit"
              className="flex-shrink-0 flex items-center justify-center w-11 h-11 bg-emerald-700 hover:bg-emerald-800 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-white" />
            </button>

            {/* Input */}
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              placeholder={placeholder}
              maxLength={250}
              autoComplete="off"
              aria-label={placeholder}
              className="
                flex-1 py-2.5 px-3 bg-transparent
                text-sm text-neutral-900 placeholder:text-neutral-500
                focus:outline-none
                [&::-webkit-search-cancel-button]:hidden
                [&::-webkit-search-decoration]:hidden
              "
            />

            {/* Clear button - gray X */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="flex-shrink-0 mr-2 p-1.5 rounded-full hover:bg-neutral-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            )}
          </div>
        </form>

        {/* Suggestions dropdown */}
        {isOpen && (
          <div
            id="search-suggestions"
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-neutral-500">
                Searching...
              </div>
            ) : (
              <>
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors flex items-center gap-3 border-b border-neutral-100 last:border-b-0"
                  >
                    {/* Product image or placeholder */}
                    <div className="relative w-10 h-10 bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Search className="w-4 h-4 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {product.price.toLocaleString()} IQD
                      </p>
                    </div>
                  </button>
                ))}

                {/* Search all results link */}
                <button
                  type="button"
                  onClick={handleSearchAllClick}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search all for &ldquo;{query}&rdquo;
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
