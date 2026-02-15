-- ============================================================
-- Migration 1: Enums, trigger function, and base tables
-- PrepAppNoVibe — otzaclpgoefkvsztmshx
-- ============================================================

-- Custom enums
CREATE TYPE user_role AS ENUM ('admin', 'chef', 'cook');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'done', 'skipped');

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── stations ──────────────────────────────────────────────────
CREATE TABLE stations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  color       text NOT NULL DEFAULT '#64748b',
  display_order int NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE stations IS 'Kitchen stations (Grill, Sauté, Pantry, etc.)';

-- ── profiles ──────────────────────────────────────────────────
CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  avatar_url  text,
  role        user_role NOT NULL DEFAULT 'cook',
  station_id  uuid REFERENCES stations(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE profiles IS 'User profiles linked to Supabase Auth';

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── recipes ───────────────────────────────────────────────────
CREATE TABLE recipes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL UNIQUE,
  description     text,
  method          text,
  yield_amount    text,
  yield_unit      text,
  shelf_life      text,
  plating_notes   text,
  storage_notes   text,
  recipe_cost     numeric(10,2),
  portion_cost    numeric(10,2),
  menu_price      numeric(10,2),
  food_cost_pct   numeric(5,2),
  file_url        text,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE recipes IS 'Recipe definitions with costing and method';

CREATE TRIGGER recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── recipe_ingredients ────────────────────────────────────────
CREATE TABLE recipe_ingredients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id       uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  quantity        numeric(10,3),
  unit            text,
  cost            numeric(10,2),
  sort_order      int NOT NULL DEFAULT 0
);

COMMENT ON TABLE recipe_ingredients IS 'Normalized ingredient rows per recipe';
