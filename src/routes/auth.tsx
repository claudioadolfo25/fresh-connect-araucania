import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nombre },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err?.message ?? "Error de autenticación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Volver al sitio</Link>
        <h1 className="mt-3 text-2xl font-semibold">
          {mode === "signin" ? "Ingresar al Dashboard" : "Crear cuenta"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          PMA SpA · CRM interno de La Araucanía
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <Field label="Nombre">
              <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="input" />
            </Field>
          )}
          <Field label="Email">
            <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </Field>
          <Field label="Contraseña">
            <input required type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {loading ? "Procesando..." : mode === "signin" ? "Ingresar" : "Crear cuenta"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "¿No tienes cuenta? Crear una" : "¿Ya tienes cuenta? Ingresar"}
        </button>
      </div>
      <style>{`.input{width:100%;border:1px solid hsl(var(--border));border-radius:0.5rem;padding:0.6rem 0.75rem;font-size:0.875rem;background:hsl(var(--background));color:hsl(var(--foreground))}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}