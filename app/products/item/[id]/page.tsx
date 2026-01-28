import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, ShoppingBag } from 'lucide-react';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { AddToCartButton } from '@/app/components/cart';
import { StockBadge } from '@/app/components/ui/Badge';
import { getProductById } from '@/lib/actions/products';
import { formatPrice } from '@/lib/utils/formatPrice';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return { title: 'Product Not Found' };
  }

  const product = await getProductById(productId);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} available at Beban Way Market.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  const isInStock = product.stockQuantity > 0;
  const showPrice = Number.isFinite(product.price);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-10 lg:py-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to products
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mt-8">
            <div className="relative aspect-[4/5] bg-neutral-50 rounded-2xl overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-neutral-200" />
                </div>
              )}

              {!isInStock && (
                <div className="absolute inset-0 bg-white/70 flex items-end p-4">
                  <span className="text-xs uppercase tracking-wider text-neutral-500">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <h1 className="text-2xl lg:text-3xl font-semibold text-neutral-900">
                    {product.name}
                  </h1>
                  <StockBadge quantity={product.stockQuantity} />
                </div>
                {showPrice && (
                  <p className="text-2xl text-neutral-900">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-xs uppercase tracking-wide text-neutral-400">
                  Description
                </h2>
                <p className="text-neutral-600 leading-relaxed">
                  {product.description ||
                    'No description is available for this product yet.'}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 p-6 space-y-4 bg-neutral-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">
                    Add to cart for pickup
                  </span>
                  <ShoppingBag className="w-4 h-4 text-neutral-400" />
                </div>
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                  }}
                  disabled={!isInStock}
                />
                <p className="text-xs text-neutral-500 text-center">
                  {isInStock
                    ? 'Cart preview opens immediately after adding.'
                    : 'This item is currently out of stock.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
