-- ============================================================
-- Migration 3: Performance indexes
-- ============================================================

CREATE INDEX idx_stations_active ON stations (is_active) WHERE is_active = true;
CREATE INDEX idx_profiles_role ON profiles (role);
CREATE INDEX idx_profiles_station ON profiles (station_id) WHERE station_id IS NOT NULL;
CREATE INDEX idx_recipes_active ON recipes (is_active) WHERE is_active = true;
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients (recipe_id);
CREATE INDEX idx_menu_items_station ON menu_items (station_id);
CREATE INDEX idx_menu_items_active ON menu_items (is_active) WHERE is_active = true;
CREATE INDEX idx_menu_items_recipe ON menu_items (recipe_id) WHERE recipe_id IS NOT NULL;
CREATE INDEX idx_par_levels_item ON par_levels (menu_item_id);
CREATE INDEX idx_sales_records_date ON sales_records (sale_date);
CREATE INDEX idx_sales_records_item_date ON sales_records (menu_item_id, sale_date DESC);
CREATE INDEX idx_prep_lists_date ON prep_lists (prep_date);
CREATE INDEX idx_prep_tasks_list ON prep_tasks (prep_list_id);
CREATE INDEX idx_prep_tasks_status ON prep_tasks (prep_list_id, status);
CREATE INDEX idx_prep_tasks_assigned ON prep_tasks (assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_prep_tasks_item ON prep_tasks (menu_item_id);
