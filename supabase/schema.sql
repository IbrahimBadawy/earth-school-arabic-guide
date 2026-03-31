-- =============================================
-- مدرسة الأرض - Database Schema
-- =============================================

-- Profiles (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher Assignments (slots)
CREATE TABLE IF NOT EXISTS teacher_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
  day TEXT NOT NULL CHECK (day IN ('tuesday', 'thursday')),
  UNIQUE(teacher_id, level, day)
);

-- Scenarios (daily session plans)
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  level INTEGER NOT NULL,
  week INTEGER NOT NULL,
  session INTEGER NOT NULL CHECK (session IN (1, 2)),
  letter TEXT,
  total_duration INTEGER DEFAULT 45,
  blocks JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  target_skill TEXT NOT NULL,
  target_levels INTEGER[] NOT NULL DEFAULT '{1,2,3}',
  duration INTEGER NOT NULL DEFAULT 10,
  group_size TEXT NOT NULL DEFAULT 'المجموعة كاملة',
  materials TEXT[] DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  steps TEXT[] DEFAULT '{}',
  variations TEXT[] DEFAULT '{}',
  differentiation_easier TEXT DEFAULT '',
  differentiation_harder TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Detailed Objectives
CREATE TABLE IF NOT EXISTS detailed_objectives (
  id TEXT PRIMARY KEY,
  level INTEGER NOT NULL,
  domain TEXT NOT NULL,
  objective TEXT NOT NULL,
  measurable TEXT,
  assessment_method TEXT,
  week_introduced INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- General Objectives (stored as JSONB sections)
CREATE TABLE IF NOT EXISTS general_objectives (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unit Calendar Weeks
CREATE TABLE IF NOT EXISTS unit_weeks (
  week_number INTEGER PRIMARY KEY,
  letter TEXT,
  letter_name TEXT,
  theme TEXT,
  session1_focus TEXT,
  session2_focus TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Data
CREATE TABLE IF NOT EXISTS assessment_data (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materials
CREATE TABLE IF NOT EXISTS materials_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tips
CREATE TABLE IF NOT EXISTS tips (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  levels INTEGER[] DEFAULT '{1,2,3}',
  sort_order INTEGER DEFAULT 0
);

-- FAQ
CREATE TABLE IF NOT EXISTS faq (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Levels info
CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age_range TEXT,
  children_count INTEGER,
  color TEXT,
  color_light TEXT,
  icon TEXT,
  description TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  letters TEXT[] DEFAULT '{}',
  session_pattern JSONB,
  composition TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE detailed_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: users can read own, admin can read/write all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (id = auth.uid() OR is_admin());
CREATE POLICY "Admin can insert profiles" ON profiles FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin can update profiles" ON profiles FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admin can delete profiles" ON profiles FOR DELETE TO authenticated USING (is_admin());

-- Assignments: teachers see own, admin sees all
CREATE POLICY "Read own or admin" ON teacher_assignments FOR SELECT TO authenticated USING (teacher_id = auth.uid() OR is_admin());
CREATE POLICY "Admin manages assignments" ON teacher_assignments FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admin updates assignments" ON teacher_assignments FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admin deletes assignments" ON teacher_assignments FOR DELETE TO authenticated USING (is_admin());

-- Content tables: everyone reads, admin writes
-- (Apply same pattern to all content tables)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'scenarios', 'activities', 'detailed_objectives', 'general_objectives',
    'unit_weeks', 'assessment_data', 'materials_categories', 'tips', 'faq', 'levels'
  ])
  LOOP
    EXECUTE format('CREATE POLICY "Anyone can read %I" ON %I FOR SELECT TO authenticated USING (true)', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin can insert %I" ON %I FOR INSERT TO authenticated WITH CHECK (is_admin())', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin can update %I" ON %I FOR UPDATE TO authenticated USING (is_admin())', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin can delete %I" ON %I FOR DELETE TO authenticated USING (is_admin())', tbl, tbl);
  END LOOP;
END $$;

-- NOTE: No auto-create trigger. Profiles are created manually via service_role key
-- when admin creates a user through the admin panel.

-- Drop trigger if it exists (from previous schema versions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
