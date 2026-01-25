'use client';

import Image from 'next/image';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Minus, Plus, X, Package, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { formatPriceSimple } from '@/lib/utils/formatPrice';
import { useCustomerAuth } from '@/app/components/auth/CustomerAuthProvider';
import { QRCodeDisplay } from '@/app/components/checkout/QRCodeDisplay';
import { AuthPromptModal } from '@/app/components/checkout/AuthPromptModal';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

type OrderInfo = {
  id: number;
  referenceCode: string;
  totalPrice: number;
  items: {
    productId: number;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { customer } = useCustomerAuth();
  const simplified = useSimplified();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    if (simplified) {
      return;
    }

    setItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, [simplified]);

  const incrementItem = useCallback((id: number) => {
    if (simplified) {
      return;
    }

    setItems((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, quantity: entry.quantity + 1 }
          : entry
      )
    );
  }, [simplified]);

  const decrementItem = useCallback((id: number) => {
    if (simplified) {
      return;
    }

    setItems((prev) => {
      const entry = prev.find((item) => item.id === id);
      if (!entry) {
        return prev;
      }
      if (entry.quantity <= 1) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  }, [simplified]);

  const clearCart = useCallback(() => {
    if (simplified) {
      return;
    }

    setItems([]);
  }, [simplified]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const handleCheckout = useCallback(async () => {
    setCheckoutError(null);

    if (simplified) {
      setCheckoutError('Ordering is disabled in simplified mode.');
      return;
    }

    if (!customer) {
      setShowAuthPrompt(true);
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        order?: OrderInfo;
      };

      if (!data.success) {
        setCheckoutError(data.message || 'Checkout failed');
        return;
      }

      if (data.order) {
        setOrderInfo(data.order);
      }
      setItems([]);
    } catch {
      setCheckoutError('An error occurred during checkout');
    } finally {
      setIsCheckingOut(false);
    }
  }, [simplified, customer, items]);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthPrompt(false);
    handleCheckout();
  }, [handleCheckout]);

  const handleQRClose = useCallback(() => {
    setOrderInfo(null);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeCart, isOpen]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      incrementItem,
      decrementItem,
      clearCart,
      isOpen,
      closeCart,
    }),
    [items, addItem, incrementItem, decrementItem, clearCart, isOpen, closeCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {isOpen ? (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeCart}
            aria-hidden="true"
          />
          <aside
            className="absolute right-0 top-0 flex h-[100dvh] w-full max-w-md flex-col bg-white shadow-2xl"
            data-testid="cart-preview"
            role="complementary"
            aria-label="Cart"
          >
            <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-neutral-900">Cart</h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <Package className="h-10 w-10 text-neutral-300" />
                  <p className="text-sm text-neutral-500">Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b border-neutral-100 pb-4"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-neutral-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {formatPriceSimple(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-neutral-200 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => decrementItem(item.id)}
                        className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100"
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[1.25rem] text-center text-sm text-neutral-700">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementItem(item.id)}
                        className="rounded-full bg-neutral-900 p-1 text-white hover:bg-neutral-800"
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-neutral-200 px-6 py-5">
              {checkoutError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                  {checkoutError}
                </div>
              )}
              {simplified && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-700">
                  Ordering is disabled in simplified mode.
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span>Total</span>
                <span className="text-base font-semibold text-neutral-900">
                  {formatPriceSimple(total)}
                </span>
              </div>
              <Button
                className="mt-4 w-full flex items-center justify-center gap-2"
                disabled={items.length === 0 || isCheckingOut || simplified}
                onClick={handleCheckout}
              >
                {isCheckingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                Checkout
              </Button>
              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full text-sm text-neutral-500 transition hover:text-neutral-700"
              >
                Empty cart
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {showAuthPrompt && !simplified && (
        <AuthPromptModal
          onClose={() => setShowAuthPrompt(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {orderInfo && (
        <QRCodeDisplay
          referenceCode={orderInfo.referenceCode}
          totalPrice={orderInfo.totalPrice}
          items={orderInfo.items}
          onClose={handleQRClose}
        />
      )}
    </CartContext.Provider>
  );
}
