-- Create vi_leads table
CREATE TABLE IF NOT EXISTS public.vi_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    needs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.vi_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can submit the form)
CREATE POLICY "Allow anonymous inserts" ON public.vi_leads
    FOR INSERT
    WITH CHECK (true);

-- Allow admins to read all leads
CREATE POLICY "Allow admins to read leads" ON public.vi_leads
    FOR SELECT
    USING (
      auth.email() IN (
        'assasinghost910@gmail.com',
        'nathanwar03@gmail.com',
        'ryanfernandosilva12@gmail.com'
      )
    );

-- Trigger function to notify admins
CREATE OR REPLACE FUNCTION notify_admins_new_vi_lead()
RETURNS TRIGGER AS $$
DECLARE
    admin_email TEXT;
BEGIN
    FOR admin_email IN 
        SELECT unnest(ARRAY['assasinghost910@gmail.com', 'nathanwar03@gmail.com', 'ryanfernandosilva12@gmail.com'])
    LOOP
        INSERT INTO public.notifications (
            user_email,
            title,
            body,
            type
        ) VALUES (
            admin_email,
            'Novo Lead Capturado pela VI',
            'Nome: ' || NEW.name || ' | Email: ' || NEW.email || ' | Empresa: ' || COALESCE(NEW.company, 'Não informado') || ' | Necessidade: ' || COALESCE(NEW.needs, 'Não informado'),
            'lead'
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_vi_lead_created ON public.vi_leads;
CREATE TRIGGER on_vi_lead_created
    AFTER INSERT ON public.vi_leads
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_new_vi_lead();

-- Create notifications table if it doesn't exist (assuming it already exists, just in case)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: the RLS on notifications should allow users to view their own notifications
-- If it already exists, skipping policy recreation to avoid conflicts unless needed.
