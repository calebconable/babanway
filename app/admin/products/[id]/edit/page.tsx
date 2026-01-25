'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/lib/actions/products';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);
  const simplified = useSimplified();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    stockQuantity: '',
    sku: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProductById(productId);
        if (product) {
          setFormData({
            name: product.name,
            description: product.description || '',
            categoryId: product.categoryId?.toString() || '',
            price: product.price.toString(),
            stockQuantity: product.stockQuantity.toString(),
            sku: product.sku || '',
            imageUrl: product.imageUrl || '',
            isActive: product.isActive ?? true,
          });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setIsFetching(false);
      }
    }

    loadProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (simplified) {
      setError('Simplified mode is enabled. Products are read-only.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await updateProduct(productId, {
        name: formData.name,
        description: formData.description || null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        sku: formData.sku || null,
        imageUrl: formData.imageUrl || null,
        isActive: formData.isActive,
      });

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (simplified) {
      setError('Simplified mode is enabled. Products are read-only.');
      setShowDeleteConfirm(false);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all";
  const labelStyles = "block text-sm font-medium text-neutral-700 mb-2";
  const isDisabled = simplified || isLoading || isFetching || isDeleting;

  if (isFetching) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 bg-neutral-100 rounded-lg animate-pulse" />
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-8">
          <div className="space-y-6">
            <div className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
            <div className="h-24 bg-neutral-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Edit Product</h1>
            <p className="text-neutral-500 mt-1">{formData.name}</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (simplified) {
              setError('Simplified mode is enabled. Products are read-only.');
              return;
            }
            setShowDeleteConfirm(true);
          }}
          className="p-2.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-disabled={simplified}
          title={simplified ? 'Read-only in simplified mode.' : undefined}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-neutral-200/60 w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">
              Delete Product?
            </h2>
            <p className="text-neutral-500 mb-6">
              Are you sure you want to delete &quot;{formData.name}&quot;? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="flex-1"
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

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
                rows={3}
                disabled={isDisabled}
                className={`${inputStyles} resize-none`}
              />
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

          {/* Status */}
          <div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">Status</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                disabled={isDisabled}
                className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900/20"
              />
              <span className="text-sm text-neutral-700">
                Product is active and visible to customers
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={simplified}
            >
              Save Changes
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
