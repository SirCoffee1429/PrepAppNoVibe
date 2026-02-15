'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import type { Station } from '@/types/database';

export function useStations() {
    const supabase = createClient();

    return useQuery<Station[]>({
        queryKey: ['stations'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('stations')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error) throw error;
            return data as Station[];
        },
    });
}
