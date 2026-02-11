'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import type { PrepList } from '@/types/database';

export function usePrepList(date: string) {
    const supabase = createClient();

    return useQuery<PrepList | null>({
        queryKey: ['prep-list', date],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('prep_lists')
                .select(
                    `
                    *,
                    prep_tasks(
                        *,
                        menu_item:menu_items(
                            *,
                            station:stations(*)
                        )
                    )
                `
                )
                .eq('prep_date', date)
                .maybeSingle();

            if (error) throw error;
            return data as PrepList | null;
        },
    });
}
