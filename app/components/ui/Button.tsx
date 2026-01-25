'use client';

import Link from 'next/link';
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type Ref,
} from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type CommonButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
};

type AnchorButtonProps = CommonButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
  };

type NativeButtonProps = CommonButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = AnchorButtonProps | NativeButtonProps;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      ...rest
    } = props;

    const baseStyles =
      'inline-flex items-center justify-center rounded-full font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-400',
      secondary:
        'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 focus:ring-neutral-400',
      ghost:
        'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-400',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const content = isLoading ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading...
      </>
    ) : (
      children
    );

    if ('href' in rest) {
      const { href, onClick, disabled, ...linkProps } = rest;
      const isDisabled = disabled || isLoading;
      const linkDisabledStyles = isDisabled
        ? 'opacity-50 cursor-not-allowed pointer-events-none'
        : '';
      const classes = cn(
        baseStyles,
        variants[variant],
        sizes[size],
        linkDisabledStyles,
        className
      );
      const handleClick: MouseEventHandler<HTMLAnchorElement> | undefined =
        isDisabled ? (event) => event.preventDefault() : onClick;

      return (
        <Link
          href={href}
          className={classes}
          ref={ref as Ref<HTMLAnchorElement>}
          onClick={handleClick}
          aria-disabled={isDisabled}
          {...linkProps}
        >
          {content}
        </Link>
      );
    }

    const { disabled, type, onClick, ...buttonProps } = rest;
    const isDisabled = disabled || isLoading;
    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={classes}
        disabled={isDisabled}
        onClick={onClick}
        type={type ?? 'button'}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
