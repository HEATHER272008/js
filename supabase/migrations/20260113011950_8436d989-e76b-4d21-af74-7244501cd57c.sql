-- Create admin requests table
CREATE TABLE public.admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a request (public form)
CREATE POLICY "Anyone can submit admin request"
ON public.admin_requests
FOR INSERT
WITH CHECK (true);

-- Only admins can view all requests
CREATE POLICY "Admins can view all requests"
ON public.admin_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update requests
CREATE POLICY "Admins can update requests"
ON public.admin_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete requests
CREATE POLICY "Admins can delete requests"
ON public.admin_requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));