-- =====================================================
-- Keyword Tracker Database Schema
-- =====================================================
-- Run these SQL commands in your Supabase SQL Editor
-- to set up the complete database structure with proper
-- cross-references and security policies.

-- =====================================================
-- 1. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on auth.users (if not already enabled)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. CREATE ENUMS
-- =====================================================

-- User plan types
CREATE TYPE user_plan AS ENUM ('free', 'basic', 'pro', 'enterprise');

-- Device types for ranking checks
CREATE TYPE device_type AS ENUM ('mobile', 'desktop');

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    plan user_plan NOT NULL DEFAULT 'free',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one profile per user
    UNIQUE(user_id)
);

-- Workspaces table
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT workspace_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- Sites table
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'US',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT site_domain_format CHECK (domain ~* '^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$'),
    CONSTRAINT site_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    
    -- Unique domain per workspace
    UNIQUE(workspace_id, domain)
);

-- Keywords table
CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    target_url TEXT,
    volume INTEGER CHECK (volume >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT keyword_length CHECK (char_length(keyword) >= 1 AND char_length(keyword) <= 200),
    
    -- Unique keyword per site
    UNIQUE(site_id, keyword)
);

-- Keyword rankings table
CREATE TABLE keyword_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword_id UUID NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    position INTEGER CHECK (position >= 1 AND position <= 100),
    device device_type NOT NULL DEFAULT 'desktop',
    location TEXT NOT NULL DEFAULT 'US',
    recorded_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Index for fast lookups
    UNIQUE(keyword_id, device, location, recorded_at)
);

-- =====================================================
-- 4. CREATE INDEXES
-- =====================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Workspaces indexes
CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX idx_workspaces_created_at ON workspaces(created_at DESC);

-- Sites indexes
CREATE INDEX idx_sites_workspace_id ON sites(workspace_id);
CREATE INDEX idx_sites_user_id ON sites(user_id);
CREATE INDEX idx_sites_domain ON sites(domain);

-- Keywords indexes
CREATE INDEX idx_keywords_site_id ON keywords(site_id);
CREATE INDEX idx_keywords_workspace_id ON keywords(workspace_id);
CREATE INDEX idx_keywords_user_id ON keywords(user_id);
CREATE INDEX idx_keywords_keyword ON keywords(keyword);

-- Keyword rankings indexes
CREATE INDEX idx_keyword_rankings_keyword_id ON keyword_rankings(keyword_id);
CREATE INDEX idx_keyword_rankings_site_id ON keyword_rankings(site_id);
CREATE INDEX idx_keyword_rankings_workspace_id ON keyword_rankings(workspace_id);
CREATE INDEX idx_keyword_rankings_user_id ON keyword_rankings(user_id);
CREATE INDEX idx_keyword_rankings_recorded_at ON keyword_rankings(recorded_at DESC);
CREATE INDEX idx_keyword_rankings_position ON keyword_rankings(position);
CREATE INDEX idx_keyword_rankings_device_location ON keyword_rankings(device, location);

-- =====================================================
-- 5. CREATE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to validate workspace/site relationship in keywords
CREATE OR REPLACE FUNCTION validate_keyword_references()
RETURNS TRIGGER AS $$
DECLARE
    site_workspace_id UUID;
    site_user_id UUID;
BEGIN
    -- Get the workspace_id and user_id from the site
    SELECT workspace_id, user_id INTO site_workspace_id, site_user_id
    FROM sites 
    WHERE id = NEW.site_id;
    
    -- Ensure the workspace_id and user_id match
    IF site_workspace_id != NEW.workspace_id OR site_user_id != NEW.user_id THEN
        RAISE EXCEPTION 'Keyword references do not match site ownership';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to validate ranking references
CREATE OR REPLACE FUNCTION validate_ranking_references()
RETURNS TRIGGER AS $$
DECLARE
    keyword_site_id UUID;
    keyword_workspace_id UUID;
    keyword_user_id UUID;
