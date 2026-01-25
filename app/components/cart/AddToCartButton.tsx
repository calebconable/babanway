'use client';

import { Button } from '@/app/components/ui/Button';
import { useCart } from './CartProvider';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

type AddToCartButtonProps = {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
  disabled?: boolean;
  label?: string;
};

export function AddToCartButton({
  product,
  disabled = false,
  label,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const simplified = useSimplified();
  const buttonLabel =
    label ??
    (simplified
      ? 'Read only'
      : disabled
        ? 'Out of stock'
        : 'Add to cart');

  return (
    <Button
      className="w-full"
      disabled={disabled || simplified}
      onClick={() => addItem(product)}
    >
      {buttonLabel}
    </Button>
  );
}
