import { describe, it, expect } from 'vitest';
import {
    createStationSchema,
    updateStationSchema,
    createMenuItemSchema,
    parLevelEntrySchema,
    upsertParLevelsSchema,
    createSalesRecordSchema,
    generatePrepListSchema,
    updatePrepTaskSchema,
} from '@/lib/validations';

// ─── Stations ──────────────────────────────────────────────────

describe('createStationSchema', () => {
    it('accepts valid input', () => {
        const result = createStationSchema.safeParse({
            name: 'Grill',
            color: '#ef4444',
        });
        expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
        const result = createStationSchema.safeParse({
            name: '',
            color: '#ef4444',
        });
        expect(result.success).toBe(false);
    });

    it('rejects invalid hex color', () => {
        const result = createStationSchema.safeParse({
            name: 'Grill',
            color: 'red',
        });
        expect(result.success).toBe(false);
    });

    it('rejects 3-char hex shorthand', () => {
        const result = createStationSchema.safeParse({
            name: 'Grill',
            color: '#f00',
        });
        expect(result.success).toBe(false);
    });

    it('accepts optional fields', () => {
        const result = createStationSchema.safeParse({
            name: 'Prep',
            color: '#22c55e',
            display_order: 2,
            is_active: false,
        });
        expect(result.success).toBe(true);
    });
});

describe('updateStationSchema', () => {
    it('allows partial updates', () => {
        const result = updateStationSchema.safeParse({ name: 'Sauté' });
        expect(result.success).toBe(true);
    });

    it('allows empty object', () => {
        const result = updateStationSchema.safeParse({});
        expect(result.success).toBe(true);
    });
});

// ─── Menu Items ────────────────────────────────────────────────

describe('createMenuItemSchema', () => {
    it('accepts valid item', () => {
        const result = createMenuItemSchema.safeParse({
            name: 'Burger Sauce',
            unit: 'quarts',
        });
        expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
        const result = createMenuItemSchema.safeParse({
            name: '',
            unit: 'portions',
        });
        expect(result.success).toBe(false);
    });

    it('accepts nullable station_id', () => {
        const result = createMenuItemSchema.safeParse({
            name: 'Fries',
            station_id: null,
        });
        expect(result.success).toBe(true);
    });
});

// ─── Par Levels ────────────────────────────────────────────────

describe('parLevelEntrySchema', () => {
    it('accepts valid entry', () => {
        const result = parLevelEntrySchema.safeParse({
            menu_item_id: '550e8400-e29b-41d4-a716-446655440000',
            day_of_week: 1,
            par_quantity: 12,
        });
        expect(result.success).toBe(true);
    });

    it('rejects day_of_week > 6', () => {
        const result = parLevelEntrySchema.safeParse({
            menu_item_id: '550e8400-e29b-41d4-a716-446655440000',
            day_of_week: 7,
            par_quantity: 5,
        });
        expect(result.success).toBe(false);
    });

    it('rejects negative par_quantity', () => {
        const result = parLevelEntrySchema.safeParse({
            menu_item_id: '550e8400-e29b-41d4-a716-446655440000',
            day_of_week: 3,
            par_quantity: -1,
        });
        expect(result.success).toBe(false);
    });

    it('rejects non-UUID menu_item_id', () => {
        const result = parLevelEntrySchema.safeParse({
            menu_item_id: 'not-a-uuid',
            day_of_week: 0,
            par_quantity: 10,
        });
        expect(result.success).toBe(false);
    });
});

describe('upsertParLevelsSchema', () => {
    it('accepts valid entries array', () => {
        const result = upsertParLevelsSchema.safeParse({
            entries: [
                {
                    menu_item_id: '550e8400-e29b-41d4-a716-446655440000',
                    day_of_week: 0,
                    par_quantity: 5,
                },
            ],
        });
        expect(result.success).toBe(true);
    });

    it('rejects empty entries array', () => {
        const result = upsertParLevelsSchema.safeParse({ entries: [] });
        expect(result.success).toBe(false);
    });
});

// ─── Sales Records ─────────────────────────────────────────────

describe('createSalesRecordSchema', () => {
    it('accepts valid record', () => {
        const result = createSalesRecordSchema.safeParse({
            menu_item_id: '550e8400-e29b-41d4-a716-446655440000',
            sale_date: '2026-02-11',
            quantity_sold: 42,
        });
        expect(result.success).toBe(true);
    });

    it('rejects invalid date format', () => {
        const result = createSalesRecordSchema.safeParse({
            menu_item_id: '550e8400-e29b-41d4-a716-446655440000',
            sale_date: '02/11/2026',
            quantity_sold: 10,
        });
        expect(result.success).toBe(false);
    });
});

// ─── Prep Lists ────────────────────────────────────────────────

describe('generatePrepListSchema', () => {
    it('accepts YYYY-MM-DD', () => {
        const result = generatePrepListSchema.safeParse({
            prep_date: '2026-02-11',
        });
        expect(result.success).toBe(true);
    });

    it('rejects non-date string', () => {
        const result = generatePrepListSchema.safeParse({
            prep_date: 'tomorrow',
        });
        expect(result.success).toBe(false);
    });
});

// ─── Prep Tasks ────────────────────────────────────────────────

describe('updatePrepTaskSchema', () => {
    it('accepts valid status update', () => {
        const result = updatePrepTaskSchema.safeParse({
            status: 'done',
            quantity_done: 10,
        });
        expect(result.success).toBe(true);
    });

    it('rejects invalid status', () => {
        const result = updatePrepTaskSchema.safeParse({
            status: 'cancelled',
        });
        expect(result.success).toBe(false);
    });

    it('allows empty object (partial update)', () => {
        const result = updatePrepTaskSchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it('accepts nullable assigned_to', () => {
        const result = updatePrepTaskSchema.safeParse({
            assigned_to: null,
        });
        expect(result.success).toBe(true);
    });
});
