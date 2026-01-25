'use client';

import { useCallback, useState } from 'react';
import { StoreImageModal } from '@/app/components/store/StoreImageModal';

const storeImages = [
  {
    src: '/images/store/outside.webp',
    label: 'Welcome to Beban',
  },
  {
    src: '/images/store/inside-main.webp',
    label: 'Spacious Interior',
  },
  {
    src: '/images/store/inside-products.webp',
    label: 'Quality Products',
  },
  {
    src: '/images/store/drinks-section.webp',
    label: 'Refreshing Drinks',
  },
  {
    src: '/images/store/drinks-corner.webp',
    label: 'Beverage Corner',
  },
  {
    src: '/images/store/seating.webp',
    label: 'Relaxing Space',
  },
  {
    src: '/images/store/cashier.webp',
    label: 'Fast Checkout',
  },
];

export function StoreCarousel() {
  const [activeImage, setActiveImage] = useState<(typeof storeImages)[number] | null>(null);
  const closeModal = useCallback(() => setActiveImage(null), []);
  const faceCount = storeImages.length;
  const angleStep = 360 / faceCount;
  // Calculate translateZ based on number of faces for proper spacing
  const translateZ = Math.round(300 / (2 * Math.tan(Math.PI / faceCount)));

  return (
    <>
      <div className="relative mx-auto h-[280px] w-full max-w-[320px]" style={{ perspective: '1000px' }}>
        <div
          className="absolute h-full w-full animate-carousel-rotate"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {storeImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveImage(image)}
              className="absolute left-[10px] right-[10px] top-[20px] flex h-[187px] w-[300px] cursor-pointer items-center justify-center border-0 bg-transparent shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
              style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: 'inset 0 0 0 2000px rgba(0,0,0,0.4)',
                transform: `rotateY(${index * angleStep}deg) translateZ(${translateZ}px)`,
              }}
              aria-label={`View ${image.label} photo`}
            >
              <span className="px-4 text-center text-xl font-light tracking-wide text-white lg:text-2xl">
                {image.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <StoreImageModal image={activeImage} onClose={closeModal} />
    </>
  );
}
