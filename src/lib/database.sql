-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sites table
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  keyword TEXT NOT NULL,
  location TEXT DEFAULT 'United States',
  device TEXT DEFAULT 'desktop' CHECK (device IN ('desktop', 'mobile')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, keyword, location, device)
);

-- Create keyword_positions table for daily tracking
CREATE TABLE IF NOT EXISTS keyword_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE NOT NULL,
  position INTEGER,
  search_engine TEXT DEFAULT 'google' CHECK (search_engine IN ('google', 'bing', 'yahoo')),
  tracked_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(keyword_id, search_engine, tracked_date)
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_positions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for workspaces
CREATE POLICY "Users can view own workspaces" ON workspaces
  FOR SELECT USING (user_id IN (SELECT user_id FROM user_profiles WHERE auth.uid() = user_id));

CREATE POLICY "Users can insert own workspaces" ON workspaces
  FOR INSERT WITH CHECK (user_id IN (SELECT user_id FROM user_profiles WHERE auth.uid() = user_id));

CREATE POLICY "Users can update own workspaces" ON workspaces
  FOR UPDATE USING (user_id IN (SELECT user_id FROM user_profiles WHERE auth.uid() = user_id));

CREATE POLICY "Users can delete own workspaces" ON workspaces
  FOR DELETE USING (user_id IN (SELECT user_id FROM user_profiles WHERE auth.uid() = user_id));

-- Create RLS policies for sites
CREATE POLICY "Users can view own sites" ON sites
  FOR SELECT USING (workspace_id IN (
    SELECT id FROM workspaces WHERE user_id IN (
      SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
    )
  ));

CREATE POLICY "Users can insert own sites" ON sites
  FOR INSERT WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE user_id IN (
      SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
    )
  ));

CREATE POLICY "Users can update own sites" ON sites
  FOR UPDATE USING (workspace_id IN (
    SELECT id FROM workspaces WHERE user_id IN (
      SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
    )
  ));

CREATE POLICY "Users can delete own sites" ON sites
  FOR DELETE USING (workspace_id IN (
    SELECT id FROM workspaces WHERE user_id IN (
      SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
    )
  ));

-- Create RLS policies for keywords
CREATE POLICY "Users can view own keywords" ON keywords
  FOR SELECT USING (site_id IN (
    SELECT id FROM sites WHERE workspace_id IN (
      SELECT id FROM workspaces WHERE user_id IN (
        SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
      )
    )
  ));

CREATE POLICY "Users can insert own keywords" ON keywords
  FOR INSERT WITH CHECK (site_id IN (
    SELECT id FROM sites WHERE workspace_id IN (
      SELECT id FROM workspaces WHERE user_id IN (
        SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
      )
    )
  ));

CREATE POLICY "Users can update own keywords" ON keywords
  FOR UPDATE USING (site_id IN (
    SELECT id FROM sites WHERE workspace_id IN (
      SELECT id FROM workspaces WHERE user_id IN (
        SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
      )
    )
  ));

CREATE POLICY "Users can delete own keywords" ON keywords
  FOR DELETE USING (site_id IN (
    SELECT id FROM sites WHERE workspace_id IN (
      SELECT id FROM workspaces WHERE user_id IN (
        SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
      )
    )
  ));

-- Create RLS policies for keyword_positions
CREATE POLICY "Users can view own keyword positions" ON keyword_positions
  FOR SELECT USING (keyword_id IN (
    SELECT id FROM keywords WHERE site_id IN (
      SELECT id FROM sites WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE user_id IN (
          SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
        )
      )
    )
  ));

CREATE POLICY "Users can insert own keyword positions" ON keyword_positions
  FOR INSERT WITH CHECK (keyword_id IN (
    SELECT id FROM keywords WHERE site_id IN (
      SELECT id FROM sites WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE user_id IN (
          SELECT user_id FROM user_profiles WHERE auth.uid() = user_id
        )
      )
    )
  ));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_workspace_id ON sites(workspace_id);
CREATE INDEX IF NOT EXISTS idx_keywords_site_id ON keywords(site_id);
CREATE INDEX IF NOT EXISTS idx_keyword_positions_keyword_id ON keyword_positions(keyword_id);
CREATE INDEX IF NOT EXISTS idx_keyword_positions_date ON keyword_positions(tracked_date);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Create default workspace
  INSERT INTO public.workspaces (user_id, name, description)
  VALUES (NEW.id, 'My Workspace', 'Default workspace for keyword tracking');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();