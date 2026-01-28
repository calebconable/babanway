import Link from 'next/link';
import { Package, FolderOpen, TrendingDown, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { isSimplifiedMode } from '@/lib/config/simplified';

export const metadata = {
  title: 'Dashboard | Admin',
};

export default function AdminDashboard() {
  // In a real app, these would come from the database
  const simplified = isSimplifiedMode();
  const stats = {
    totalProducts: 0,
    totalCategories: simplified ? 0 : 8,
    lowStock: 0,
    outOfStock: 0,
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 mt-1">
          Welcome back. Here&apos;s your store overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-3xl font-semibold text-neutral-900 tracking-tight">
            {stats.totalProducts}
          </p>
          <p className="text-sm text-neutral-500 mt-1">Products</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <FolderOpen className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-3xl font-semibold text-neutral-900 tracking-tight">
            {stats.totalCategories}
          </p>
          <p className="text-sm text-neutral-500 mt-1">Categories</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-semibold text-neutral-900 tracking-tight">
            {stats.lowStock}
          </p>
          <p className="text-sm text-neutral-500 mt-1">Low Stock</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-semibold text-neutral-900 tracking-tight">
            {stats.outOfStock}
          </p>
          <p className="text-sm text-neutral-500 mt-1">Out of Stock</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {simplified ? (
            <Button variant="primary" className="w-full justify-center gap-2" disabled>
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          ) : (
            <Link href="/admin/products/new">
              <Button variant="primary" className="w-full justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          )}
          <Link href="/admin/products">
            <Button variant="secondary" className="w-full justify-center">
              View Products
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="secondary" className="w-full justify-center">
              View Categories
            </Button>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 p-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">Getting Started</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
              1
            </div>
            <div className="pt-1">
              <p className="font-medium text-neutral-900">Add your first product</p>
              <p className="text-sm text-neutral-500 mt-0.5">
                Start building your inventory with product details and images
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
              2
            </div>
            <div className="pt-1">
              <p className="font-medium text-neutral-900">Organize with categories</p>
              <p className="text-sm text-neutral-500 mt-0.5">
                8 default categories are ready - customize as needed
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
              3
            </div>
            <div className="pt-1">
              <p className="font-medium text-neutral-900">Add product images</p>
              <p className="text-sm text-neutral-500 mt-0.5">
                Upload images to showcase your products beautifully
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
