import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requireAdminOrChef } from '@/lib/api-auth';
import { ok, created, handleError } from '@/lib/api-utils';
import { createStationSchema } from '@/lib/validations';

/**
 * GET /api/stations
 * List all stations (public — needed by kitchen views)
 */
export async function GET() {
    try {
        const supabase = createServerSupabaseClient();
        const { data, error: dbErr } = await supabase
            .from('stations')
            .select('*')
            .order('display_order');

        if (dbErr) throw dbErr;
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * POST /api/stations
 * Create a new station (admin/chef only)
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const body = await request.json();
        const parsed = createStationSchema.parse(body);

        const { data, error: dbErr } = await auth.supabase
            .from('stations')
            .insert(parsed)
            .select()
            .single();

        if (dbErr) throw dbErr;
        return created(data);
    } catch (err) {
        return handleError(err);
    }
}
