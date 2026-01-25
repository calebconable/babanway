import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { getCategories } from '@/lib/actions/categories';

export const runtime = 'edge';

export const metadata = {
  title: 'Categories | Admin',
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Categories</h1>
          <p className="text-neutral-500 mt-1">
            {categories.length} categories
          </p>
        </div>
        <Button variant="secondary" disabled className="opacity-50 cursor-not-allowed">
          <Plus className="w-4 h-4" />
          <span className="ml-2">Add Category</span>
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl border border-neutral-200/60 p-5 hover:border-neutral-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-neutral-500" />
              </div>
              <div>
                <p className="font-medium text-neutral-900">{category.name}</p>
                <p className="text-xs text-neutral-400">/{category.slug}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 p-8 text-center">
        <p className="text-neutral-500 text-sm">
          Categories are seeded automatically. Custom category management coming soon.
        </p>
      </div>
    </div>
  );
}
