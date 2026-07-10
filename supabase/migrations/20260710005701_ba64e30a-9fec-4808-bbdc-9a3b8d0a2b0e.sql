
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'vendedor');

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_read_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Admin policies on user_roles / profiles
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razon_social TEXT NOT NULL,
  nombre_fantasia TEXT,
  rubro TEXT NOT NULL,
  comuna TEXT NOT NULL,
  macrosector TEXT,
  direccion TEXT,
  telefono TEXT,
  email TEXT,
  volumen_estimado_semanal TEXT,
  productos_clave TEXT,
  indice_kizuna INTEGER DEFAULT 0 CHECK (indice_kizuna BETWEEN 0 AND 100),
  estado TEXT NOT NULL DEFAULT 'Prospecto',
  fuente TEXT,
  vendedor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clientes_select_auth" ON public.clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "clientes_insert_auth" ON public.clientes FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "clientes_update_own_or_admin" ON public.clientes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR vendedor_id = auth.uid() OR created_by = auth.uid())
  WITH CHECK (public.has_role(auth.uid(),'admin') OR vendedor_id = auth.uid() OR created_by = auth.uid());
CREATE POLICY "clientes_delete_admin" ON public.clientes FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_clientes_updated BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_clientes_comuna ON public.clientes(comuna);
CREATE INDEX idx_clientes_rubro ON public.clientes(rubro);
CREATE INDEX idx_clientes_estado ON public.clientes(estado);

-- contactos
CREATE TABLE public.contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
  canal TEXT NOT NULL,
  nota TEXT,
  tipo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contactos TO authenticated;
GRANT ALL ON public.contactos TO service_role;
ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contactos_select_auth" ON public.contactos FOR SELECT TO authenticated USING (true);
CREATE POLICY "contactos_insert_auth" ON public.contactos FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "contactos_update_own_or_admin" ON public.contactos FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR usuario_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(),'admin') OR usuario_id = auth.uid());
CREATE POLICY "contactos_delete_admin" ON public.contactos FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_contactos_cliente ON public.contactos(cliente_id);

-- tareas_rutas
CREATE TABLE public.tareas_rutas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fecha_programada DATE NOT NULL,
  tipo TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  comentarios TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tareas_rutas TO authenticated;
GRANT ALL ON public.tareas_rutas TO service_role;
ALTER TABLE public.tareas_rutas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tareas_select_auth" ON public.tareas_rutas FOR SELECT TO authenticated USING (true);
CREATE POLICY "tareas_insert_auth" ON public.tareas_rutas FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tareas_update_own_or_admin" ON public.tareas_rutas FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR usuario_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(),'admin') OR usuario_id = auth.uid());
CREATE POLICY "tareas_delete_admin" ON public.tareas_rutas FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_tareas_updated BEFORE UPDATE ON public.tareas_rutas FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_tareas_fecha ON public.tareas_rutas(fecha_programada);
CREATE INDEX idx_tareas_estado ON public.tareas_rutas(estado);
