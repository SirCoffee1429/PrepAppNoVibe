import { type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { requireAdminOrChef } from '@/lib/api-auth';
import {
    created,
    handleError,
    parsePagination,
    paginatedResponse,
} from '@/lib/api-utils';
import { createSalesRecordSchema } from '@/lib/validations';

/**
 * GET /api/sales-records
 * Paginated. Query params: ?menu_item_id=uuid&from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&page_size=50
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const params = parsePagination(searchParams);
        const menuItemId = searchParams.get('menu_item_id');
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        let query = supabase
            .from('sales_records')
            .select('*, menu_item:menu_items(id, name)', { count: 'exact' })
            .order('sale_date', { ascending: false })
            .range(params.offset, params.offset + params.pageSize - 1);

        if (menuItemId) query = query.eq('menu_item_id', menuItemId);
        if (from) query = query.gte('sale_date', from);
        if (to) query = query.lte('sale_date', to);

        const { data, count, error: dbErr } = await query;
        if (dbErr) throw dbErr;
        return paginatedResponse(data ?? [], count ?? 0, params);
    } catch (err) {
        return handleError(err);
    }
}

/**
 * POST /api/sales-records
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await requireAdminOrChef(request);
        if ('error' in auth) return auth.error;

        const body = await request.json();
        const parsed = createSalesRecordSchema.parse(body);

        const { data, error: dbErr } = await auth.supabase
            .from('sales_records')
            .insert(parsed)
            .select('*, menu_item:menu_items(id, name)')
            .single();

        if (dbErr) throw dbErr;
        return created(data);
    } catch (err) {
        return handleError(err);
    }
}
