import { useState, useCallback } from 'react';
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

export const useAdminProducts = () => {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add product'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to delete product'),
  });

  const addProduct = useCallback((product: ProductInsert) => addMutation.mutateAsync(product), [addMutation]);
  const updateProduct = useCallback((id: string, updates: ProductUpdate) => updateMutation.mutateAsync({ id, updates }), [updateMutation]);
  const deleteProduct = useCallback((id: string) => deleteMutation.mutateAsync(id), [deleteMutation]);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await supabase.storage.from('product_images').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('product_images').getPublicUrl(path);
    return data.publicUrl;
  }, []);

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
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    deleteImage,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
