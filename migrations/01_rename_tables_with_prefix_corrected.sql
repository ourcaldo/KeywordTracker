-- Migration: Add "tb" prefix to existing tables only (workspace_stats doesn't exist)
-- Date: 2025-08-04
-- Purpose: Restructure database with consistent naming convention

-- Step 1: Rename existing tables with "tb" prefix (only tables that exist)

-- User Collection
ALTER TABLE user_profiles RENAME TO tb_user_profiles;

-- Workspace Collection  
ALTER TABLE workspaces RENAME TO tb_workspaces;

-- Sites Collection
ALTER TABLE sites RENAME TO tb_sites;

-- Keywords Collection
ALTER TABLE keywords RENAME TO tb_keywords;
ALTER TABLE keyword_rankings RENAME TO tb_keyword_rankings;

-- Step 2: Update foreign key constraints automatically handled

-- Step 3: Recreate the view with new table names
DROP VIEW IF EXISTS keywords_with_latest_rankings;

CREATE OR REPLACE VIEW tb_keywords_with_latest_rankings AS
SELECT 
  k.*,
  lr.latest_position,
  lr.latest_device,
  lr.latest_location,
  lr.latest_recorded_at
FROM tb_keywords k
LEFT JOIN (
  SELECT DISTINCT ON (keyword_id)
    keyword_id,
    position as latest_position,
    device as latest_device,
    location as latest_location,
    recorded_at as latest_recorded_at
  FROM tb_keyword_rankings
  ORDER BY keyword_id, recorded_at DESC
) lr ON k.id = lr.keyword_id;

-- Step 4: Add table comments
COMMENT ON TABLE tb_user_profiles IS 'User Collection: User account profiles and settings';
COMMENT ON TABLE tb_workspaces IS 'Workspace Collection: Project containers for organizing SEO campaigns';
COMMENT ON TABLE tb_sites IS 'Sites Collection: Domain websites within workspaces';
COMMENT ON TABLE tb_keywords IS 'Keywords Collection: Keywords to track for each site';
COMMENT ON TABLE tb_keyword_rankings IS 'Keywords Collection: Historical ranking data for keywords';
COMMENT ON VIEW tb_keywords_with_latest_rankings IS 'Keywords Collection: View combining keywords with latest ranking data';