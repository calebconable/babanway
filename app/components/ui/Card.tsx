import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'browser' | 'product';
  hover?: boolean;
}

export function Card({
  className,
  variant = 'default',
  hover = false,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white rounded-xl border border-neutral-200',
    browser: 'bg-white rounded-xl border border-neutral-200',
    product: 'bg-white rounded-xl border border-neutral-100 overflow-hidden',
  };

  const hoverStyles = hover
    ? 'transition-all duration-150 hover:border-neutral-300 hover:shadow-card-hover'
    : '';

  return (
    <div className={cn(variants[variant], hoverStyles, className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pb-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
