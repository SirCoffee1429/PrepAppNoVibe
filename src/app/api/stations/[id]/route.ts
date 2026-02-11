import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requireAdminOrChef } from '@/lib/api-auth';
import { ok, noContent, handleError, error } from '@/lib/api-utils';
import { updateStationSchema } from '@/lib/validations';

interface Ctx {
    params: { id: string };
}

/**
 * GET /api/stations/:id
 */
export async function GET(_request: NextRequest, { params }: Ctx) {
    try {
        const supabase = createServerSupabaseClient();
        const { data, error: dbErr } = await supabase
            .from('stations')
            .select('*')
            .eq('id', params.id)
            .single();

        if (dbErr) {
            if (dbErr.code === 'PGRST116') return error('Station not found', 404);
            throw dbErr;
        }
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * PATCH /api/stations/:id
 */
export async function PATCH(request: NextRequest, { params }: Ctx) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const body = await request.json();
        const parsed = updateStationSchema.parse(body);

        const { data, error: dbErr } = await auth.supabase
            .from('stations')
            .update(parsed)
            .eq('id', params.id)
            .select()
            .single();

        if (dbErr) {
            if (dbErr.code === 'PGRST116') return error('Station not found', 404);
            throw dbErr;
        }
        return ok(data);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * DELETE /api/stations/:id
 */
export async function DELETE(request: NextRequest, { params }: Ctx) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const { error: dbErr } = await auth.supabase
            .from('stations')
            .delete()
            .eq('id', params.id);

        if (dbErr) throw dbErr;
        return noContent();
    } catch (err) {
        return handleError(err);
    }
}
