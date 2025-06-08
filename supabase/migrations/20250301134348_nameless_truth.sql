/*
  # Add test users

  1. Changes
    - Creates test user accounts
    - Creates test admin account
    - Adds corresponding profile entries
  
  This migration adds sample user accounts for testing purposes.
*/

-- Create a regular test user
DO $$
BEGIN
  -- Only insert if the user doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@example.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES 
      ('00000000-0000-0000-0000-000000000001', 'user@example.com', 
       '$2a$10$Ql9XZIwKIgIZf.HyhlhKuuCr1eWvHzZ5Qj8zMeWn1QCzPa7ycMJMK', -- password123
       now(), now(), now());
  END IF;

  -- Only insert if the admin doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES 
      ('00000000-0000-0000-0000-000000000002', 'admin@example.com', 
       '$2a$10$Ql9XZIwKIgIZf.HyhlhKuuCr1eWvHzZ5Qj8zMeWn1QCzPa7ycMJMK', -- password123
       now(), now(), now());
  END IF;
END $$;

-- Create profiles for the test users
INSERT INTO profiles (id, email, first_name, last_name, birth_date, role, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'user@example.com', 'משתמש', 'רגיל', '2000-01-01', 'user', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, first_name, last_name, birth_date, role, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'admin@example.com', 'מנהל', 'מערכת', '1990-01-01', 'admin', now())
ON CONFLICT (id) DO NOTHING;