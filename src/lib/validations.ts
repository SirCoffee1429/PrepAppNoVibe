import { z } from 'zod';

// ─── Stations ──────────────────────────────────────────────────

export const createStationSchema = z.object({
    name: z.string().min(1).max(100),
    color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color like #ef4444'),
    display_order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional().default(true),
});

export const updateStationSchema = createStationSchema.partial();

// ─── Menu Items ────────────────────────────────────────────────

export const createMenuItemSchema = z.object({
    name: z.string().min(1).max(200),
    station_id: z.string().uuid().nullable().optional(),
    recipe_id: z.string().uuid().nullable().optional(),
    unit: z.string().min(1).max(50).default('portions'),
    is_active: z.boolean().optional().default(true),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

// ─── Par Levels ────────────────────────────────────────────────

export const parLevelEntrySchema = z.object({
    menu_item_id: z.string().uuid(),
    day_of_week: z.number().int().min(0).max(6),
    par_quantity: z.number().min(0),
});

/** Bulk upsert: array of par level entries */
export const upsertParLevelsSchema = z.object({
    entries: z.array(parLevelEntrySchema).min(1).max(500),
});

// ─── Sales Records ─────────────────────────────────────────────

export const createSalesRecordSchema = z.object({
    menu_item_id: z.string().uuid(),
    sale_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
    quantity_sold: z.number().int().min(0),
});

// ─── Prep Lists ────────────────────────────────────────────────

export const generatePrepListSchema = z.object({
    prep_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
});

export const updatePrepListSchema = z.object({
    notes: z.string().max(1000).nullable().optional(),
    is_locked: z.boolean().optional(),
});

// ─── Prep Tasks ────────────────────────────────────────────────

export const updatePrepTaskSchema = z.object({
    status: z.enum(['pending', 'in_progress', 'done', 'skipped']).optional(),
    quantity_done: z.number().int().min(0).optional(),
    notes: z.string().max(1000).nullable().optional(),
    assigned_to: z.string().uuid().nullable().optional(),
    started_at: z.string().nullable().optional(),
    completed_at: z.string().nullable().optional(),
});
