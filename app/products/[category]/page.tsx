import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { ProductGrid, ProductGridSkeleton } from '@/app/components/products/ProductGrid';
import { CategoryFilter } from '@/app/components/products/CategoryFilter';
import { getProductsByCategory } from '@/lib/actions/products';
import { getCategories, getCategoryBySlug } from '@/lib/actions/categories';
import { isSimplifiedMode } from '@/lib/config/simplified';

export const runtime = 'edge';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  if (isSimplifiedMode()) {
    return {
      title: 'Category Not Found',
    };
  }

  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: category.name,
    description: `Browse ${category.name} products at Beban Way Market.`,
  };
}

async function CategoryContent({ categorySlug }: { categorySlug: string }) {
  if (isSimplifiedMode()) {
    notFound();
  }

  const [category, products, categories] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getProductsByCategory(categorySlug),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <>
      {/* Filter and heading row */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          <CategoryFilter categories={categories} activeSlug={categorySlug} />
          <div>
            <h1 className="text-lg font-normal text-neutral-900">{category.name}</h1>
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12 lg:py-16">
          <Suspense fallback={<ProductGridSkeleton count={12} />}>
            <CategoryContent categorySlug={categorySlug} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
