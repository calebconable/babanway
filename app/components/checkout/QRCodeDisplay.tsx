'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Check, Package } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { formatPriceSimple } from '@/lib/utils/formatPrice';

type OrderItem = {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
};

type QRCodeDisplayProps = {
  referenceCode: string;
  totalPrice: number;
  items: OrderItem[];
  onClose: () => void;
};

export function QRCodeDisplay({
  referenceCode,
  totalPrice,
  items,
  onClose,
}: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    QRCode.toDataURL(referenceCode, {
      width: 256,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setQrDataUrl(url);
        setIsGenerating(false);
      })
      .catch(() => {
        setIsGenerating(false);
      });
  }, [referenceCode]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="bg-emerald-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Order Created</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center">
            {isGenerating ? (
              <div className="w-64 h-64 flex items-center justify-center bg-neutral-100 rounded-xl">
                <div className="animate-pulse text-neutral-400">
                  Generating QR code...
                </div>
              </div>
            ) : qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR Code for order ${referenceCode}`}
                className="w-64 h-64 rounded-xl border border-neutral-200"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-neutral-100 rounded-xl">
                <span className="text-neutral-500">QR code error</span>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Order Reference
              </p>
              <p className="mt-1 text-2xl font-bold tracking-widest text-neutral-900">
                {referenceCode}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-neutral-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
              Order Summary
            </p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-700">
                      {item.name} <span className="text-neutral-400">x{item.quantity}</span>
                    </span>
                  </div>
                  <span className="text-neutral-600">
                    {formatPriceSimple(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between">
              <span className="font-medium text-neutral-900">Total</span>
              <span className="font-bold text-emerald-700">
                {formatPriceSimple(totalPrice)}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-sm text-amber-800">
              <strong>Show this QR code at the counter</strong> to complete your
              purchase. Your order will be marked as paid once scanned by staff.
            </p>
          </div>

          <Button className="mt-6 w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
