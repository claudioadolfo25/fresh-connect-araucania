
-- Asigna rol admin a freshkey.b2b@gmail.com si el usuario ya existe.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = 'freshkey.b2b@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Trigger para asignar admin automáticamente si se registra a futuro con ese correo.
CREATE OR REPLACE FUNCTION public.assign_admin_if_freshkey()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'freshkey.b2b@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS assign_admin_if_freshkey_trigger ON auth.users;
CREATE TRIGGER assign_admin_if_freshkey_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_admin_if_freshkey();
