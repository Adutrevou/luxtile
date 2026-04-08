/**
 * Product Source Integration Layer
 * 
 * Unified product interface that abstracts the data source.
 * Now fetches from Supabase via the useProducts hook.
 * Static collections remain for backward compatibility.
 */

import { collections, type Collection } from './collections';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  sizes: string[];
  price?: number | null;
  source?: 'local' | 'admin';
  displaySection?: string[];
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

/** Get static local products (for backward compatibility) */
export const getLocalProducts = (): Product[] => collections.map(collectionToProduct);

/** Get a local product by ID */
export const getProductById = (id: string): Product | undefined =>
  getLocalProducts().find((p) => p.id === id);
