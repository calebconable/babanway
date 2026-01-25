import Link from 'next/link';
import type { Category } from '@/lib/db/schema';

interface CategoryChipsProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryChips({ categories, activeSlug }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {/* All Products chip */}
      <Link
        href="/products"
        className={`px-4 py-2 text-sm transition-colors ${
          !activeSlug
            ? 'text-neutral-900 border-b border-neutral-900'
            : 'text-neutral-400 hover:text-neutral-900'
        }`}
      >
        All
      </Link>

      {/* Category chips */}
      {categories.map((category) => {
        const isActive = activeSlug === category.slug;

        return (
          <Link
            key={category.id}
            href={`/products/${category.slug}`}
            className={`px-4 py-2 text-sm transition-colors ${
              isActive
                ? 'text-neutral-900 border-b border-neutral-900'
                : 'text-neutral-400 hover:text-neutral-900'
            }`}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Horizontal scrollable category chips for mobile
 */
export function CategoryChipsScrollable({
  categories,
  activeSlug,
}: CategoryChipsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12">
      <div className="flex gap-1 min-w-max border-b border-neutral-100">
        {/* All Products chip */}
        <Link
          href="/products"
          className={`px-4 py-3 text-sm transition-colors relative ${
            !activeSlug
              ? 'text-neutral-900'
              : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          All
          {!activeSlug && (
            <span className="absolute bottom-0 left-4 right-4 h-px bg-neutral-900" />
          )}
        </Link>

        {categories.map((category) => {
          const isActive = activeSlug === category.slug;

          return (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className={`px-4 py-3 text-sm transition-colors relative ${
                isActive
                  ? 'text-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {category.name}
              {isActive && (
                <span className="absolute bottom-0 left-4 right-4 h-px bg-neutral-900" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
