import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requireAdminOrChef } from '@/lib/api-auth';
import { ok, noContent, handleError, error } from '@/lib/api-utils';

interface Ctx {
    params: { id: string };
}

/**
 * GET /api/prep-lists/:id
 */
export async function GET(_request: NextRequest, { params }: Ctx) {
    try {
        const supabase = createServerSupabaseClient();
        const { data, error: dbErr } = await supabase
            .from('prep_lists')
            .select(
                '*, prep_tasks(*, menu_item:menu_items(*, station:stations(*)))'
            )
            .eq('id', params.id)
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

/**
 * DELETE /api/prep-lists/:id
 */
export async function DELETE(request: NextRequest, { params }: Ctx) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        // Delete tasks first (FK cascade might handle this, but be explicit)
        await auth.supabase
            .from('prep_tasks')
            .delete()
            .eq('prep_list_id', params.id);

        const { error: dbErr } = await auth.supabase
            .from('prep_lists')
            .delete()
            .eq('id', params.id);

        if (dbErr) throw dbErr;
        return noContent();
    } catch (err) {
        return handleError(err);
    }
}
