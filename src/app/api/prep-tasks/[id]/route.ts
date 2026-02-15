import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ok, handleError, error } from '@/lib/api-utils';
import { updatePrepTaskSchema } from '@/lib/validations';

interface Ctx {
    params: { id: string };
}

/**
 * GET /api/prep-tasks/:id
 */
export async function GET(_request: NextRequest, { params }: Ctx) {
    try {
        const supabase = createServerSupabaseClient();
        const { data, error: dbErr } = await supabase
            .from('prep_tasks')
            .select('*, menu_item:menu_items(*, station:stations(*))')
            .eq('id', params.id)
            .single();

        if (dbErr) {
            if (dbErr.code === 'PGRST116')
                return error('Prep task not found', 404);
            throw dbErr;
        }
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * PATCH /api/prep-tasks/:id
 * Public — kitchen cooks can update tasks without auth.
 * Body: { status?, quantity_done?, notes?, started_at?, completed_at? }
 */
export async function PATCH(request: NextRequest, { params }: Ctx) {
    try {
        const supabase = createServerSupabaseClient();
        const body = await request.json();
        const parsed = updatePrepTaskSchema.parse(body);

        const { data, error: dbErr } = await supabase
            .from('prep_tasks')
            .update({ ...parsed, updated_at: new Date().toISOString() })
            .eq('id', params.id)
            .select('*, menu_item:menu_items(*, station:stations(*))')
            .single();

        if (dbErr) {
            if (dbErr.code === 'PGRST116')
                return error('Prep task not found', 404);
            throw dbErr;
        }
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}
