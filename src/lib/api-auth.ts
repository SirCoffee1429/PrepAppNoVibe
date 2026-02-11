import { createServerSupabaseClient } from '@/lib/supabase-server';
import { error } from '@/lib/api-utils';
import type { NextRequest } from 'next/server';

/**
 * Verify the request is from an authenticated user.
 * Returns the Supabase client and user, or an error response.
 */
export async function requireAuth(request: NextRequest) {
    // Suppress unused variable warning — request is kept for
    // future header-based auth checks (e.g. API keys)
    void request;

    const supabase = createServerSupabaseClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: error('Unauthorized', 401) };
    }

    return { supabase, user };
}

/**
 * Verify the request is from an admin or chef.
 */
export async function requireAdminOrChef(request: NextRequest) {
    const auth = await requireAuth(request);
    if ('error' in auth) return auth;

    const { supabase, user } = auth;
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['admin', 'chef'].includes(profile.role)) {
        return { error: error('Forbidden — requires admin or chef role', 403) };
    }

    return { supabase, user, role: profile.role as string };
}
