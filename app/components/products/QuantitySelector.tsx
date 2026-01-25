'use client';

import { Minus, Plus } from 'lucide-react';
import { useCart } from '../cart/CartProvider';
import type { Product } from '@/lib/db/schema';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

interface QuantitySelectorProps {
  product: Product;
}

export function QuantitySelector({ product }: QuantitySelectorProps) {
  const { items, addItem, incrementItem, decrementItem } = useCart();
  const simplified = useSimplified();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const isInStock = product.stockQuantity > 0;

  if (simplified) {
    return null;
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    } else {
      incrementItem(product.id);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 0) {
      decrementItem(product.id);
    }
  };

  if (!isInStock) {
    return (
      <div className="flex items-center justify-center h-10 bg-neutral-100 rounded-full text-neutral-500 text-sm">
        Out of Stock
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between h-10 rounded-full ${
        quantity > 0
          ? 'bg-emerald-600'
          : 'bg-neutral-100'
      }`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity === 0}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
          quantity > 0
            ? 'text-white hover:bg-emerald-700'
            : 'text-neutral-400 cursor-not-allowed'
        }`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="flex-1 text-center">
        <span
          className={`text-sm font-medium ${
            quantity > 0 ? 'text-white' : 'text-neutral-600'
          }`}
        >
          {quantity} st
        </span>
      </div>

      <button
        type="button"
        onClick={handleIncrement}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
          quantity > 0
            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        }`}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
