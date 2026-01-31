-- Add logo_url column to organizations table for organization profile
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS logo_url text;

-- Add member_category column to organization_members for role categorization
ALTER TABLE public.organization_members 
ADD COLUMN IF NOT EXISTS member_category text DEFAULT 'member';

-- Add department column to organization_members for department assignment
ALTER TABLE public.organization_members 
ADD COLUMN IF NOT EXISTS department text;