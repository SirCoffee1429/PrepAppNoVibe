-- ============================================================
-- Migration 4: Row Level Security
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE par_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_tasks ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- profiles
CREATE POLICY "profiles_select_authenticated" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_admin_manage" ON profiles FOR ALL TO authenticated USING (public.current_user_role() = 'admin');

-- stations
CREATE POLICY "stations_select_authenticated" ON stations FOR SELECT TO authenticated USING (true);
CREATE POLICY "stations_admin_chef_manage" ON stations FOR ALL TO authenticated USING (public.current_user_role() IN ('admin', 'chef'));

-- recipes
CREATE POLICY "recipes_select_authenticated" ON recipes FOR SELECT TO authenticated USING (true);
CREATE POLICY "recipes_admin_chef_manage" ON recipes FOR ALL TO authenticated USING (public.current_user_role() IN ('admin', 'chef'));

-- recipe_ingredients
CREATE POLICY "recipe_ingredients_select_authenticated" ON recipe_ingredients FOR SELECT TO authenticated USING (true);
CREATE POLICY "recipe_ingredients_admin_chef_manage" ON recipe_ingredients FOR ALL TO authenticated USING (public.current_user_role() IN ('admin', 'chef'));

-- menu_items
CREATE POLICY "menu_items_select_authenticated" ON menu_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "menu_items_admin_chef_manage" ON menu_items FOR ALL TO authenticated USING (public.current_user_role() IN ('admin', 'chef'));

-- par_levels
CREATE POLICY "par_levels_select_authenticated" ON par_levels FOR SELECT TO authenticated USING (true);
CREATE POLICY "par_levels_admin_chef_manage" ON par_levels FOR ALL TO authenticated USING (public.current_user_role() IN ('admin', 'chef'));

-- sales_records
CREATE POLICY "sales_records_select_authenticated" ON sales_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "sales_records_admin_chef_manage" ON sales_records FOR ALL TO authenticated USING (public.current_user_role() IN ('admin', 'chef'));

-- prep_lists
CREATE POLICY "prep_lists_select_authenticated" ON prep_lists FOR SELECT TO authenticated USING (true);
CREATE POLICY "prep_lists_admin_chef_manage" ON prep_lists FOR ALL TO authenticated USING (public.current_user_role() IN ('admin', 'chef'));

-- prep_tasks
CREATE POLICY "prep_tasks_select_authenticated" ON prep_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "prep_tasks_admin_chef_manage" ON prep_tasks FOR ALL TO authenticated USING (public.current_user_role() IN ('admin', 'chef'));
CREATE POLICY "prep_tasks_cook_update_own" ON prep_tasks FOR UPDATE TO authenticated USING (assigned_to = auth.uid());
