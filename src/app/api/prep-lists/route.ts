import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requireAdminOrChef } from '@/lib/api-auth';
import { ok, created, handleError, error } from '@/lib/api-utils';
import {
    generatePrepListSchema,
    updatePrepListSchema,
} from '@/lib/validations';

/**
 * GET /api/prep-lists
 * Query params: ?date=YYYY-MM-DD (returns a single list) or returns all
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');

        if (date) {
            const { data, error: dbErr } = await supabase
                .from('prep_lists')
                .select(
                    `*, prep_tasks(*, menu_item:menu_items(*, station:stations(*)))`
                )
                .eq('prep_date', date)
                .maybeSingle();

            if (dbErr) throw dbErr;
            if (!data) return error('No prep list for this date', 404);
            return ok(data);
        }

        // List all
        const { data, error: dbErr } = await supabase
            .from('prep_lists')
            .select('id, prep_date, is_locked, notes, created_at')
            .order('prep_date', { ascending: false })
            .limit(30);

        if (dbErr) throw dbErr;
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * POST /api/prep-lists
 * Generate a prep list for a given date.
 * Body: { prep_date: "YYYY-MM-DD" }
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const body = await request.json();
        const { prep_date } = generatePrepListSchema.parse(body);

        const date = new Date(prep_date + 'T12:00:00');
        const dayOfWeek = date.getDay();

        // Get par levels for this day
        const { data: parLevels, error: parErr } = await auth.supabase
            .from('par_levels')
            .select('menu_item_id, par_quantity')
            .eq('day_of_week', dayOfWeek);

        if (parErr) throw parErr;
        if (!parLevels || parLevels.length === 0) {
            return error(
                `No par levels found for ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]}`,
                400
            );
        }

        // Upsert prep list
        const { data: prepList, error: listErr } = await auth.supabase
            .from('prep_lists')
            .upsert(
                { prep_date, created_by: auth.user.id },
                { onConflict: 'prep_date' }
            )
            .select()
            .single();

        if (listErr) throw listErr;

        // Delete existing tasks for this list
        await auth.supabase
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

        const { error: taskErr } = await auth.supabase
            .from('prep_tasks')
            .insert(tasks);

        if (taskErr) throw taskErr;

        return created({
            id: prepList.id,
            prep_date: prepList.prep_date,
            task_count: tasks.length,
        });
    } catch (err) {
        return handleError(err);
    }
}

/**
 * PATCH /api/prep-lists — update by date query param
 * Query params: ?date=YYYY-MM-DD
 */
export async function PATCH(request: NextRequest) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        if (!date) return error('date query param required', 400);

        const body = await request.json();
        const parsed = updatePrepListSchema.parse(body);

        const { data, error: dbErr } = await auth.supabase
            .from('prep_lists')
            .update(parsed)
            .eq('prep_date', date)
            .select()
            .single();

        if (dbErr) {
            if (dbErr.code === 'PGRST116')
                return error('Prep list not found', 404);
            throw dbErr;
        }
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}
