import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/")({
  component: Index,
});

// ============================================================
//  EDITABLE CONFIG
// ============================================================
const WHATSAPP_NUMBER = "56935179017";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola Claudio, me interesa cotizar productos frescos.",
)}`;
const CONTACT_EMAIL = "key@co-kizuna.com";

// Webhook endpoint for form submissions — edit here
const QUOTE_WEBHOOK_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_QUOTE_WEBHOOK_URL) ||
  "";

// Reference prices in CLP per kg — easy to edit
const PRODUCTS: { id: string; name: string; pricePerKg: number; emoji: string; detail: string }[] = [
  { id: "palta", name: "Palta Hass", pricePerKg: 2500, emoji: "🥑", detail: "Calibre 12–32" },
  { id: "tomate", name: "Tomate Primera", pricePerKg: 1800, emoji: "🍅", detail: "Valle de Quillota" },
  { id: "limon", name: "Limón Messina", pricePerKg: 1200, emoji: "🍋", detail: "Pulpa jugosa" },
  { id: "cebolla", name: "Cebolla Granel", pricePerKg: 900, emoji: "🧅", detail: "60–70 mm" },
  { id: "ajo", name: "Ajo", pricePerKg: 3000, emoji: "🧄", detail: "Cabeza superior" },
];

const VCARD = `BEGIN:VCARD
VERSION:3.0
N:Ayelef;Claudio;;;
FN:Claudio Ayelef
ORG:PEPEPALTA.CL
TITLE:Key Account Manager
TEL;TYPE=CELL:+56935179017
EMAIL:key@co-kizuna.com
NOTE:Tu asesor estratégico en el abastecimiento de productos frescos
END:VCARD`;

const COVERAGE_ACTIVE = ["Temuco", "Villarrica", "Pucón"];
const COVERAGE_SOON = ["Lautaro", "Cholchol", "Carahue", "Labranza", "Pitrufquén", "Gorbea"];

const RUBROS = ["Supermercado", "Restaurante", "Hotel", "Casino", "Cafetería", "Juguería", "Otro"];
const VOLUMES = ["<100 kg", "100–500 kg", "500–1.000 kg", ">1.000 kg"];

const CLP = (n: number) =>
  "$" + n.toLocaleString("es-CL", { maximumFractionDigits: 0 });

const todayEs = () =>
  new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Challenge />
      <Simulator />
      <QRCard />
      <Coverage />
      <Testimonials />
      <QuoteForm />
      <Trust />
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">絆</span>
          <span className="text-sm">
            <span className="block font-semibold leading-tight">Claudio Ayelef</span>
            <span className="block text-xs text-muted-foreground leading-tight">Key Account Manager · PEPEPALTA.CL</span>
          </span>
        </a>
        <nav className="hidden gap-6 md:flex text-sm text-muted-foreground">
          <a href="#simulador" className="hover:text-primary">Simulador</a>
          <a href="#cobertura" className="hover:text-primary">Cobertura</a>
          <a href="#testimonios" className="hover:text-primary">Testimonios</a>
          <a href="#cotizar" className="hover:text-primary">Cotizar</a>
        </nav>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1000px 500px at 15% -10%, oklch(0.9 0.09 150 / 0.6), transparent 60%), radial-gradient(800px 400px at 90% 10%, oklch(0.95 0.05 150 / 0.7), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-[color:var(--accent-fresh)]" />
          En alianza con PEPEPALTA.CL · Región de La Araucanía
        </div>
        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
          Abastecimiento estratégico de{" "}
          <span className="text-[color:var(--primary-deep)]">productos frescos</span> para
          Retail y Horeca en La Araucanía.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          En alianza con <strong className="text-foreground">PEPEPALTA.CL</strong>, Claudio Ayelef
          gestiona tu suministro de paltas, tomates, limones, cebollas y ajos con calidad y
          continuidad garantizadas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#simulador"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Simular mi pedido ahora →
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary"
          >
            Hablar directo por WhatsApp
          </a>
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-xs">
          <Badge>En Alianza con PEPEPALTA.CL</Badge>
          <Badge>Precios actualizados: {todayEs()}</Badge>
          <Badge>Respuesta en menos de 2 horas hábiles</Badge>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}

function Challenge() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">El desafío</div>
          <h3 className="text-xl font-semibold">Continuidad y calidad en temporada alta</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Retail y Horeca en La Araucanía necesitan abastecimiento estable de productos frescos
            de primera calidad, incluso cuando la demanda se dispara y los precios se vuelven
            volátiles.
          </p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary p-8 text-primary-foreground">
          <div className="mb-3 text-xs uppercase tracking-widest opacity-80">La solución</div>
          <h3 className="text-xl font-semibold">Cadena de suministro con un solo interlocutor</h3>
          <p className="mt-3 text-sm leading-relaxed opacity-90">
            Productos seleccionados en origen, logística con cadena de frío y un asesor que
            responde: frescura garantizada desde el campo hasta tu cocina o góndola.
          </p>
        </div>
      </div>
    </section>
  );
}

function Simulator() {
  const [qty, setQty] = useState<Record<string, number>>({});

  const setKg = (id: string, val: number) => {
    const v = Number.isNaN(val) ? 0 : val;
    setQty((q) => ({ ...q, [id]: v }));
  };

  const rows = PRODUCTS.map((p) => {
    const kg = qty[p.id] ?? 0;
    return { ...p, kg, subtotal: kg * p.pricePerKg };
  });
  const total = rows.reduce((s, r) => s + r.subtotal, 0);
  const totalKg = rows.reduce((s, r) => s + r.kg, 0);
  const bigOrder = totalKg > 2000;

  return (
    <section id="simulador" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          算 · Simulador
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Estimación instantánea de tu pedido
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Ingresa los kilos por producto y visualiza tu estimación en tiempo real. El precio
          final se confirma contigo antes de despachar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
        <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
          <div className="hidden grid-cols-[1.4fr,1fr,1fr,1fr] gap-4 px-3 pb-3 text-xs uppercase tracking-widest text-muted-foreground md:grid">
            <span>Producto</span>
            <span>Precio / kg</span>
            <span>Cantidad (kg)</span>
            <span className="text-right">Subtotal</span>
          </div>
          <div className="divide-y divide-border">
            {rows.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-2 items-center gap-3 py-4 md:grid-cols-[1.4fr,1fr,1fr,1fr] md:gap-4"
              >
                <div className="col-span-2 flex items-center gap-3 md:col-span-1">
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.detail}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground md:text-foreground">
                  {CLP(p.pricePerKg)}
                </div>
                <div>
                  <input
                    type="number"
                    min={0}
                    max={2000}
                    placeholder="0"
                    value={qty[p.id] ?? ""}
                    onChange={(e) => setKg(p.id, parseInt(e.target.value || "0", 10))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="mt-1 text-[10px] text-muted-foreground">
                    Mín. 5 · Máx. 2.000 kg
                  </div>
                </div>
                <div className="text-right font-medium tabular-nums">{CLP(p.subtotal)}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-primary/20 bg-primary p-6 text-primary-foreground">
          <div className="text-xs uppercase tracking-widest opacity-80">Total estimado</div>
          <div className="mt-2 text-4xl font-semibold tabular-nums">{CLP(total)}</div>
          <div className="mt-1 text-sm opacity-80">{totalKg.toLocaleString("es-CL")} kg totales</div>

          <p className="mt-4 rounded-lg bg-black/15 px-3 py-2 text-xs leading-relaxed opacity-95">
            Estimación referencial — el precio final se confirma directamente contigo antes de
            despachar.
          </p>
          <p className="mt-2 text-[11px] opacity-70">
            Precios sujetos a variación según temporada y disponibilidad.
          </p>

          {bigOrder && (
            <div className="mt-4 rounded-lg border border-white/25 bg-white/10 p-3 text-xs">
              📦 <strong>¿Más de 2.000 kg?</strong> Gestionamos contratos especiales para grandes
              volúmenes. Te contactamos en 24 hrs.
            </div>
          )}

          <a
            href="#cotizar"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-background px-4 py-3 text-sm font-medium text-primary hover:opacity-90"
          >
            Convertir en cotización formal →
          </a>
        </aside>
      </div>
    </section>
  );
}

function QRCard() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">名刺 · vCard</div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Guarda mi contacto
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Escanea el código con la cámara de tu teléfono para agregarme directamente a tu agenda.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[auto,1fr]">
        <div className="flex items-center justify-center rounded-3xl border border-border bg-card p-8">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <QRCodeSVG value={VCARD} size={220} level="M" includeMargin={false} />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">絆</div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Tarjeta digital</div>
              <div className="text-lg font-semibold">Claudio Ayelef</div>
            </div>
          </div>
          <dl className="mt-6 grid gap-3 text-sm">
            <Row k="Cargo" v="Key Account Manager" />
            <Row k="Organización" v="PEPEPALTA.CL" />
            <Row k="Celular" v="+56 9 3517 9017" href={`tel:+${WHATSAPP_NUMBER}`} />
            <Row k="Correo" v={CONTACT_EMAIL} href={`mailto:${CONTACT_EMAIL}`} />
            <Row k="Eslogan" v="Tu asesor estratégico en el abastecimiento de productos frescos" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, href }: { k: string; v: string; href?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 pb-3 last:border-none last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
      <dd className="text-sm text-foreground sm:text-right">
        {href ? (
          <a href={href} className="hover:text-primary underline-offset-4 hover:underline">{v}</a>
        ) : (
          v
        )}
      </dd>
    </div>
  );
}

function Coverage() {
  return (
    <section id="cobertura" className="mx-auto max-w-6xl px-5 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">地域 · Cobertura</div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Región de La Araucanía
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent-fresh)]" />
              Zona activa
            </div>
            <div className="flex flex-wrap gap-2">
              {COVERAGE_ACTIVE.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
              Próximamente / consultar
            </div>
            <div className="flex flex-wrap gap-2">
              {COVERAGE_SOON.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    rubro: "Restaurante",
    quote:
      "Antes perseguíamos al proveedor; ahora Claudio nos avisa con anticipación y resuelve todo. La palta Hass es impecable.",
    author: "Gerente de Restaurante · Temuco",
  },
  {
    rubro: "Hotel",
    quote:
      "La consistencia en la entrega y la calidad nos permite ofrecer un desayuno de excelencia todos los días.",
    author: "Jefe de Compras · Hotel Boutique, Pucón",
  },
  {
    rubro: "Casino",
    quote:
      "Nos ayuda a planificar la compra, recomienda calibres y siempre está disponible. Es un socio estratégico.",
    author: "Encargado de Abastecimiento · Casino, Temuco",
  },
];

function Testimonials() {
  return (
    <section id="testimonios" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">声 · Testimonios</div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Confianza construida con clientes reales
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.author} className="rounded-2xl border border-border bg-card p-6">
            <div className="text-xs font-medium uppercase tracking-widest text-[color:var(--primary-deep)]">
              {t.rubro}
            </div>
            <p className="mt-3 text-sm leading-relaxed">「 {t.quote}」</p>
            <div className="mt-4 text-xs text-muted-foreground">— {t.author}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Logos de clientes se publican solo con autorización expresa de cada uno.
      </p>
    </section>
  );
}

function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Validation
    const email = String(data.email || "");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErrorMsg("Ingresa un correo válido.");
      return;
    }
    if (!data.privacy) {
      setErrorMsg("Debes aceptar el uso de datos para gestionar la cotización.");
      return;
    }

    setStatus("sending");
    try {
      if (QUOTE_WEBHOOK_URL) {
        const res = await fetch(QUOTE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error("Webhook error");
      }
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("No pudimos enviar tu cotización. Intenta por WhatsApp.");
    }
  };

  return (
    <section id="cotizar" className="mx-auto max-w-6xl px-5 py-16">
      <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">連絡 · Cotización</div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Solicita tu cotización formal
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Completa el formulario y Claudio te responde en menos de 2 horas hábiles con precios,
            calibres y logística.
          </p>
        </div>

        {status === "ok" ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center">
            <div className="text-3xl">✓</div>
            <h3 className="mt-2 text-lg font-semibold">Cotización enviada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Te responderemos en menos de 2 horas hábiles. Si es urgente, escríbenos por WhatsApp.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-full border border-border bg-background px-5 py-2 text-sm"
            >
              Enviar otra cotización
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Field label="RUT o Razón Social" name="rut" required />
            <Field label="Nombre de contacto" name="nombre" required />
            <SelectField label="Rubro" name="rubro" required options={RUBROS} />
            <Field label="Correo electrónico" name="email" type="email" required />
            <Field label="Teléfono / WhatsApp" name="telefono" required />
            <SelectField label="Comuna de entrega" name="comuna" required options={[...COVERAGE_ACTIVE, ...COVERAGE_SOON]} />
            <SelectField label="Volumen estimado semanal" name="volumen" required options={VOLUMES} />
            <Field label="Mensaje (opcional)" name="mensaje" as="textarea" className="md:col-span-2" />

            <label className="md:col-span-2 flex items-start gap-3 text-xs text-muted-foreground">
              <input type="checkbox" name="privacy" required className="mt-0.5" />
              <span>
                Acepto que mis datos sean usados exclusivamente para gestionar esta cotización. No se
                comparten con terceros.
              </span>
            </label>

            {errorMsg && (
              <div className="md:col-span-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {status === "sending" ? "Enviando…" : "Enviar cotización formal →"}
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                o escríbenos por WhatsApp
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  as,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "textarea";
  className?: string;
}) {
  const base =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {as === "textarea" ? (
        <textarea name={name} rows={4} className={base} required={required} />
      ) : (
        <input name={name} type={type} required={required} className={base} />
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      >
        <option value="" disabled>
          Selecciona…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

const TRUST = [
  { t: "Alianza con PEPEPALTA.CL", d: "Respaldo de un distribuidor consolidado de productos frescos." },
  { t: "Cadena de frío garantizada", d: "Logística con temperatura controlada en toda La Araucanía." },
  { t: "Atención personalizada", d: "Un solo interlocutor: Claudio Ayelef, Key Account Manager." },
  { t: "Resolución inmediata", d: "¿Un pedido con problemas? Lo resolvemos sin vueltas." },
  { t: "Privacidad respetada", d: "Tus datos se usan solo para tu cotización. Nunca con terceros." },
  { t: "Respuesta rápida", d: "Menos de 2 horas hábiles para responder solicitudes." },
];

function Trust() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">信頼 · Confianza</div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Por qué las mejores cocinas y góndolas confían
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TRUST.map((x) => (
          <div key={x.t} className="rounded-2xl border border-border bg-card p-6">
            <div className="text-sm font-semibold">{x.t}</div>
            <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">絆</span>
              <div>
                <div className="text-sm font-semibold">Claudio Ayelef</div>
                <div className="text-xs text-muted-foreground">Key Account Manager · PEPEPALTA.CL</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-xs text-muted-foreground">
              Asesoría estratégica en el abastecimiento de productos frescos para retail y Horeca
              en La Araucanía, Chile.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Contacto</div>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li><a className="hover:text-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp · +56 9 3517 9017</a></li>
              <li><a className="hover:text-primary" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Cobertura</div>
            <p className="mt-3 text-sm text-muted-foreground">
              {COVERAGE_ACTIVE.join(" · ")} y comunas aledañas.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Claudio Ayelef · Todos los derechos reservados</span>
          <span>誠 · 信 · 絆</span>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 hover:opacity-95"
    >
      <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.22c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.44.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38 0 1.4 1.02 2.75 1.16 2.94.15.19 2.01 3.07 4.87 4.31.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM16.02 5.33c-5.9 0-10.7 4.8-10.7 10.7 0 1.88.49 3.71 1.42 5.33L5 27l5.83-1.53a10.68 10.68 0 0 0 5.19 1.33h.01c5.9 0 10.7-4.8 10.7-10.7 0-2.86-1.11-5.55-3.13-7.57a10.6 10.6 0 0 0-7.58-3.2z"/>
      </svg>
      WhatsApp
    </a>
  );
}
