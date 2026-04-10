import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  display_section_value: string;
  description: string;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

type PartnerInsert = Omit<Partner, 'id' | 'created_at' | 'updated_at'>;
type PartnerUpdate = Partial<PartnerInsert>;

const mapPartner = (row: any): Partner => ({
  id: row.id,
  name: row.name,
  logo_url: row.logo_url,
  display_section_value: row.display_section_value,
  description: row.description || '',
  sort_order: row.sort_order || 0,
  status: row.status || 'active',
  created_at: row.created_at,
  updated_at: row.updated_at,
});

/** Public hook — fetches active partners for storefront */
export const usePartners = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async (): Promise<Partner[]> => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []).map(mapPartner);
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
};

/** Admin hook — full CRUD for partners */
export const useAdminPartners = () => {
  const queryClient = useQueryClient();

  const { data: partners = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-partners'],
    queryFn: async (): Promise<Partner[]> => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []).map(mapPartner);
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const addMutation = useMutation({
    mutationFn: async (partner: PartnerInsert) => {
      const { data, error } = await supabase
        .from('partners')
        .insert(partner)
        .select()
        .single();
      if (error) throw error;
      return mapPartner(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner added');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add partner'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PartnerUpdate }) => {
      const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return mapPartner(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner updated');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update partner'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('partners')
        .update({ status: 'inactive' })
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner archived');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to archive partner'),
  });

  return {
    partners,
    isLoading,
    error,
    refetch,
    addPartner: addMutation.mutateAsync,
    updatePartner: (id: string, updates: PartnerUpdate) => updateMutation.mutateAsync({ id, updates }),
    deletePartner: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
