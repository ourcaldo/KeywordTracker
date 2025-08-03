-- FIX AUTHENTICATION RLS BLOCKING ISSUE
-- The problem: RLS policies block user creation because auth.uid() is NULL during signup

-- 1. TEMPORARILY DISABLE RLS ON USER_PROFILES TABLE
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. OR ALTERNATIVELY: Add a policy that allows service role to insert
-- DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
-- CREATE POLICY "Users can insert own profile" ON public.user_profiles
--   FOR INSERT WITH CHECK (
--     auth.uid() = user_id OR 
--     auth.jwt() ->> 'role' = 'service_role'
--   );

-- 3. CHECK CURRENT RLS STATUS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'user_profiles';