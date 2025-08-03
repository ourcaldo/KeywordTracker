-- COMPLETE SUPABASE DIAGNOSTIC QUERY
-- Run this in your Supabase SQL Editor to get ALL configuration info

-- 1. ALL RLS POLICIES
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
ORDER BY schemaname, tablename, policyname;

-- 2. ALL TRIGGERS
SELECT 
    trigger_schema,
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY trigger_schema, event_object_table, trigger_name;

-- 3. ALL FUNCTIONS (including trigger functions)
SELECT 
    routine_schema,
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY routine_schema, routine_name;

-- 4. AUTH CONFIGURATION (check if table exists)
SELECT 
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth' 
    AND table_name = 'config';

-- 4b. AUTH SCHEMA TABLES
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_name;

-- 5. TABLE CONSTRAINTS (including foreign keys)
SELECT 
    tc.constraint_name,
    tc.table_schema,
    tc.table_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY tc.table_schema, tc.table_name, tc.constraint_name;

-- 6. USER_PROFILES TABLE STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 7. AUTH.USERS TABLE RLS STATUS AND STRUCTURE
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    tableowner
FROM pg_tables
WHERE schemaname = 'auth'
AND tablename = 'users';

-- 7b. AUTH.USERS COLUMNS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 8. ALL SCHEMAS AND TABLES
SELECT 
    schemaname,
    tablename,
    tableowner,
    rowsecurity
FROM pg_tables
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename;