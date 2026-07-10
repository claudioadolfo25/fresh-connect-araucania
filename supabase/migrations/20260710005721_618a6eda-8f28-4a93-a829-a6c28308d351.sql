
-- Tighten inserts
DROP POLICY IF EXISTS "clientes_insert_auth" ON public.clientes;
CREATE POLICY "clientes_insert_own" ON public.clientes FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "contactos_insert_auth" ON public.contactos;
CREATE POLICY "contactos_insert_own" ON public.contactos FOR INSERT TO authenticated
  WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "tareas_insert_auth" ON public.tareas_rutas;
CREATE POLICY "tareas_insert_own_or_admin" ON public.tareas_rutas FOR INSERT TO authenticated
  WITH CHECK (usuario_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
