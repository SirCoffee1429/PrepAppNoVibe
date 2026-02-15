-- ============================================================
-- Seed Data for Development
-- Run with: psql or via Supabase SQL Editor
-- ============================================================

-- Stations
INSERT INTO stations (name, color, display_order) VALUES
  ('Grill',   '#ef4444', 1),
  ('Sauté',   '#f97316', 2),
  ('Fry',     '#eab308', 3),
  ('Pantry',  '#22c55e', 4),
  ('Pastry',  '#a855f7', 5),
  ('Garde Manger', '#06b6d4', 6);

-- Recipes
INSERT INTO recipes (name, description, method, yield_amount, yield_unit, shelf_life, recipe_cost, portion_cost, menu_price, food_cost_pct) VALUES
  ('House Vinaigrette', 'Classic mustard-shallot vinaigrette',
   E'1. Mince shallots finely\n2. Whisk mustard, vinegar, salt, pepper\n3. Slowly stream in oil while whisking\n4. Adjust seasoning',
   '1', 'quart', '5 days', 4.50, 0.35, NULL, NULL),
  ('Grilled Chicken Breast', 'Brined and grilled airline chicken breast',
   E'1. Brine chicken 4-6 hours\n2. Pat dry, season with house blend\n3. Grill skin-side down 6 min\n4. Flip, finish in 400°F oven to 165°F IT\n5. Rest 5 min before slicing',
   '10', 'portions', '2 days', 32.00, 3.20, 18.00, 17.78),
  ('Mashed Potatoes', 'Creamy Yukon Gold mashed potatoes',
   E'1. Peel and cube potatoes\n2. Cold water start, salt heavily, boil until fork tender\n3. Drain and rice potatoes\n4. Fold in warm cream and butter\n5. Season to taste',
   '20', 'portions', '2 days', 15.00, 0.75, 6.00, 12.50),
  ('Chocolate Lava Cake', 'Individual molten chocolate cakes',
   E'1. Melt chocolate and butter over double boiler\n2. Whisk eggs, yolks, sugar until ribbon stage\n3. Fold chocolate into egg mixture\n4. Fold in flour\n5. Pour into buttered ramekins\n6. Bake 400°F 12-14 min',
   '12', 'cakes', '1 day (batter)', 18.00, 1.50, 12.00, 12.50),
  ('Caesar Dressing', 'Classic anchovy-garlic Caesar',
   E'1. Mash anchovies and garlic into paste\n2. Whisk in egg yolks, lemon, mustard\n3. Slowly stream in oil\n4. Fold in parmesan\n5. Season with Worcestershire, salt, pepper',
   '1', 'quart', '4 days', 6.00, 0.50, NULL, NULL),
  ('French Fries', 'Double-fried Kennebec fries',
   E'1. Cut potatoes into 3/8" batons\n2. Rinse in cold water, dry thoroughly\n3. Blanch at 300°F until cooked through (no color)\n4. Cool on sheet tray\n5. Fry at 375°F until golden and crispy\n6. Season immediately with fine salt',
   '25', 'portions', '1 day (blanched)', 8.00, 0.32, 5.00, 6.40);

-- Recipe Ingredients (House Vinaigrette)
INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit, cost, sort_order)
SELECT r.id, i.ingredient_name, i.quantity, i.unit, i.cost, i.sort_order
FROM recipes r
CROSS JOIN (VALUES
  ('Shallots', 2.0, 'oz', 0.60, 1),
  ('Dijon mustard', 1.0, 'tbsp', 0.30, 2),
  ('Red wine vinegar', 4.0, 'oz', 0.80, 3),
  ('Extra virgin olive oil', 12.0, 'oz', 2.40, 4),
  ('Salt', 0.5, 'tsp', 0.05, 5),
  ('Black pepper', 0.25, 'tsp', 0.05, 6)
) AS i(ingredient_name, quantity, unit, cost, sort_order)
WHERE r.name = 'House Vinaigrette';

