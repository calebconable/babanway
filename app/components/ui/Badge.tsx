import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    outline: 'bg-transparent border border-neutral-200 text-neutral-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Stock status badge
 */
export function StockBadge({ quantity }: { quantity: number }) {
  if (quantity === 0) {
    return <Badge variant="danger">Out of Stock</Badge>;
  }
  if (quantity < 10) {
    return <Badge variant="warning">Low Stock ({quantity})</Badge>;
  }
  return <Badge variant="success">In Stock ({quantity})</Badge>;
}
