'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, Package, CheckCircle, XCircle, Loader2 } from 'lucide-react';
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

export default function AdminOrderScanPage() {
  const simplified = useSimplified();
  const [isScanning, setIsScanning] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [scannerInstance, setScannerInstance] = useState<unknown>(null);

  const fetchOrder = useCallback(async (referenceCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${referenceCode}`);
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
  }, []);

  const stopScanning = useCallback(async () => {
    if (scannerInstance) {
      try {
        await (scannerInstance as { clear: () => Promise<void> }).clear();
      } catch {
        // Ignore cleanup errors
      }
      setScannerInstance(null);
    }
    setIsScanning(false);
  }, [scannerInstance]);

  const startScanning = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setOrder(null);
    setIsScanning(true);

    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false
      );

      scanner.render(
        async (decodedText: string) => {
          await scanner.clear();
          setScannerInstance(null);
          setIsScanning(false);
          await fetchOrder(decodedText);
        },
        () => {
          // QR code parse error - ignore
        }
      );

      setScannerInstance(scanner);
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Failed to start scanner. Please check camera permissions.');
      setIsScanning(false);
    }
  }, [fetchOrder]);

  useEffect(() => {
    return () => {
      if (scannerInstance) {
        (scannerInstance as { clear: () => Promise<void> }).clear().catch(() => {});
      }
    };
  }, [scannerInstance]);

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

  const scanAgain = () => {
    setOrder(null);
    setError(null);
    setSuccess(null);
    startScanning();
  };

  if (simplified) {
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-amber-700">
        Order scanning is disabled while simplified mode is enabled.
      </div>
    );
  }

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
            Scan Order QR Code
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Scan a customer&apos;s QR code to view and process their order
          </p>
        </div>
      </div>

      {!isScanning && !order && !isLoading && !error && (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">
            <Camera className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="mt-4 font-medium text-neutral-900">Ready to Scan</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Click the button below to start scanning QR codes
          </p>
          <Button className="mt-6" onClick={startScanning}>
            Start Scanner
          </Button>
        </div>
      )}

      {isScanning && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-neutral-900">Scanning...</h2>
            <Button variant="ghost" onClick={stopScanning}>
              Cancel
            </Button>
          </div>
          <div
            id="qr-reader"
            className="rounded-lg overflow-hidden [&_video]:!w-full [&_video]:!rounded-lg [&>div]:!border-none"
          />
        </div>
      )}

      {isLoading && (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto text-neutral-400 animate-spin" />
          <p className="mt-4 text-sm text-neutral-500">Loading order...</p>
        </div>
      )}

      {error && !isScanning && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-red-600">{error}</p>
          <Button variant="ghost" className="mt-2" onClick={scanAgain}>
            Try Again
          </Button>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-600">
          {success}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold text-neutral-900">
                  {order.referenceCode}
                </span>
                {order.status === 'pending' && (
                  <Badge variant="warning">Pending Payment</Badge>
                )}
                {order.status === 'completed' && (
                  <Badge variant="success">Completed</Badge>
                )}
                {order.status === 'cancelled' && (
                  <Badge variant="danger">Cancelled</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                {order.customer.name} &middot; {order.customer.email}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-700">
                {formatPriceSimple(order.totalPrice)}
              </p>
              <p className="text-xs text-neutral-400">Total Amount</p>
            </div>
          </div>

          <div className="px-6 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
              Order Items
            </p>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <Package className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatPriceSimple(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">
                      x{item.quantity}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {formatPriceSimple(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.status === 'pending' && (
            <div className="px-6 py-4 border-t border-neutral-100 flex gap-3">
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
                Cancel
              </Button>
            </div>
          )}

          <div className="px-6 py-4 border-t border-neutral-100">
            <Button variant="secondary" onClick={scanAgain}>
              Scan Another Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
