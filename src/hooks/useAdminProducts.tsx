import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminProduct {
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

type ProductInsert = Omit<AdminProduct, 'id' | 'created_at' | 'updated_at'>;
type ProductUpdate = Partial<ProductInsert>;

const mapRow = (row: any): AdminProduct => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  category: row.category,
  tags: row.tags || [],
  sizes: row.sizes || [],
  display_section: row.display_section || [],
  images: row.images || [],
  cover_index: row.cover_index || 0,
  status: row.status,
  featured: row.featured || false,
  sort_order: row.sort_order || 0,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

/** Ensure we have a valid auth session, refreshing if needed */
const ensureSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    // Try to refresh
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError || !refreshData.session) {
      throw new Error('Your session has expired. Please sign in again.');
    }
    return refreshData.session;
  }
  return session;
};

// Client-side image compression before upload
const compressImage = (file: File, maxWidth = 1600, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.size < 100_000) {
      resolve(file);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob || file),
        'image/jpeg',
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
};

export const useAdminProducts = () => {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      await ensureSession();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
    staleTime: 0,          // Always refetch on mount — admin needs fresh data
    gcTime: 2 * 60_000,
    refetchOnWindowFocus: true,
  });

  const addMutation = useMutation({
    mutationFn: async (product: ProductInsert) => {
      await ensureSession();
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (error) throw error;
      return mapRow(data);
    },
    onSuccess: (newProduct) => {
      queryClient.setQueryData(['admin-products'], (old: AdminProduct[] | undefined) =>
        old ? [newProduct, ...old] : [newProduct]
      );
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add product'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      await ensureSession();
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return mapRow(data);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['admin-products'], (old: AdminProduct[] | undefined) =>
        old ? old.map((p) => (p.id === updated.id ? updated : p)) : [updated]
      );
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update product'),
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      await ensureSession();
      const { error } = await supabase
        .from('products')
        .update({ status: 'inactive' })
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['admin-products'], (old: AdminProduct[] | undefined) =>
        old ? old.map((p) => (p.id === id ? { ...p, status: 'inactive' } : p)) : []
      );
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product archived (hidden from site)');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to archive product'),
  });

  const addProduct = useCallback((product: ProductInsert) => addMutation.mutateAsync(product), [addMutation]);
  const updateProduct = useCallback((id: string, updates: ProductUpdate) => updateMutation.mutateAsync({ id, updates }), [updateMutation]);
  const deleteProduct = useCallback((id: string) => archiveMutation.mutateAsync(id), [archiveMutation]);

  // Parallel image upload with compression — always outputs .jpg
  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
    await ensureSession();
    const uploads = files.map(async (file) => {
      const compressed = await compressImage(file);
      // Always use .jpg since compressImage converts to JPEG
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
      const { error } = await supabase.storage.from('product_images').upload(path, compressed, {
        contentType: 'image/jpeg',
        cacheControl: '60',
        upsert: true,
      });
      if (error) throw error;
      const { data } = supabase.storage.from('product_images').getPublicUrl(path);
      // Append cache-buster so the browser always fetches the fresh version
      return `${data.publicUrl}?t=${Date.now()}`;
    });
    return Promise.all(uploads);
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const [url] = await uploadImages([file]);
    return url;
  }, [uploadImages]);

  const deleteImage = useCallback(async (url: string) => {
    const raw = url.split('/product_images/')[1];
    if (raw) {
      // Strip cache-buster query params (e.g. ?t=123456) before deleting from storage
      const path = raw.split('?')[0];
      await supabase.storage.from('product_images').remove([path]);
    }
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    uploadImages,
    deleteImage,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: archiveMutation.isPending,
  };
};
