import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ─── Standard response shapes ──────────────────────────────────

/** Success response with data */
export function ok<T>(data: T, status = 200) {
    return NextResponse.json({ data }, { status });
}

/** Created response */
export function created<T>(data: T) {
    return ok(data, 201);
}

/** No content (204) */
export function noContent() {
    return new NextResponse(null, { status: 204 });
}

/** Error response */
export function error(message: string, status = 400, details?: unknown) {
    return NextResponse.json(
        {
            error: { message, ...(details ? { details } : {}) },
        },
        { status }
    );
}

/** Handle thrown errors consistently */
export function handleError(err: unknown) {
    if (err instanceof ZodError) {
        return error('Validation failed', 422, err.flatten().fieldErrors);
    }
    if (err instanceof Error) {
        // Supabase errors often include a `code` property
        const pgErr = err as Error & { code?: string };
        if (pgErr.code === '23505') {
            return error('Record already exists', 409);
        }
        if (pgErr.code === '23503') {
            return error('Referenced record not found', 400);
        }
        return error(err.message, 500);
    }
    return error('Internal server error', 500);
}

// ─── Pagination helpers ────────────────────────────────────────

export interface PaginationParams {
    page: number;
    pageSize: number;
    offset: number;
}

export function parsePagination(
    searchParams: URLSearchParams
): PaginationParams {
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const pageSize = Math.min(
        100,
        Math.max(1, parseInt(searchParams.get('page_size') ?? '50', 10))
    );
    return { page, pageSize, offset: (page - 1) * pageSize };
}

export function paginatedResponse<T>(
    data: T[],
    total: number,
    params: PaginationParams
) {
    return NextResponse.json(
        {
            data,
            pagination: {
                page: params.page,
                page_size: params.pageSize,
                total,
                total_pages: Math.ceil(total / params.pageSize),
            },
        },
        { status: 200 }
    );
}
