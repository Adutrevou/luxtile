/**
 * Product Source Integration Layer
 * 
 * Unified product interface that abstracts the data source.
 * Currently backed by local collections data (src/lib/collections.ts).
 * 
 * Designed to seamlessly support admin-managed products from an external
 * backend (e.g. Chariots Elite Drive admin panel) where internal teams
 * upload product images and insert detailed descriptions.
 * 
 * When a backend integration is activated, this layer will resolve products
 * from the remote source while maintaining the same interface consumed by
 * the frontend — no component changes required.
 */

import { collections, type Collection } from './collections';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  sizes: string[];
  /** Optional fields for admin-managed products */
  source?: 'local' | 'admin';
  adminMetadata?: Record<string, unknown>;
}

/** Convert a local collection entry to a unified Product */
const collectionToProduct = (col: Collection): Product => ({
  id: col.id,
  name: col.name,
  description: col.description,
  image: col.image,
  category: col.category,
  sizes: col.sizes,
  source: 'local',
});

/** Get all available products from the current source */
export const getProducts = (): Product[] => collections.map(collectionToProduct);

/** Get a product by ID */
export const getProductById = (id: string): Product | undefined =>
  getProducts().find((p) => p.id === id);
