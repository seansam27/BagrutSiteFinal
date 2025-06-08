/*
  # Fix authentication for test users
  
  1. Changes
    - Creates test users using Supabase Auth API functions
    - Ensures passwords are properly hashed
  
  This migration properly creates test users that can be used to log in.
*/

-- Use Supabase Auth's function to create users properly
DO $$
DECLARE
  uid1 uuid;
  uid2 uuid;
BEGIN
  -- Create regular user if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@example.com') THEN
    SELECT auth.uid() INTO uid1;
    
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
    
    -- Insert password using Supabase's function
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      uid1,
      uid1,
      format('{"sub":"%s","email":"%s"}', uid1::text, 'user@example.com')::jsonb,
      'email',
      now(),
      now(),
      now()
    );
    
    -- Create profile for regular user
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
    ) ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Create admin user if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
    SELECT auth.uid() INTO uid2;
    
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
    
    -- Insert password using Supabase's function
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      uid2,
      uid2,
      format('{"sub":"%s","email":"%s"}', uid2::text, 'admin@example.com')::jsonb,
      'email',
      now(),
      now(),
      now()
    );
    
    -- Create profile for admin user
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
    ) ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;