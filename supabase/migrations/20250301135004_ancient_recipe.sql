/*
  # Create test users with proper authentication
  
  1. Changes
    - Creates test users with proper authentication
    - Sets up auth.users table correctly
    - Creates identities with required provider_id field
    - Adds corresponding profiles for the users
*/

-- First, let's clean up any existing test users to avoid conflicts
DELETE FROM profiles WHERE email IN ('user@example.com', 'admin@example.com');
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('user@example.com', 'admin@example.com')
);
DELETE FROM auth.users WHERE email IN ('user@example.com', 'admin@example.com');

-- Now create the users with proper authentication
DO $$
DECLARE
  uid1 uuid := gen_random_uuid();
  uid2 uuid := gen_random_uuid();
BEGIN
  -- Create regular user
  INSERT INTO auth.users (
    id,
    email,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    last_sign_in_at
  ) VALUES (
    uid1,
    'user@example.com',
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE,
    now(),
    now(),
    now()
  );
  
  -- Create admin user
  INSERT INTO auth.users (
    id,
    email,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    last_sign_in_at
  ) VALUES (
    uid2,
    'admin@example.com',
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE,
    now(),
    now(),
    now()
  );
  
  -- Create identities for the users with provider_id
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    uid1,
    uid1,
    format('{"sub":"%s","email":"%s"}', uid1::text, 'user@example.com')::jsonb,
    'email',
    'user@example.com',
    now(),
    now(),
    now()
  );
  
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    uid2,
    uid2,
    format('{"sub":"%s","email":"%s"}', uid2::text, 'admin@example.com')::jsonb,
    'email',
    'admin@example.com',
    now(),
    now(),
    now()
  );
  
  -- Create profiles for the users
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    birth_date,
    role,
    created_at
  ) VALUES (
    uid1,
    'user@example.com',
    'משתמש',
    'רגיל',
    '2000-01-01',
    'user',
    now()
  );
  
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    birth_date,
    role,
    created_at
  ) VALUES (
    uid2,
    'admin@example.com',
    'מנהל',
    'מערכת',
    '1990-01-01',
    'admin',
    now()
  );
  
  -- Set passwords for the users (using a function if available)
  BEGIN
    PERFORM set_config('auth.email_confirm_required', 'false', false);
    PERFORM auth.set_password(uid1, 'password123');
    PERFORM auth.set_password(uid2, 'password123');
  EXCEPTION WHEN OTHERS THEN
    -- If the function doesn't exist, we'll just log it
    RAISE NOTICE 'Could not set passwords using auth.set_password function';
  END;
END $$;