BEGIN
    -- Get references from the keyword
    SELECT site_id, workspace_id, user_id 
    INTO keyword_site_id, keyword_workspace_id, keyword_user_id
    FROM keywords 
    WHERE id = NEW.keyword_id;
    
    -- Ensure all references match
    IF keyword_site_id != NEW.site_id OR 
       keyword_workspace_id != NEW.workspace_id OR 
       keyword_user_id != NEW.user_id THEN
        RAISE EXCEPTION 'Ranking references do not match keyword ownership';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 6. CREATE TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at 
    BEFORE UPDATE ON workspaces 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at 
    BEFORE UPDATE ON sites 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keywords_updated_at 
    BEFORE UPDATE ON keywords 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Validate references
CREATE TRIGGER validate_keyword_references_trigger
    BEFORE INSERT OR UPDATE ON keywords
    FOR EACH ROW EXECUTE FUNCTION validate_keyword_references();

CREATE TRIGGER validate_ranking_references_trigger
    BEFORE INSERT OR UPDATE ON keyword_rankings
    FOR EACH ROW EXECUTE FUNCTION validate_ranking_references();

-- =====================================================
-- 7. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- User profiles policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Workspaces policies
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workspaces" ON workspaces
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create workspaces" ON workspaces
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workspaces" ON workspaces
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspaces" ON workspaces
    FOR DELETE USING (auth.uid() = user_id);

-- Sites policies
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sites" ON sites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sites in own workspaces" ON sites
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (SELECT 1 FROM workspaces WHERE id = workspace_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can update own sites" ON sites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON sites
    FOR DELETE USING (auth.uid() = user_id);

-- Keywords policies
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own keywords" ON keywords
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create keywords in own sites" ON keywords
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (SELECT 1 FROM sites WHERE id = site_id AND user_id = auth.uid()) AND
        EXISTS (SELECT 1 FROM workspaces WHERE id = workspace_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can update own keywords" ON keywords
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own keywords" ON keywords
    FOR DELETE USING (auth.uid() = user_id);

-- Keyword rankings policies
ALTER TABLE keyword_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rankings" ON keyword_rankings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create rankings for own keywords" ON keyword_rankings
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (SELECT 1 FROM keywords WHERE id = keyword_id AND user_id = auth.uid()) AND
        EXISTS (SELECT 1 FROM sites WHERE id = site_id AND user_id = auth.uid()) AND
        EXISTS (SELECT 1 FROM workspaces WHERE id = workspace_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can update own rankings" ON keyword_rankings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rankings" ON keyword_rankings
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 8. CREATE VIEWS FOR EASIER QUERIES
-- =====================================================

-- View for keywords with latest rankings
CREATE VIEW keywords_with_latest_rankings AS
SELECT 
    k.*,
    lr.position as latest_position,
    lr.device as latest_device,
    lr.location as latest_location,
    lr.recorded_at as latest_recorded_at
FROM keywords k
LEFT JOIN LATERAL (
    SELECT position, device, location, recorded_at
    FROM keyword_rankings kr
    WHERE kr.keyword_id = k.id
    ORDER BY recorded_at DESC, created_at DESC
    LIMIT 1
) lr ON true;

-- View for workspace stats
CREATE VIEW workspace_stats AS
SELECT 
    w.id,
    w.name,
    w.user_id,
    COUNT(DISTINCT s.id) as sites_count,
    COUNT(DISTINCT k.id) as keywords_count,
    COUNT(DISTINCT kr.id) as rankings_count
FROM workspaces w
LEFT JOIN sites s ON s.workspace_id = w.id
LEFT JOIN keywords k ON k.workspace_id = w.id
LEFT JOIN keyword_rankings kr ON kr.workspace_id = w.id
GROUP BY w.id, w.name, w.user_id;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Your database is now ready! The schema includes:
-- ✅ All tables with proper cross-references
-- ✅ Row-level security policies
-- ✅ Indexes for performance
-- ✅ Validation functions and triggers
-- ✅ Helpful views for queries
-- ✅ Auto user profile creation on signup