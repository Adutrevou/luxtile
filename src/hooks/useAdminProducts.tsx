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

// Client-side image compression before upload
const compressImage = (file: File, maxWidth = 1600, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve) => {
    // Skip non-image or already small files
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

  // Admin fetches ALL products (including inactive)
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (error) throw error;
      return mapRow(data);
    },
    onSuccess: (newProduct) => {
      // Optimistic: add to cache immediately
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
      // Optimistic: update in cache immediately
      queryClient.setQueryData(['admin-products'], (old: AdminProduct[] | undefined) =>
        old ? old.map((p) => (p.id === updated.id ? updated : p)) : [updated]
      );
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update product'),
  });

  // Soft delete: archive instead of hard delete
  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
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

  // Parallel image upload with compression
  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
    const uploads = files.map(async (file) => {
      const compressed = await compressImage(file);
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error } = await supabase.storage.from('product_images').upload(path, compressed, {
        contentType: 'image/jpeg',
      });
      if (error) throw error;
      const { data } = supabase.storage.from('product_images').getPublicUrl(path);
      return data.publicUrl;
    });
    return Promise.all(uploads);
  }, []);

  // Keep single upload for backward compat
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const [url] = await uploadImages([file]);
    return url;
  }, [uploadImages]);

  const deleteImage = useCallback(async (url: string) => {
    const path = url.split('/product_images/')[1];
    if (path) {
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
