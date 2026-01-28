import { Suspense } from 'react';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { ProductGrid, ProductGridSkeleton } from '@/app/components/products/ProductGrid';
import { CategoryFilter } from '@/app/components/products/CategoryFilter';
import { getProducts } from '@/lib/actions/products';
import { getCategories } from '@/lib/actions/categories';
import { isSimplifiedMode } from '@/lib/config/simplified';

export const metadata = {
  title: 'Products',
  description: 'Browse our selection of quality products at Beban Way Market.',
};

async function ProductsContent() {
  const simplified = isSimplifiedMode();
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* Filter and heading row */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          {!simplified && categories.length > 0 && (
            <CategoryFilter categories={categories} />
          )}
          <div>
            <h1 className="text-lg font-normal text-neutral-900">All Products</h1>
            <p className="text-sm text-neutral-400">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <ProductGrid products={products} />
    </>
  );
}

export default async function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12 lg:py-16">
          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            <ProductsContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
