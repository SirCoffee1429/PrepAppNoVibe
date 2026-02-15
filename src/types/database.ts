// ─── Station ───────────────────────────────────────────────────
export interface Station {
    id: string;
    name: string;
    color: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

// ─── Recipe ────────────────────────────────────────────────────
export interface Recipe {
    id: string;
    name: string;
    description: string | null;
    method: string | null;
    yield_amount: string | null;
    yield_unit: string | null;
    shelf_life: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ─── Menu Item ─────────────────────────────────────────────────
export interface MenuItem {
    id: string;
    name: string;
    station_id: string | null;
    recipe_id: string | null;
    unit: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Joined fields
    station?: Station;
    recipe?: Pick<Recipe, 'id' | 'name'>;
}

// ─── Par Level ─────────────────────────────────────────────────
export interface ParLevel {
    id: string;
    menu_item_id: string;
    day_of_week: number; // 0=Sun, 6=Sat
    par_quantity: number;
    created_at: string;
    updated_at: string;
    // Joined
    menu_item?: Pick<MenuItem, 'id' | 'name' | 'unit'>;
}

// ─── Sales Record ──────────────────────────────────────────────
export interface SalesRecord {
    id: string;
    menu_item_id: string;
    sale_date: string;
    quantity_sold: number;
    created_at: string;
    // Joined
    menu_item?: Pick<MenuItem, 'id' | 'name'>;
}

// ─── Prep List ─────────────────────────────────────────────────
export interface PrepList {
    id: string;
    prep_date: string;
    notes: string | null;
    created_by: string | null;
    is_locked: boolean;
    created_at: string;
    // Joined
    prep_tasks?: PrepTask[];
}

// ─── Prep Task ─────────────────────────────────────────────────
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'skipped';

export interface PrepTask {
    id: string;
    prep_list_id: string;
    menu_item_id: string;
    quantity_needed: number;
    quantity_done: number;
    status: TaskStatus;
    assigned_to: string | null;
    notes: string | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    // Joined
    menu_item?: MenuItem & { station?: Station };
}

// ─── Day helpers ───────────────────────────────────────────────
export const DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
] as const;

export const DAY_SHORT = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
] as const;
