'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase';
import type { TaskStatus } from '@/types/database';

interface UpdateTaskInput {
    taskId: string;
    updates: {
        status?: TaskStatus;
        quantity_done?: number;
        started_at?: string | null;
        completed_at?: string | null;
    };
}

export function useUpdatePrepTask(prepDate: string) {
    const supabase = createClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, updates }: UpdateTaskInput) => {
            const { data, error } = await supabase
                .from('prep_tasks')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', taskId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prep-list', prepDate] });
        },
    });
}

/** Convenience: increment quantity_done by 1, auto-set status */
export function useIncrementTask(prepDate: string) {
    const supabase = createClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            taskId,
            currentDone,
            quantityNeeded,
        }: {
            taskId: string;
            currentDone: number;
            quantityNeeded: number;
        }) => {
            const newDone = Math.min(currentDone + 1, quantityNeeded);
            const isDone = newDone >= quantityNeeded;

            const updates: Record<string, unknown> = {
                quantity_done: newDone,
                updated_at: new Date().toISOString(),
            };

            if (isDone) {
                updates.status = 'done';
                updates.completed_at = new Date().toISOString();
            } else if (currentDone === 0) {
                updates.status = 'in_progress';
                updates.started_at = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from('prep_tasks')
                .update(updates)
                .eq('id', taskId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prep-list', prepDate] });
        },
    });
}
