import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  category: string;
  tags: string[];
  sizes: string[];
  display_section: string[];
  images: string[];
  cover_index: number;
  status: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const withAssetVersion = (rawUrl: string, version: string) => {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('v', version);
    return url.toString();
  } catch {
    const separator = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${separator}v=${encodeURIComponent(version)}`;
  }
};

const mapProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  category: row.category,
  tags: row.tags || [],
  sizes: row.sizes || [],
  display_section: row.display_section || [],
  images: (row.images || []).map((image: string) => withAssetVersion(image, row.updated_at || row.created_at || 'static')),
  cover_index: row.cover_index || 0,
  status: row.status,
  featured: row.featured || false,
  sort_order: row.sort_order || 0,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const fetchProducts = async (section?: string): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (section) {
    query = query.contains('display_section', [section]);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[useProducts] fetch failed', section, error);
    throw error;
  }
  console.log('[useProducts]', section || 'all', 'returned', data?.length, 'rows');
  return (data || []).map(mapProduct);
};

export const useProducts = (section?: string) => {
  return useQuery({
    queryKey: ['products', section || 'all'],
    queryFn: () => fetchProducts(section),
    staleTime: 0,
    gcTime: 5 * 60_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useProductsBySection = (section: string) => useProducts(section);

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('featured', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []).map(mapProduct);
    },
    staleTime: 0,
    gcTime: 5 * 60_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
