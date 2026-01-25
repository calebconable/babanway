import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { StoreCarousel } from '@/app/components/store/StoreCarousel';

export const runtime = 'edge';

export const metadata = {
  title: 'Store Info',
  description:
    'Visit Beban Way Market in Nineveh, Iraq. Open daily from 9 AM to 12 AM.',
};

export default function StorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero section - Minimal */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-3xl lg:text-4xl font-light text-neutral-900 mb-4 tracking-tight">
              Visit Our Store
            </h1>
            <p className="text-neutral-500 text-base max-w-lg mx-auto">
              Your neighborhood supermarket for quality products and friendly
              service.
            </p>
          </div>
        </section>

        {/* Store Images - Carousel */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <StoreCarousel />
          </div>
        </section>

        {/* Store Info - Minimal grid layout */}
        <section className="py-16 lg:py-24 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              {/* Location */}
              <div>
                <h2 className="text-xs uppercase tracking-wider text-neutral-400 mb-4">
                  Location
                </h2>
                <p className="text-neutral-900 mb-2">
                  Biban, Nineveh Governorate, Iraq
                </p>
                <p className="text-sm text-neutral-500">
                  P43X+C4R
                </p>
              </div>

              {/* Hours */}
              <div>
                <h2 className="text-xs uppercase tracking-wider text-neutral-400 mb-4">
                  Hours
                </h2>
                <p className="text-neutral-900 mb-2">
                  Monday - Sunday
                </p>
                <p className="text-sm text-neutral-500">
                  9:00 AM - 12:00 AM
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-xs uppercase tracking-wider text-neutral-400 mb-4">
                  What We Offer
                </h2>
                <ul className="space-y-1 text-sm text-neutral-600">
                  <li>Fresh produce & dairy</li>
                  <li>Premium rice & grains</li>
                  <li>Beverages</li>
                  <li>Household essentials</li>
                  <li>Snacks & frozen foods</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 pt-16 border-t border-neutral-100">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
