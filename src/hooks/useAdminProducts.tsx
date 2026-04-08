import { useState, useCallback, useEffect } from 'react';

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  sizes: string[];
  images: string[]; // base64 data URLs
  coverIndex: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'luxtile_admin_products';

const loadProducts = (): AdminProduct[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveProducts = (products: AdminProduct[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const useAdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>(loadProducts);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const addProduct = useCallback((product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: AdminProduct = {
      ...product,
      id: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Omit<AdminProduct, 'id' | 'createdAt'>>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  return { products, addProduct, updateProduct, deleteProduct, getProduct };
};

/** Static accessor for productSource layer */
export const getAdminProducts = (): AdminProduct[] => loadProducts();
