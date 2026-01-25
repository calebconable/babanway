'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { formatPriceSimple } from '@/lib/utils/formatPrice';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

type OrderItem = {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
};

type OrderDetails = {
  id: number;
  referenceCode: string;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const simplified = useSimplified();
  const router = useRouter();
  const [reference, setReference] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setReference(p.reference));
  }, [params]);

  useEffect(() => {
    if (!reference) return;

    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/orders/${reference}`);
        const data = (await response.json()) as {
          success: boolean;
          message?: string;
          order?: OrderDetails;
        };

        if (!data.success) {
          setError(data.message || 'Order not found');
          return;
        }

        if (data.order) {
          setOrder(data.order);
        }
      } catch {
        setError('Failed to fetch order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [reference]);

  const handleComplete = async () => {
    if (!order) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.referenceCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      const data = (await response.json()) as { success: boolean; message?: string };

      if (!data.success) {
        setError(data.message || 'Failed to complete order');
        return;
      }

      setOrder({ ...order, status: 'completed' });
      setSuccess('Order marked as completed!');
    } catch {
      setError('Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.referenceCode}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const data = (await response.json()) as { success: boolean; message?: string };

      if (!data.success) {
        setError(data.message || 'Failed to cancel order');
        return;
      }

      setOrder({ ...order, status: 'cancelled' });
      setSuccess('Order cancelled');
    } catch {
      setError('Failed to cancel order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (simplified) {
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-amber-700">
        Order management is disabled while simplified mode is enabled.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Order Details
          </h1>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => router.push('/admin/orders')}
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Order Details
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            View and manage order {order.referenceCode}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-600">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl font-bold text-neutral-900">
                  {order.referenceCode}
                </span>
                {order.status === 'pending' && (
                  <Badge variant="warning" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending Payment
                  </Badge>
                )}
                {order.status === 'completed' && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </Badge>
                )}
                {order.status === 'cancelled' && (
                  <Badge variant="danger" className="flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Cancelled
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Created: {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-700">
                {formatPriceSimple(order.totalPrice)}
              </p>
              <p className="text-xs text-neutral-400">Total Amount</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
            Customer Information
          </p>
          <p className="font-medium text-neutral-900">{order.customer.name}</p>
          <p className="text-sm text-neutral-500">{order.customer.email}</p>
        </div>

        <div className="px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">
            Order Items ({order.items.length})
          </p>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    <p className="text-sm text-neutral-500">
                      {formatPriceSimple(item.unitPrice)} per unit
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900">
                    {formatPriceSimple(item.unitPrice * item.quantity)}
                  </p>
                  <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.status === 'pending' && (
          <div className="px-6 py-5 border-t border-neutral-100 bg-amber-50/50">
            <p className="text-sm text-amber-800 mb-4">
              This order is awaiting payment. Mark it as paid once the customer has completed their purchase.
            </p>
            <div className="flex gap-3">
              <Button
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleComplete}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Mark as Paid
              </Button>
              <Button
                variant="danger"
                className="flex items-center justify-center gap-2"
                onClick={handleCancel}
                disabled={isProcessing}
              >
                <XCircle className="w-4 h-4" />
                Cancel Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
