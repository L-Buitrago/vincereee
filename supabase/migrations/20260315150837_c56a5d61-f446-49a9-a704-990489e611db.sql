
-- Fix function search path for notify_admins_on_new_message
CREATE OR REPLACE FUNCTION public.notify_admins_on_new_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    IF NEW.is_admin = false THEN
        INSERT INTO public.notifications (user_email, title, body, type)
        VALUES 
            ('assasinghost910@gmail.com', 'Novo Suporte', 'Nova mensagem de: ' || NEW.sender_name, 'new_message'),
            ('nathanwar03@gmail.com', 'Novo Suporte', 'Nova mensagem de: ' || NEW.sender_name, 'new_message'),
            ('ryanfernandosilva12@gmail.com', 'Novo Suporte', 'Nova mensagem de: ' || NEW.sender_name, 'new_message');
    END IF;
    RETURN NEW;
END;
$function$;
