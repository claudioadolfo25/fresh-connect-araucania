import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

type Cliente = {
  id: string;
  razon_social: string;
  nombre_fantasia: string | null;
  rubro: string;
  comuna: string;
  macrosector: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  volumen_estimado_semanal: string | null;
  productos_clave: string | null;
  indice_kizuna: number | null;
  estado: string;
  fuente: string | null;
  vendedor_id: string | null;
  created_by: string | null;
  created_at: string;
};
type Contacto = {
  id: string; cliente_id: string; usuario_id: string | null; fecha: string;
  canal: string; nota: string | null; tipo: string | null;
};
type Tarea = {
  id: string; cliente_id: string; usuario_id: string | null;
  fecha_programada: string; tipo: string; estado: string; comentarios: string | null;
};

const RUBROS = ["Supermercado","Restaurante","Hotel","Casino","Cafetería","Juguería","Minimarket","Verdulería","Exportador","Otro"];
const MACROSECTORES = ["El Carmen","San Ramón","Amanecer","Metrenco","Cajón/Vilcún","Labranza–Pedro de Valdivia","Otra"];
const VOLUMENES = ["<100 kg","100–500 kg","500–1.000 kg",">1.000 kg"];
const ESTADOS = ["Prospecto","Activo","Inactivo","Perdido"] as const;
const FUENTES = ["Web co-kizuna","WhatsApp","Cámara Comercio","Referencia","Otro"];
const CANALES = ["Visita","Llamada","WhatsApp","Email"];
const TIPOS_CONTACTO = ["Primer contacto","Seguimiento","Reclamo","Cotización","Cierre","Otro"];
const TIPOS_TAREA = ["Visita","Llamada","Cotización","Auditoría en sala"];
const ESTADOS_TAREA = ["Pendiente","En curso","Completada","Reprogramada"];

function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"resumen" | "clientes" | "tareas">("resumen");
  const [userEmail, setUserEmail] = useState<string>("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [showNew, setShowNew] = useState(false);

  async function refresh() {
    setLoading(true);
    const [c, t, co] = await Promise.all([
      supabase.from("clientes").select("*").order("created_at", { ascending: false }),
      supabase.from("tareas_rutas").select("*").order("fecha_programada", { ascending: true }),
      supabase.from("contactos").select("*").order("fecha", { ascending: false }),
    ]);
    if (!c.error && c.data) setClientes(c.data as Cliente[]);
    if (!t.error && t.data) setTareas(t.data as Tarea[]);
    if (!co.error && co.data) setContactos(co.data as Contacto[]);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? ""));
    refresh();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const activos = clientes.filter((c) => c.estado === "Activo").length;
  const prospectos = clientes.filter((c) => c.estado === "Prospecto").length;
  const perdidos = clientes.filter((c) => c.estado === "Perdido").length;
  const hoy = new Date().toISOString().slice(0, 10);
  const tareasHoy = tareas.filter((t) => t.fecha_programada === hoy && t.estado !== "Completada").length;
  const tareasAtrasadas = tareas.filter((t) => t.fecha_programada < hoy && t.estado !== "Completada").length;

  const porRubro = useMemo(() => group(clientes, (c) => c.rubro), [clientes]);
  const porComuna = useMemo(() => group(clientes, (c) => c.comuna), [clientes]);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="PMA" className="h-9 w-9 rounded-full object-contain bg-white p-0.5 border border-border" />
            <div className="text-sm">
              <div className="font-semibold leading-tight">PMA SpA · CRM</div>
              <div className="text-xs text-muted-foreground leading-tight">La Araucanía · Kizuna</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {(["resumen","clientes","tareas"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                {t}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden md:inline text-muted-foreground">{userEmail}</span>
            <button onClick={signOut} className="rounded-full border border-border px-3 py-1.5 hover:bg-muted">Salir</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}

        {tab === "resumen" && (
          <section className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Metric label="Clientes activos" value={activos} tone="green" />
              <Metric label="Prospectos" value={prospectos} tone="blue" />
              <Metric label="Perdidos" value={perdidos} tone="gray" />
              <Metric label="Tareas hoy" value={tareasHoy} tone="amber" />
              <Metric label="Tareas atrasadas" value={tareasAtrasadas} tone="red" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card title="Clientes por rubro">
                <BarList data={porRubro} />
              </Card>
              <Card title="Top 10 comunas">
                <BarList data={porComuna.slice(0, 10)} />
              </Card>
            </div>
            <Card title="Próximas tareas">
              <TareasTable tareas={tareas.filter((t) => t.estado !== "Completada").slice(0, 10)} clientes={clientes} onChange={refresh} />
            </Card>
          </section>
        )}

        {tab === "clientes" && (
          <ClientesTab
            clientes={clientes}
            contactos={contactos}
            tareas={tareas}
            selected={selected}
            setSelected={setSelected}
            showNew={showNew}
            setShowNew={setShowNew}
            refresh={refresh}
          />
        )}

        {tab === "tareas" && (
          <Card title="Agenda de tareas y rutas">
            <TareasTable tareas={tareas} clientes={clientes} onChange={refresh} full />
          </Card>
        )}
      </main>
    </div>
  );
}

