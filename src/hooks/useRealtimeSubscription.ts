import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Subscribe to Postgres changes on a table and invalidate
 * the matching React-Query cache keys on any INSERT/UPDATE/DELETE.
 *
 * queryKeys is stored in a ref to avoid re-subscribing on every render.
 */
export const useRealtimeSubscription = (
  tableName: string,
  queryKeys: string[][],
) => {
  const queryClient = useQueryClient();
  const keysRef = useRef(queryKeys);
  keysRef.current = queryKeys;

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => {
          keysRef.current.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, queryClient]);
};
