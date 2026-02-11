import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requireAdminOrChef } from '@/lib/api-auth';
import { ok, handleError } from '@/lib/api-utils';
import { upsertParLevelsSchema } from '@/lib/validations';

/**
 * GET /api/par-levels
 * Query params: ?menu_item_id=uuid
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const menuItemId = searchParams.get('menu_item_id');

        let query = supabase
            .from('par_levels')
            .select('*, menu_item:menu_items(id, name, unit)')
            .order('day_of_week');

        if (menuItemId) query = query.eq('menu_item_id', menuItemId);

        const { data, error: dbErr } = await query;
        if (dbErr) throw dbErr;
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * PUT /api/par-levels
 * Bulk upsert par level entries.
 * Body: { entries: [{ menu_item_id, day_of_week, par_quantity }] }
 */
export async function PUT(request: NextRequest) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const body = await request.json();
        const { entries } = upsertParLevelsSchema.parse(body);

        const { data, error: dbErr } = await auth.supabase
            .from('par_levels')
            .upsert(entries, {
                onConflict: 'menu_item_id,day_of_week',
            })
            .select();

        if (dbErr) throw dbErr;
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}
