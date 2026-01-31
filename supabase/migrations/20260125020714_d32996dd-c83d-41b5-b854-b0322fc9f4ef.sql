-- Add external_url column to announcements table for linking to external content
ALTER TABLE public.announcements ADD COLUMN external_url text;