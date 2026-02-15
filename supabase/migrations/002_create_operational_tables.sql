-- ============================================================
-- Migration 2: Operational tables
-- ============================================================

-- ── menu_items ────────────────────────────────────────────────
CREATE TABLE menu_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  station_id  uuid REFERENCES stations(id) ON DELETE SET NULL,
  recipe_id   uuid REFERENCES recipes(id) ON DELETE SET NULL,
  unit        text NOT NULL DEFAULT 'portions',
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE menu_items IS 'Sellable items on the menu, linked to a station and optionally a recipe';

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── par_levels ────────────────────────────────────────────────
CREATE TABLE par_levels (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id    uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  day_of_week     int NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  par_quantity    int NOT NULL CHECK (par_quantity >= 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (menu_item_id, day_of_week)
);

COMMENT ON TABLE par_levels IS 'Target prep quantities per menu item per day of week (0=Sun, 6=Sat)';

CREATE TRIGGER par_levels_updated_at
  BEFORE UPDATE ON par_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── sales_records ─────────────────────────────────────────────
CREATE TABLE sales_records (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id    uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  sale_date       date NOT NULL,
  quantity_sold   int NOT NULL DEFAULT 0 CHECK (quantity_sold >= 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (menu_item_id, sale_date)
);

COMMENT ON TABLE sales_records IS 'Daily sales totals per menu item for forecasting';

-- ── prep_lists ────────────────────────────────────────────────
CREATE TABLE prep_lists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prep_date   date NOT NULL UNIQUE DEFAULT CURRENT_DATE,
  notes       text,
  created_by  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_locked   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE prep_lists IS 'Daily prep list — one per day, lockable by chef';

-- ── prep_tasks ────────────────────────────────────────────────
CREATE TABLE prep_tasks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prep_list_id    uuid NOT NULL REFERENCES prep_lists(id) ON DELETE CASCADE,
  menu_item_id    uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity_needed int NOT NULL CHECK (quantity_needed > 0),
  quantity_done   int NOT NULL DEFAULT 0 CHECK (quantity_done >= 0),
  status          task_status NOT NULL DEFAULT 'pending',
  assigned_to     uuid REFERENCES profiles(id) ON DELETE SET NULL,
  notes           text,
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE prep_tasks IS 'Individual prep tasks within a prep list, with progress tracking';

CREATE TRIGGER prep_tasks_updated_at
  BEFORE UPDATE ON prep_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
