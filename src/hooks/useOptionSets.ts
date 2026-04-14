import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OptionSetItem {
  id: string;
  option_set_id: string;
  label: string;
  sort_order: number;
}

export interface OptionSet {
  id: string;
  name: string;
  items: OptionSetItem[];
}

/* ── Public hook: fetch all option sets with items (cached) ── */

export const useOptionSets = () => {
  return useQuery({
    queryKey: ['option-sets'],
    queryFn: async (): Promise<OptionSet[]> => {
      const [setsRes, itemsRes] = await Promise.all([
        supabase.from('option_sets').select('*').order('name'),
        supabase.from('option_set_items').select('*').order('sort_order'),
      ]);
      if (setsRes.error) throw setsRes.error;
      if (itemsRes.error) throw itemsRes.error;

      const itemsBySet = new Map<string, OptionSetItem[]>();
      for (const item of itemsRes.data || []) {
        const list = itemsBySet.get(item.option_set_id) || [];
        list.push(item as OptionSetItem);
        itemsBySet.set(item.option_set_id, list);
      }

      return (setsRes.data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        items: itemsBySet.get(s.id) || [],
      }));
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
};

/** Get items for a specific option_set_id (derived from cached data) */
export const useOptionSetItems = (optionSetId: string | null | undefined) => {
  const { data: sets = [] } = useOptionSets();
  if (!optionSetId) return [];
  return sets.find((s) => s.id === optionSetId)?.items || [];
};

/* ── Admin hooks ── */

export const useAdminOptionSets = () => {
  const qc = useQueryClient();
  const { data: optionSets = [], isLoading } = useOptionSets();

  const addSet = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('option_sets')
        .insert({ name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['option-sets'] });
      toast.success('Option set created');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to create option set'),
  });

  const updateSet = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from('option_sets').update({ name }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['option-sets'] });
      toast.success('Option set updated');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to update'),
  });

  const deleteSet = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('option_sets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['option-sets'] });
      toast.success('Option set deleted');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to delete'),
  });

  const addItem = useMutation({
    mutationFn: async ({ option_set_id, label, sort_order }: { option_set_id: string; label: string; sort_order: number }) => {
      const { error } = await supabase.from('option_set_items').insert({ option_set_id, label, sort_order });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['option-sets'] });
      toast.success('Size option added');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to add item'),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('option_set_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['option-sets'] });
      toast.success('Size option removed');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to remove item'),
  });

  return { optionSets, isLoading, addSet, updateSet, deleteSet, addItem, deleteItem };
};
