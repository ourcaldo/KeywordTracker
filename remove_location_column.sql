-- SQL queries to remove the location column from sites table
-- Run these commands in your Supabase SQL Editor

-- First, check if the location column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sites' 
AND column_name = 'location';

-- Remove the location column from the sites table
ALTER TABLE public.sites DROP COLUMN IF EXISTS location;

-- Verify the column has been removed
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sites' 
ORDER BY ordinal_position;