function group(arr: Cliente[], key: (c: Cliente) => string): { k: string; n: number }[] {
  const m = new Map<string, number>();
  for (const c of arr) m.set(key(c), (m.get(key(c)) ?? 0) + 1);
  return [...m.entries()].map(([k, n]) => ({ k, n })).sort((a, b) => b.n - a.n);
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "green" | "blue" | "amber" | "red" | "gray" }) {
  const tones: Record<string, string> = {
    green: "bg-emerald-50 border-emerald-200 text-emerald-900",
    blue: "bg-sky-50 border-sky-200 text-sky-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
    red: "bg-rose-50 border-rose-200 text-rose-900",
    gray: "bg-muted border-border text-foreground",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="text-xs opacity-70">{label}</div>
      <div className="mt-1 text-3xl font-semibold">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

function BarList({ data }: { data: { k: string; n: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  if (data.length === 0) return <p className="text-sm text-muted-foreground">Sin datos aún.</p>;
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.k} className="flex items-center gap-3 text-sm">
          <div className="w-40 truncate text-muted-foreground">{d.k}</div>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(d.n / max) * 100}%` }} />
          </div>
          <div className="w-8 text-right font-semibold">{d.n}</div>
        </div>
      ))}
    </div>
  );
}

function TareasTable({ tareas, clientes, onChange, full = false }: { tareas: Tarea[]; clientes: Cliente[]; onChange: () => void; full?: boolean }) {
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const filtered = filtroEstado ? tareas.filter((t) => t.estado === filtroEstado) : tareas;
  if (tareas.length === 0) return <p className="text-sm text-muted-foreground">Sin tareas.</p>;

  async function toggleComplete(t: Tarea) {
    const nuevo = t.estado === "Completada" ? "Pendiente" : "Completada";
    await supabase.from("tareas_rutas").update({ estado: nuevo }).eq("id", t.id);
    onChange();
  }

  return (
    <div>
      {full && (
        <div className="mb-3 flex gap-2 text-xs">
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1">
            <option value="">Todos los estados</option>
            {ESTADOS_TAREA.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 pr-3">Fecha</th>
              <th className="py-2 pr-3">Cliente</th>
              <th className="py-2 pr-3">Comuna</th>
              <th className="py-2 pr-3">Tipo</th>
              <th className="py-2 pr-3">Estado</th>
              <th className="py-2 pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const c = clientes.find((x) => x.id === t.cliente_id);
              return (
                <tr key={t.id} className="border-b border-border/50">
                  <td className="py-2 pr-3 whitespace-nowrap">{t.fecha_programada}</td>
                  <td className="py-2 pr-3 font-medium">{c?.razon_social ?? "—"}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{c?.comuna ?? "—"}</td>
                  <td className="py-2 pr-3">{t.tipo}</td>
                  <td className="py-2 pr-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${t.estado === "Completada" ? "bg-emerald-100 text-emerald-800" : t.estado === "Pendiente" ? "bg-amber-100 text-amber-800" : "bg-muted"}`}>{t.estado}</span>
                  </td>
                  <td className="py-2 pr-3">
                    <button onClick={() => toggleComplete(t)} className="text-xs text-primary hover:underline">
                      {t.estado === "Completada" ? "Reabrir" : "Completar"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientesTab({ clientes, contactos, tareas, selected, setSelected, showNew, setShowNew, refresh }: {
  clientes: Cliente[]; contactos: Contacto[]; tareas: Tarea[];
  selected: Cliente | null; setSelected: (c: Cliente | null) => void;
  showNew: boolean; setShowNew: (b: boolean) => void;
  refresh: () => void;
}) {
  const [fRubro, setFRubro] = useState("");
  const [fComuna, setFComuna] = useState("");
  const [fEstado, setFEstado] = useState("");
  const [q, setQ] = useState("");

  const filtered = clientes.filter((c) =>
    (!fRubro || c.rubro === fRubro) &&
    (!fComuna || c.comuna.toLowerCase().includes(fComuna.toLowerCase())) &&
    (!fEstado || c.estado === fEstado) &&
    (!q || c.razon_social.toLowerCase().includes(q.toLowerCase()) || (c.nombre_fantasia ?? "").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
        <select value={fRubro} onChange={(e) => setFRubro(e.target.value)} className="rounded-md border border-border bg-background px-2 py-2 text-sm">
          <option value="">Rubro (todos)</option>
          {RUBROS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <input placeholder="Comuna" value={fComuna} onChange={(e) => setFComuna(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm w-32" />
        <select value={fEstado} onChange={(e) => setFEstado(e.target.value)} className="rounded-md border border-border bg-background px-2 py-2 text-sm">
          <option value="">Estado (todos)</option>
          {ESTADOS.map((e) => <option key={e}>{e}</option>)}
        </select>
        <div className="ml-auto" />
        <button onClick={() => setShowNew(true)} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          + Nuevo cliente
        </button>
      </div>

      <Card title={`Clientes (${filtered.length})`}>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin resultados. Crea el primer cliente con “+ Nuevo cliente”.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-2 pr-3">Razón social</th>
                  <th className="py-2 pr-3">Rubro</th>
                  <th className="py-2 pr-3">Comuna</th>
                  <th className="py-2 pr-3">Estado</th>
                  <th className="py-2 pr-3">Kizuna</th>
                  <th className="py-2 pr-3">Volumen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer border-b border-border/50 hover:bg-muted/40">
                    <td className="py-2 pr-3 font-medium">{c.razon_social}{c.nombre_fantasia && <span className="text-muted-foreground"> · {c.nombre_fantasia}</span>}</td>
                    <td className="py-2 pr-3">{c.rubro}</td>
                    <td className="py-2 pr-3">{c.comuna}</td>
                    <td className="py-2 pr-3">{c.estado}</td>
                    <td className="py-2 pr-3">{c.indice_kizuna ?? 0}</td>
                    <td className="py-2 pr-3">{c.volumen_estimado_semanal ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showNew && <ClienteForm onClose={() => setShowNew(false)} onSaved={() => { setShowNew(false); refresh(); }} />}
      {selected && (
        <ClienteDetail
          cliente={selected}
          contactos={contactos.filter((x) => x.cliente_id === selected.id)}
          tareas={tareas.filter((x) => x.cliente_id === selected.id)}
          onClose={() => setSelected(null)}
          onChange={() => { refresh(); }}
        />
      )}
    </div>
  );
}

function ClienteForm({ onClose, onSaved, cliente }: { onClose: () => void; onSaved: () => void; cliente?: Cliente }) {
  const [f, setF] = useState({
    razon_social: cliente?.razon_social ?? "",
    nombre_fantasia: cliente?.nombre_fantasia ?? "",
    rubro: cliente?.rubro ?? RUBROS[0],
    comuna: cliente?.comuna ?? "",
    macrosector: cliente?.macrosector ?? "",
    direccion: cliente?.direccion ?? "",
    telefono: cliente?.telefono ?? "",
    email: cliente?.email ?? "",
    volumen_estimado_semanal: cliente?.volumen_estimado_semanal ?? VOLUMENES[0],
    productos_clave: cliente?.productos_clave ?? "",
    indice_kizuna: cliente?.indice_kizuna ?? 0,
    estado: cliente?.estado ?? "Prospecto",
    fuente: cliente?.fuente ?? FUENTES[0],
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setErr(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setErr("Sesión expirada"); setSaving(false); return; }
    const payload: any = { ...f, indice_kizuna: Number(f.indice_kizuna) };
    if (cliente) {
      const { error } = await supabase.from("clientes").update(payload).eq("id", cliente.id);
      if (error) { setErr(error.message); setSaving(false); return; }
    } else {
      payload.created_by = u.user.id;
      payload.vendedor_id = u.user.id;
      const { error } = await supabase.from("clientes").insert(payload);
      if (error) { setErr(error.message); setSaving(false); return; }
    }
    setSaving(false);
    onSaved();
  }

  return (
    <Modal onClose={onClose} title={cliente ? "Editar cliente" : "Nuevo cliente"}>
      <form onSubmit={save} className="grid gap-3 md:grid-cols-2">
        <Fld label="Razón social *"><input required className="inp" value={f.razon_social} onChange={(e) => setF({ ...f, razon_social: e.target.value })} /></Fld>
        <Fld label="Nombre fantasía"><input className="inp" value={f.nombre_fantasia} onChange={(e) => setF({ ...f, nombre_fantasia: e.target.value })} /></Fld>
        <Fld label="Rubro *"><select required className="inp" value={f.rubro} onChange={(e) => setF({ ...f, rubro: e.target.value })}>{RUBROS.map((r) => <option key={r}>{r}</option>)}</select></Fld>
        <Fld label="Comuna *"><input required className="inp" value={f.comuna} onChange={(e) => setF({ ...f, comuna: e.target.value })} /></Fld>
        <Fld label="Macrosector"><select className="inp" value={f.macrosector} onChange={(e) => setF({ ...f, macrosector: e.target.value })}><option value="">—</option>{MACROSECTORES.map((r) => <option key={r}>{r}</option>)}</select></Fld>
        <Fld label="Dirección"><input className="inp" value={f.direccion} onChange={(e) => setF({ ...f, direccion: e.target.value })} /></Fld>
        <Fld label="Teléfono"><input className="inp" value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} /></Fld>
        <Fld label="Email"><input type="email" className="inp" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Fld>
        <Fld label="Volumen estimado semanal *"><select required className="inp" value={f.volumen_estimado_semanal} onChange={(e) => setF({ ...f, volumen_estimado_semanal: e.target.value })}>{VOLUMENES.map((r) => <option key={r}>{r}</option>)}</select></Fld>
        <Fld label="Estado *"><select required className="inp" value={f.estado} onChange={(e) => setF({ ...f, estado: e.target.value })}>{ESTADOS.map((r) => <option key={r}>{r}</option>)}</select></Fld>
        <Fld label="Fuente"><select className="inp" value={f.fuente} onChange={(e) => setF({ ...f, fuente: e.target.value })}>{FUENTES.map((r) => <option key={r}>{r}</option>)}</select></Fld>
        <Fld label="Índice Kizuna (0–100)"><input type="number" min={0} max={100} className="inp" value={f.indice_kizuna} onChange={(e) => setF({ ...f, indice_kizuna: Number(e.target.value) })} /></Fld>
        <div className="md:col-span-2">
          <Fld label="Productos clave"><textarea rows={2} className="inp" value={f.productos_clave} onChange={(e) => setF({ ...f, productos_clave: e.target.value })} /></Fld>
        </div>
        {err && <p className="md:col-span-2 text-sm text-red-600">{err}</p>}
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">Cancelar</button>
          <button disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving ? "Guardando…" : "Guardar"}</button>
        </div>
      </form>
    </Modal>
  );
}

function ClienteDetail({ cliente, contactos, tareas, onClose, onChange }: { cliente: Cliente; contactos: Contacto[]; tareas: Tarea[]; onClose: () => void; onChange: () => void }) {
  const [editing, setEditing] = useState(false);
  const [addContact, setAddContact] = useState(false);
  const [addTask, setAddTask] = useState(false);

  if (editing) return <ClienteForm cliente={cliente} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); onChange(); }} />;

  return (
    <Modal onClose={onClose} title={cliente.razon_social}>
      <div className="space-y-4 text-sm">
        <div className="grid gap-2 md:grid-cols-2">
          <Info k="Nombre fantasía" v={cliente.nombre_fantasia} />
          <Info k="Rubro" v={cliente.rubro} />
          <Info k="Comuna" v={cliente.comuna} />
          <Info k="Macrosector" v={cliente.macrosector} />
          <Info k="Dirección" v={cliente.direccion} />
          <Info k="Teléfono" v={cliente.telefono} />
          <Info k="Email" v={cliente.email} />
          <Info k="Volumen" v={cliente.volumen_estimado_semanal} />
          <Info k="Estado" v={cliente.estado} />
          <Info k="Índice Kizuna" v={String(cliente.indice_kizuna ?? 0)} />
          <Info k="Fuente" v={cliente.fuente} />
          <Info k="Productos clave" v={cliente.productos_clave} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted">Editar ficha</button>
          <button onClick={() => setAddContact(true)} className="rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground">+ Agregar contacto</button>
          <button onClick={() => setAddTask(true)} className="rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground">+ Crear tarea</button>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Historial de contactos</h3>
          {contactos.length === 0 ? <p className="text-muted-foreground text-sm">Sin contactos registrados.</p> : (
            <ul className="space-y-2">
              {contactos.map((c) => (
                <li key={c.id} className="rounded-md border border-border p-2">
                  <div className="flex justify-between text-xs text-muted-foreground"><span>{new Date(c.fecha).toLocaleString("es-CL")}</span><span>{c.canal} · {c.tipo}</span></div>
                  <div>{c.nota}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Tareas</h3>
          {tareas.length === 0 ? <p className="text-muted-foreground text-sm">Sin tareas.</p> : (
            <ul className="space-y-1 text-sm">
              {tareas.map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-md border border-border p-2">
                  <span>{t.fecha_programada} · {t.tipo}</span>
                  <span className="text-xs text-muted-foreground">{t.estado}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {addContact && <ContactForm clienteId={cliente.id} onClose={() => setAddContact(false)} onSaved={() => { setAddContact(false); onChange(); }} />}
      {addTask && <TaskForm clienteId={cliente.id} onClose={() => setAddTask(false)} onSaved={() => { setAddTask(false); onChange(); }} />}
    </Modal>
  );
}

function ContactForm({ clienteId, onClose, onSaved }: { clienteId: string; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ canal: CANALES[0], tipo: TIPOS_CONTACTO[0], nota: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setErr(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setErr("Sesión expirada"); setSaving(false); return; }
    const { error } = await supabase.from("contactos").insert({ cliente_id: clienteId, usuario_id: u.user.id, ...f });
    if (error) { setErr(error.message); setSaving(false); return; }
    setSaving(false); onSaved();
  }
  return (
    <Modal onClose={onClose} title="Agregar contacto">
      <form onSubmit={save} className="space-y-3">
        <Fld label="Canal"><select className="inp" value={f.canal} onChange={(e) => setF({ ...f, canal: e.target.value })}>{CANALES.map((r) => <option key={r}>{r}</option>)}</select></Fld>
        <Fld label="Tipo"><select className="inp" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>{TIPOS_CONTACTO.map((r) => <option key={r}>{r}</option>)}</select></Fld>
        <Fld label="Nota"><textarea rows={3} className="inp" value={f.nota} onChange={(e) => setF({ ...f, nota: e.target.value })} /></Fld>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">Cancelar</button><button disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground disabled:opacity-50">Guardar</button></div>
      </form>
    </Modal>
  );
}

function TaskForm({ clienteId, onClose, onSaved }: { clienteId: string; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ fecha_programada: new Date().toISOString().slice(0, 10), tipo: TIPOS_TAREA[0], estado: "Pendiente", comentarios: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setErr(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setErr("Sesión expirada"); setSaving(false); return; }
    const { error } = await supabase.from("tareas_rutas").insert({ cliente_id: clienteId, usuario_id: u.user.id, ...f });
    if (error) { setErr(error.message); setSaving(false); return; }
    setSaving(false); onSaved();
  }
  return (
    <Modal onClose={onClose} title="Nueva tarea / visita">
      <form onSubmit={save} className="space-y-3">
        <Fld label="Fecha"><input required type="date" className="inp" value={f.fecha_programada} onChange={(e) => setF({ ...f, fecha_programada: e.target.value })} /></Fld>
        <Fld label="Tipo"><select className="inp" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>{TIPOS_TAREA.map((r) => <option key={r}>{r}</option>)}</select></Fld>
        <Fld label="Estado"><select className="inp" value={f.estado} onChange={(e) => setF({ ...f, estado: e.target.value })}>{ESTADOS_TAREA.map((r) => <option key={r}>{r}</option>)}</select></Fld>
        <Fld label="Comentarios"><textarea rows={2} className="inp" value={f.comentarios} onChange={(e) => setF({ ...f, comentarios: e.target.value })} /></Fld>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">Cancelar</button><button disabled={saving} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground disabled:opacity-50">Guardar</button></div>
      </form>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-xl my-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-2xl leading-none text-muted-foreground hover:text-foreground">×</button>
        </div>
        {children}
      </div>
      <style>{`.inp{width:100%;border:1px solid hsl(var(--border));border-radius:0.5rem;padding:0.5rem 0.65rem;font-size:0.875rem;background:hsl(var(--background));color:hsl(var(--foreground))}`}</style>
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>{children}</label>;
}

function Info({ k, v }: { k: string; v: string | null | undefined }) {
  return <div><div className="text-xs text-muted-foreground">{k}</div><div>{v || "—"}</div></div>;
}