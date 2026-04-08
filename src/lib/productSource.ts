/**
 * Product Source Integration Layer
 * 
 * Unified product interface that abstracts the data source.
 * Merges local collections with admin-managed products.
 */

import { collections, type Collection } from './collections';
import { getAdminProducts, type AdminProduct } from '@/hooks/useAdminProducts';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  sizes: string[];
  source?: 'local' | 'admin';
  adminMetadata?: Record<string, unknown>;
}

const collectionToProduct = (col: Collection): Product => ({
  id: col.id,
  name: col.name,
  description: col.description,
  image: col.image,
  category: col.category,
  sizes: col.sizes,
  source: 'local',
});

const adminToProduct = (ap: AdminProduct): Product => ({
  id: ap.id,
  name: ap.name,
  description: ap.description,
  image: ap.images[ap.coverIndex] || '',
  category: ap.category,
  sizes: ap.sizes,
  source: 'admin',
});

/** Get all available products from all sources */
export const getProducts = (): Product[] => [
  ...collections.map(collectionToProduct),
  ...getAdminProducts().map(adminToProduct),
];

/** Get a product by ID */
export const getProductById = (id: string): Product | undefined =>
  getProducts().find((p) => p.id === id);
