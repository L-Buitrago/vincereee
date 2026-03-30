-- Migration to notify admins when a new custom quote is submitted

CREATE OR REPLACE FUNCTION notify_admins_new_quote()
RETURNS TRIGGER AS $$
DECLARE
    admin_email TEXT;
    client_name TEXT;
    client_email TEXT;
BEGIN
    -- Get client name from profiles
    SELECT COALESCE(full_name, 'Cliente') INTO client_name 
    FROM public.profiles 
    WHERE user_id = NEW.user_id 
    LIMIT 1;

    -- Get client email from auth.users
    SELECT email INTO client_email 
    FROM auth.users 
    WHERE id = NEW.user_id 
    LIMIT 1;

    -- Add a fallback if email is not found
    IF client_email IS NULL THEN
        client_email := 'Email não disponível';
    END IF;

    -- Insert notifications for the 3 admins
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
            'Novo Projeto Personalizado Recebido! 🚀',
            'Nova solicitação de: ' || client_name || ' (' || client_email || '). Serviço: ' || NEW.service_type || '.',
            'quote'
        );
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_quote_created ON public.quotes;

-- Create the trigger
CREATE TRIGGER on_quote_created
    AFTER INSERT ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_new_quote();
