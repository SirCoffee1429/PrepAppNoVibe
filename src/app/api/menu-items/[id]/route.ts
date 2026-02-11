import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requireAdminOrChef } from '@/lib/api-auth';
import { ok, noContent, handleError, error } from '@/lib/api-utils';
import { updateMenuItemSchema } from '@/lib/validations';

interface Ctx {
    params: { id: string };
}

/**
 * GET /api/menu-items/:id
 */
export async function GET(_request: NextRequest, { params }: Ctx) {
    try {
        const supabase = createServerSupabaseClient();
        const { data, error: dbErr } = await supabase
            .from('menu_items')
            .select('*, station:stations(*), recipe:recipes(id, name)')
            .eq('id', params.id)
            .single();

        if (dbErr) {
            if (dbErr.code === 'PGRST116')
                return error('Menu item not found', 404);
            throw dbErr;
        }
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * PATCH /api/menu-items/:id
 */
export async function PATCH(request: NextRequest, { params }: Ctx) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const body = await request.json();
        const parsed = updateMenuItemSchema.parse(body);

        const { data, error: dbErr } = await auth.supabase
            .from('menu_items')
            .update({ ...parsed, updated_at: new Date().toISOString() })
            .eq('id', params.id)
            .select('*, station:stations(*), recipe:recipes(id, name)')
            .single();

        if (dbErr) {
            if (dbErr.code === 'PGRST116')
                return error('Menu item not found', 404);
            throw dbErr;
        }
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * DELETE /api/menu-items/:id
 */
export async function DELETE(request: NextRequest, { params }: Ctx) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const { error: dbErr } = await auth.supabase
            .from('menu_items')
            .delete()
            .eq('id', params.id);

        if (dbErr) throw dbErr;
        return noContent();
    } catch (err) {
        return handleError(err);
    }
}
