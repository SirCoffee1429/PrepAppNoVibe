import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requireAdminOrChef } from '@/lib/api-auth';
import { ok, created, handleError } from '@/lib/api-utils';
import { createMenuItemSchema } from '@/lib/validations';

/**
 * GET /api/menu-items
 * Lists menu items with station and recipe joins.
 * Query params: ?station_id=uuid&active_only=true
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const stationId = searchParams.get('station_id');
        const activeOnly = searchParams.get('active_only') !== 'false';

        let query = supabase
            .from('menu_items')
            .select('*, station:stations(*), recipe:recipes(id, name)')
            .order('name');

        if (activeOnly) query = query.eq('is_active', true);
        if (stationId) query = query.eq('station_id', stationId);

        const { data, error: dbErr } = await query;
        if (dbErr) throw dbErr;
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * POST /api/menu-items
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const body = await request.json();
        const parsed = createMenuItemSchema.parse(body);

        const { data, error: dbErr } = await auth.supabase
            .from('menu_items')
            .insert(parsed)
            .select('*, station:stations(*), recipe:recipes(id, name)')
            .single();

        if (dbErr) throw dbErr;
        return created(data);
    } catch (err) {
        return handleError(err);
    }
}
