'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import type { MenuItem } from '@/types/database';

interface UseMenuItemsOptions {
    stationId?: string;
}

export function useMenuItems(options?: UseMenuItemsOptions) {
    const supabase = createClient();

    return useQuery<MenuItem[]>({
        queryKey: ['menu-items', options?.stationId ?? 'all'],
        queryFn: async () => {
            let query = supabase
                .from('menu_items')
                .select(
                    `
                    *,
                    station:stations(*),
                    recipe:recipes(id, name)
                `
                )
                .eq('is_active', true)
                .order('name');

            if (options?.stationId) {
                query = query.eq('station_id', options.stationId);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data as MenuItem[];
        },
    });
}
