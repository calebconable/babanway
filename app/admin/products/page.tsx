import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { getProducts } from '@/lib/actions/products';
import { getCategories } from '@/lib/actions/categories';
import { formatPriceSimple } from '@/lib/utils/formatPrice';
import { isSimplifiedMode } from '@/lib/config/simplified';

export const metadata = {
  title: 'Products | Admin',
};

function StockIndicator({ quantity }: { quantity: number }) {
  if (quantity === 0) {
    return <span className="text-red-600 text-sm">Out of stock</span>;
  }
  if (quantity <= 10) {
    return <span className="text-amber-600 text-sm">{quantity} left</span>;
  }
  return <span className="text-neutral-600 text-sm">{quantity} in stock</span>;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? 'bg-green-500' : 'bg-neutral-300'
        }`}
      />
      <span className="text-sm text-neutral-600">{active ? 'Active' : 'Inactive'}</span>
    </span>
  );
}

export default async function AdminProductsPage() {
  const simplified = isSimplifiedMode();
  const [products, categories] = await Promise.all([
    getProducts({ activeOnly: false }),
    getCategories(),
  ]);

  // Create category lookup
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Products</h1>
          <p className="text-neutral-500 mt-1">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        {simplified ? (
          <Button variant="primary" className="gap-2" disabled>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        ) : (
          <Link href="/admin/products/new">
            <Button variant="primary" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-neutral-900 font-medium mb-1">No products yet</p>
            <p className="text-neutral-500 text-sm mb-6">Add your first product to get started</p>
            {simplified ? (
              <Button variant="primary" className="gap-2" disabled>
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            ) : (
              <Link href="/admin/products/new">
                <Button variant="primary" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">

                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900">
                          {product.name}
                        </p>
                        {product.sku && (
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {product.sku}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {product.categoryId
                        ? categoryMap.get(product.categoryId) || '—'
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                      {formatPriceSimple(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <StockIndicator quantity={product.stockQuantity} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusDot active={product.isActive ?? true} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {simplified ? (
                        <span className="text-sm text-neutral-400">Read only</span>
                      ) : (
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                        >
                          Edit
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
