'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { createProduct } from '@/lib/actions/products';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

export default function NewProductPage() {
  const router = useRouter();
  const simplified = useSimplified();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    stockQuantity: '',
    sku: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (simplified) {
      setError('Simplified mode is enabled. Products are read-only.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createProduct({
        name: formData.name,
        description: formData.description || null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        sku: formData.sku || null,
        imageUrl: formData.imageUrl || null,
        isActive: true,
      });

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all";
  const labelStyles = "block text-sm font-medium text-neutral-700 mb-2";
  const isDisabled = simplified || isLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">New Product</h1>
          <p className="text-neutral-500 mt-1">Add a new product to your inventory</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}
        {simplified && !error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-sm">
            Simplified mode is enabled. Product changes are disabled.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Premium Basmati Rice"
                  disabled={isDisabled}
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g., RICE-001"
                  disabled={isDisabled}
                  className={inputStyles}
                />
                <p className="text-xs text-neutral-400 mt-1.5">Optional unique identifier</p>
              </div>
            </div>

            <div className="mt-6">
              <label className={labelStyles}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product..."
                rows={3}
                disabled={isDisabled}
                className={`${inputStyles} resize-none`}
              />
              <p className="text-xs text-neutral-400 mt-1.5">Optional product description</p>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">Pricing & Inventory</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className={labelStyles}>Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  disabled={isDisabled}
                  className={inputStyles}
                >
                  <option value="">Select category...</option>
                  <option value="1">Dairy</option>
                  <option value="2">Produce</option>
                  <option value="3">Canned Goods</option>
                  <option value="4">Rice & Grains</option>
                  <option value="5">Beverages</option>
                  <option value="6">Snacks</option>
                  <option value="7">Frozen</option>
                  <option value="8">Household</option>
                </select>
              </div>

              <div>
                <label className={labelStyles}>Price (IQD)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="100"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  placeholder="e.g., 25000"
                  disabled={isDisabled}
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="e.g., 100"
                  disabled={isDisabled}
                  className={inputStyles}
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">Media</h2>
            <div>
              <label className={labelStyles}>Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                disabled={isDisabled}
                className={inputStyles}
              />
              <p className="text-xs text-neutral-400 mt-1.5">Optional - enter a URL for the product image</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={simplified}
            >
              Create Product
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
