-- Create tables for 2FA and device tracking
CREATE TABLE IF NOT EXISTS public.vincere_known_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    last_login_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, device_id)
);

CREATE TABLE IF NOT EXISTS public.vincere_verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vincere_known_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vincere_verification_codes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own devices" 
ON public.vincere_known_devices FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices" 
ON public.vincere_known_devices FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" 
ON public.vincere_known_devices FOR UPDATE 
USING (auth.uid() = user_id);

-- Codes are mostly for system use, but we'll allow users to see their own for verification if needed
-- Though usually verification happens in Edge Function with service role
CREATE POLICY "Users can view their own codes" 
ON public.vincere_verification_codes FOR SELECT 
USING (auth.uid() = user_id);

-- Cleanup function for expired codes
CREATE OR REPLACE FUNCTION delete_expired_verification_codes() 
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.vincere_verification_codes WHERE expires_at < now();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
