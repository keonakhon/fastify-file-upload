BEGIN;

CREATE SCHEMA IF NOT EXISTS upload;

/* Create Type */
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_type') THEN
    CREATE TYPE app_type AS ENUM ('client', 'dashboard');
  END IF;
END
$$;

/* Create Table */
CREATE TABLE IF NOT EXISTS upload.file (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY, 
  user_id uuid NOT NULL,
  file_name character varying NOT NULL UNIQUE,
  origin_name character varying NOT NULL,
  link character varying NOT NULL,
  /* Size in KB */
  size character(14) NOT NULL,
  /* Dimension in Pixels */
  width character(10) NOT NULL,
  height character(10) NOT NULL,
  app_type app_type NOT NULL,
  object_id uuid NULL,
  track character varying NULL,
  created_at timestamp without time zone DEFAULT now() NOT NULL
);

COMMIT;