
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rut TEXT NOT NULL,
  nombre TEXT NOT NULL,
  rubro TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  comuna TEXT NOT NULL,
  volumen TEXT NOT NULL,
  mensaje TEXT,
  productos JSONB,
  total_estimado NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit quote requests"
  ON public.quote_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
