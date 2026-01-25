'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package, ListPlus } from 'lucide-react';
import { QuantitySelector } from './QuantitySelector';
import type { Product } from '@/lib/db/schema';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

interface ProductCardProps {
  product: Product;
  showStock?: boolean;
}

export function ProductCard({ product, showStock = false }: ProductCardProps) {
  const isInStock = product.stockQuantity > 0;
  const simplified = useSimplified();

  return (
    <article className="group relative flex flex-col bg-white rounded-lg border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all duration-200">
      {/* Image Section */}
      <div className="relative">
        <Link
          href={`/products/item/${product.id}`}
          className="block aspect-square overflow-hidden rounded-t-lg bg-neutral-50"
          aria-label={`View ${product.name}`}
        >
          <div className="relative w-full h-full p-4">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-16 h-16 text-neutral-200" />
              </div>
            )}
          </div>
        </Link>

        {/* Add to List Button */}
        <button
          type="button"
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Add to list"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <ListPlus className="w-5 h-5 text-neutral-700" />
        </button>

        {!simplified && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-white rounded-lg shadow-sm p-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-neutral-900">
                  {Math.round(product.price).toLocaleString('ar-IQ')}
                </span>
                <span className="text-sm text-neutral-600">IQD</span>
              </div>
            </div>
          </div>
        )}

        {/* Out of stock overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-white/70 rounded-t-lg" />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 p-3 flex flex-col">
        <Link
          href={`/products/item/${product.id}`}
          className="block"
        >
          {/* Product Name */}
          <h3 className="text-sm font-medium text-neutral-900 line-clamp-2 min-h-[2.5rem] mb-1">
            {product.name}
          </h3>

          {/* Brand/Description */}
          {product.description && (
            <p className="text-xs text-neutral-500 line-clamp-1 mb-2">
              {product.description}
            </p>
          )}
        </Link>

        {/* Stock indicator */}
        {showStock && product.stockQuantity > 0 && product.stockQuantity < 10 && (
          <div className="text-xs text-amber-600 mb-3">
            Only {product.stockQuantity} left
          </div>
        )}

        {/* Quantity Selector - Always at bottom */}
        <div className="mt-auto">
          <QuantitySelector product={product} />
        </div>
      </div>
    </article>
  );
}

/**
 * Loading skeleton for ProductCard
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-lg border border-neutral-100">
      {/* Image skeleton */}
      <div className="aspect-square bg-neutral-100 animate-pulse rounded-t-lg" />

      {/* Content skeleton */}
      <div className="p-3 space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-neutral-100 rounded w-full animate-pulse" />
          <div className="h-4 bg-neutral-100 rounded w-3/4 animate-pulse" />
        </div>
        <div className="h-3 bg-neutral-100 rounded w-1/2 animate-pulse" />
        <div className="h-10 bg-neutral-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
