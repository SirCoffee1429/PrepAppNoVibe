'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function generatePrepList(dateString: string) {
    const supabase = createServerSupabaseClient();

    // Figure out day of week (0=Sun, 6=Sat)
    const date = new Date(dateString + 'T12:00:00'); // noon to avoid timezone issues
    const dayOfWeek = date.getDay();

    // Get par levels for this day
    const { data: parLevels, error: parError } = await supabase
        .from('par_levels')
        .select('menu_item_id, par_quantity')
        .eq('day_of_week', dayOfWeek);

    if (parError) throw new Error(parError.message);
    if (!parLevels || parLevels.length === 0) {
        throw new Error(
            `No par levels found for ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}`
        );
    }

    // Upsert the prep list (one per day)
    const { data: prepList, error: listError } = await supabase
        .from('prep_lists')
        .upsert(
            { prep_date: dateString },
            { onConflict: 'prep_date' }
        )
        .select()
        .single();

    if (listError) throw new Error(listError.message);

    // Delete existing tasks for this list (to regenerate)
    await supabase
        .from('prep_tasks')
        .delete()
        .eq('prep_list_id', prepList.id);

    // Create tasks from par levels
    const tasks = parLevels.map((pl) => ({
        prep_list_id: prepList.id,
        menu_item_id: pl.menu_item_id,
        quantity_needed: pl.par_quantity,
        quantity_done: 0,
        status: 'pending' as const,
    }));

    const { error: taskError } = await supabase
        .from('prep_tasks')
        .insert(tasks);

    if (taskError) throw new Error(taskError.message);

    return { id: prepList.id, taskCount: tasks.length };
}
