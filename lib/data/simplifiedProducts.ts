import type { Product } from '@/lib/db/schema';
import rawProducts from '@/config/simplified-products.json';

type SimplifiedProductRecord = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stockQuantity?: number;
  imageUrl?: string | null;
  sku?: string | null;
};

const baseTimestamp = Date.now();

export const simplifiedProducts: Product[] = (rawProducts as SimplifiedProductRecord[]).map(
  (product, index) => {
    const createdAt = new Date(baseTimestamp - index * 1000);
    return {
      id: product.id,
      name: product.name,
      description: product.description ?? null,
      categoryId: null,
      price: product.price,
      stockQuantity: product.stockQuantity ?? 0,
      imageUrl: product.imageUrl ?? null,
      sku: product.sku ?? null,
      isActive: true,
      createdAt,
      updatedAt: createdAt,
    };
  }
);
