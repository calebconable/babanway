'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { X } from 'lucide-react';

type StoreImage = {
  src: string;
  label: string;
};

type StoreImageModalProps = {
  image: StoreImage | null;
  onClose: () => void;
};

export function StoreImageModal({ image, onClose }: StoreImageModalProps) {
  useEffect(() => {
    if (!image) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [image, onClose]);

  if (!image) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Close image preview"
      />
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative aspect-[4/3] bg-neutral-900">
          <Image
            src={image.src}
            alt={image.label}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 960px, 90vw"
          />
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-400">Store view</p>
            <p className="text-sm font-medium text-neutral-900">{image.label}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-200 p-2 text-neutral-500 transition-colors hover:text-neutral-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
