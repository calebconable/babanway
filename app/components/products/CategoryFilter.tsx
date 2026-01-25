'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/db/schema';

interface CategoryFilterProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get active category name for display
  const activeCategory = activeSlug
    ? categories.find((c) => c.slug === activeSlug)?.name
    : 'All';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span>Filter</span>
        {activeSlug && (
          <span className="px-2 py-0.5 text-xs bg-neutral-100 rounded-full">
            {activeCategory}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Categories
            </p>

            {/* All Products option */}
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                !activeSlug
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              All Products
              {!activeSlug && (
                <svg className="w-4 h-4 mr-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Link>

            {/* Category options */}
            {categories.map((category) => {
              const isActive = activeSlug === category.slug;

              return (
                <Link
                  key={category.id}
                  href={`/products/${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {category.name}
                  {isActive && (
                    <svg className="w-4 h-4 mr-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
