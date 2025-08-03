-- SQL commands to fix the authentication and database issues
-- Run these commands in your Supabase SQL Editor

-- 1. Drop the broken trigger that's causing signup failures
DROP TRIGGER IF EXISTS on_new_user ON auth.users;

-- 2. Drop the existing broken function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Create a corrected trigger function that matches the user_profiles table structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    first_name,
    last_name,
    email,
    phone_number,
    plan
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recreate the trigger with the fixed function
CREATE TRIGGER on_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Enable RLS on user_profiles if it was disabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Update existing user profiles to have proper display names in auth.users
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'first_name', up.first_name,
      'last_name', up.last_name,
      'full_name', CONCAT(up.first_name, ' ', up.last_name)
    )
FROM public.user_profiles up
WHERE auth.users.id = up.user_id 
AND (raw_user_meta_data->>'first_name' IS NULL OR raw_user_meta_data->>'first_name' = '');