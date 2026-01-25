'use client';

import { useState } from 'react';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import type { Product } from '@/lib/db/schema';

interface ProductGridProps {
  products: Product[];
  showStock?: boolean;
  initialDisplayCount?: number;
  loadMoreCount?: number;
}

export function ProductGrid({
  products,
  showStock = false,
  initialDisplayCount = 8,
  loadMoreCount = 8,
}: ProductGridProps) {
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-neutral-400 text-sm">No products found</p>
      </div>
    );
  }

  const visibleProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;
  const progressPercent = Math.min((displayCount / products.length) * 100, 100);

  const handleShowMore = () => {
    setDisplayCount((prev) => Math.min(prev + loadMoreCount, products.length));
  };

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showStock={showStock}
          />
        ))}
      </div>

      {/* Show More Section */}
      {products.length > initialDisplayCount && (
        <div className="mt-12 flex flex-col items-center">
          {/* Progress Info */}
          <p className="text-sm text-neutral-600 mb-3">
            Showing {visibleProducts.length} of {products.length}
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-xs h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Show More Button */}
          {hasMore && (
            <button
              type="button"
              onClick={handleShowMore}
              className="px-8 py-3 text-sm font-medium text-neutral-900 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
            >
              Show More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Loading skeleton grid
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
