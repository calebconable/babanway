import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Milk, Apple, Package, Wheat, Coffee, Cookie, Snowflake, Home } from 'lucide-react';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { ProductGrid, ProductGridSkeleton } from '@/app/components/products/ProductGrid';
import { StoreImageGallery } from '@/app/components/store/StoreImageGallery';
import { getProducts } from '@/lib/actions/products';
import { getCategories } from '@/lib/actions/categories';
import { isSimplifiedMode } from '@/lib/config/simplified';

const categoryIcons: Record<string, typeof Milk> = {
  dairy: Milk,
  produce: Apple,
  canned: Package,
  grains: Wheat,
  beverages: Coffee,
  snacks: Cookie,
  frozen: Snowflake,
  household: Home,
};

const storeImages = [
  { src: '/images/store/outside.webp', label: 'Storefront' },
  { src: '/images/store/inside-main.webp', label: 'Interior' },
  { src: '/images/store/inside-products.webp', label: 'Products' },
  { src: '/images/store/drinks-section.webp', label: 'Drinks' },
];

async function FeaturedProducts() {
  const products = await getProducts({ limit: 8 });

  return <ProductGrid products={products} />;
}

async function CategorySection() {
  if (isSimplifiedMode()) {
    return null;
  }

  const categories = await getCategories();

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
      {categories.map((category) => {
        const IconComponent = categoryIcons[category.slug] || Package;
        return (
          <Link
            key={category.id}
            href={`/products/${category.slug}`}
            className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl bg-white border border-neutral-100 hover:border-emerald-200 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-700 text-center group-hover:text-emerald-700 transition-colors">
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const simplified = isSimplifiedMode();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />

      <main className="flex-1">
        {/* Hero Banner with 4-rice-bags */}
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero/4-rice-bags.png')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-800/70 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[400px] lg:min-h-[500px] py-12 lg:py-0">
              {/* Content */}
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-emerald-100 text-xs font-medium">
                  Your Neighborhood Market
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                  Quality Goods for{' '}
                  <span className="text-emerald-300">Your Family</span>
                </h1>
                <p className="text-base lg:text-lg text-emerald-100 max-w-lg mx-auto lg:mx-0">
                  Fresh produce, premium rice, dairy products and everyday essentials. Serving Nineveh with care since day one.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
                  >
                    Browse Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#store-info"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Visit Store
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <div className="hidden lg:flex justify-end">
                <div className="relative w-full max-w-md xl:max-w-lg aspect-square">
                  <Image
                    src="/images/hero/4-rice-bags.png"
                    alt="Premium Rice Products - Beban Way Market"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {!simplified && (
          <section className="py-10 lg:py-14 bg-white border-b border-neutral-100">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-neutral-900">
                  Shop by Category
                </h2>
                <Link
                  href="/products"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <Suspense fallback={<div className="h-32 bg-neutral-100 animate-pulse rounded-xl" />}>
                <CategorySection />
              </Suspense>
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section className="py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-neutral-900">
                  Featured Products
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Discover our selection of quality products
                </p>
              </div>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                See All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <Suspense fallback={<ProductGridSkeleton count={8} />}>
              <FeaturedProducts />
            </Suspense>

            {/* Mobile CTA */}
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
              >
                See All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Store Gallery Section */}
        <section className="py-10 lg:py-14 bg-white border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-8">
              <h2 className="text-xl lg:text-2xl font-bold text-neutral-900">
                Visit Our Store
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Take a look inside Beban Way Market
              </p>
            </div>

            {/* Image Gallery */}
            <StoreImageGallery images={storeImages} />
          </div>
        </section>

        {/* Store Info Section */}
        <section id="store-info" className="py-10 lg:py-14 bg-emerald-700">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Location</h3>
                <p className="text-emerald-100 text-sm">
                  Biban, Nineveh Governorate<br />Iraq
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Hours</h3>
                <p className="text-emerald-100 text-sm">
                  Open Daily<br />9:00 AM - 12:00 AM
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Products</h3>
                <p className="text-emerald-100 text-sm">
                  Rice, Dairy, Produce<br />Beverages & More
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
