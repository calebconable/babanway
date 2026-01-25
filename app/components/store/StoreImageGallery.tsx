'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { StoreImageModal } from '@/app/components/store/StoreImageModal';

type StoreImage = {
  src: string;
  label: string;
};

type StoreImageGalleryProps = {
  images: StoreImage[];
};

export function StoreImageGallery({ images }: StoreImageGalleryProps) {
  const [activeImage, setActiveImage] = useState<StoreImage | null>(null);
  const closeModal = useCallback(() => setActiveImage(null), []);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveImage(image)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60"
            aria-label={`View ${image.label} photo`}
          >
            <Image
              src={image.src}
              alt={image.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 text-sm font-medium text-white">
              {image.label}
            </span>
          </button>
        ))}
      </div>

      <StoreImageModal image={activeImage} onClose={closeModal} />
    </>
  );
}
