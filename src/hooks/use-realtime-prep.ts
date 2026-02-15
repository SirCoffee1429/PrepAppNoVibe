'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';

/**
 * Subscribe to real-time changes on prep_tasks.
 * Any INSERT/UPDATE/DELETE invalidates the prep-list cache,
 * causing all kitchen views to re-fetch automatically.
 */
export function useRealtimePrepTasks(prepDate: string) {
    const queryClient = useQueryClient();
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel(`prep-tasks-${prepDate}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'prep_tasks',
                },
                () => {
                    queryClient.invalidateQueries({
                        queryKey: ['prep-list', prepDate],
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, queryClient, prepDate]);
}