-- Recipe Ingredients (Grilled Chicken)
INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit, cost, sort_order)
SELECT r.id, i.ingredient_name, i.quantity, i.unit, i.cost, i.sort_order
FROM recipes r
CROSS JOIN (VALUES
  ('Airline chicken breast', 10.0, 'each', 25.00, 1),
  ('House seasoning blend', 3.0, 'tbsp', 1.50, 2),
  ('Brine salt', 8.0, 'oz', 0.50, 3),
  ('Canola oil', 2.0, 'oz', 0.30, 4)
) AS i(ingredient_name, quantity, unit, cost, sort_order)
WHERE r.name = 'Grilled Chicken Breast';

-- Menu Items
INSERT INTO menu_items (name, station_id, recipe_id, unit)
SELECT mi.name, s.id, r.id, mi.unit
FROM (VALUES
  ('Grilled Chicken', 'Grill', 'Grilled Chicken Breast', 'portions'),
  ('House Salad', 'Garde Manger', 'House Vinaigrette', 'portions'),
  ('Caesar Salad', 'Garde Manger', 'Caesar Dressing', 'portions'),
  ('Mashed Potatoes', 'Sauté', 'Mashed Potatoes', 'portions'),
  ('French Fries', 'Fry', 'French Fries', 'portions'),
  ('Chocolate Lava Cake', 'Pastry', 'Chocolate Lava Cake', 'each')
) AS mi(name, station_name, recipe_name, unit)
JOIN stations s ON s.name = mi.station_name
JOIN recipes r ON r.name = mi.recipe_name;

-- Par Levels
INSERT INTO par_levels (menu_item_id, day_of_week, par_quantity)
SELECT m.id, d.dow, d.qty FROM menu_items m
CROSS JOIN (VALUES (0,15),(1,20),(2,20),(3,25),(4,30),(5,35),(6,30)) AS d(dow, qty)
WHERE m.name = 'Grilled Chicken';

INSERT INTO par_levels (menu_item_id, day_of_week, par_quantity)
SELECT m.id, d.dow, d.qty FROM menu_items m
CROSS JOIN (VALUES (0,30),(1,35),(2,35),(3,40),(4,45),(5,50),(6,45)) AS d(dow, qty)
WHERE m.name = 'French Fries';

INSERT INTO par_levels (menu_item_id, day_of_week, par_quantity)
SELECT m.id, d.dow, d.qty FROM menu_items m
CROSS JOIN (VALUES (0,15),(1,20),(2,20),(3,20),(4,25),(5,30),(6,25)) AS d(dow, qty)
WHERE m.name = 'Mashed Potatoes';

-- Sales Records (last 7 days)
INSERT INTO sales_records (menu_item_id, sale_date, quantity_sold)
SELECT m.id, (CURRENT_DATE - d.days_ago)::date, d.qty FROM menu_items m
CROSS JOIN (VALUES (1,18),(2,22),(3,20),(4,28),(5,32),(6,35),(7,26)) AS d(days_ago, qty)
WHERE m.name = 'Grilled Chicken';

INSERT INTO sales_records (menu_item_id, sale_date, quantity_sold)
SELECT m.id, (CURRENT_DATE - d.days_ago)::date, d.qty FROM menu_items m
CROSS JOIN (VALUES (1,28),(2,33),(3,30),(4,38),(5,42),(6,48),(7,40)) AS d(days_ago, qty)
WHERE m.name = 'French Fries';

INSERT INTO sales_records (menu_item_id, sale_date, quantity_sold)
SELECT m.id, (CURRENT_DATE - d.days_ago)::date, d.qty FROM menu_items m
CROSS JOIN (VALUES (1,12),(2,18),(3,16),(4,20),(5,24),(6,28),(7,22)) AS d(days_ago, qty)
WHERE m.name = 'Mashed Potatoes';
