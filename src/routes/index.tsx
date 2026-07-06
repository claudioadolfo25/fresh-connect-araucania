import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import claudioSupermercado from "@/assets/claudio-supermercado.jpg";
import productoPalta from "@/assets/producto-palta.jpg";
import productoTomate from "@/assets/producto-tomate.jpg";
import productoLimon from "@/assets/producto-limon.jpg";

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

// Catálogo de productos frescos — inicial: palta, tomate, limón
type Producto = {
  id: string;
  name: string;
  image: string;
  tagline: string;
  description: string;
  variedades: string[];
  calibres: string[];
  origen: string;
  temporada: string;
  presentacion: string;
  atributos: { k: string; v: string }[];
};
const CATALOGO: Producto[] = [
  {
    id: "palta",
    name: "Palta Hass",
    image: productoPalta,
    tagline: "El estándar de exportación, disponible en La Araucanía.",
    description:
      "Palta Hass de piel rugosa y pulpa cremosa, con alto contenido de aceite. Seleccionada en huerto y madurada bajo control para llegar en su punto óptimo a retail y HORECA.",
    variedades: ["Hass"],
    calibres: ["12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32"],
    origen: "Región de Valparaíso · Región Metropolitana",
    temporada: "Disponibilidad todo el año (peak: sep–mar)",
    presentacion: "Caja de 10 kg · Bin 400 kg · Granel a pedido",
    atributos: [
      { k: "Materia seca", v: "≥ 23%" },
      { k: "Estado de madurez", v: "Verde firme · Consumo inmediato" },
      { k: "Cadena de frío", v: "5–7 °C en transporte" },
      { k: "Trazabilidad", v: "Por lote y huerto de origen" },
    ],
  },
  {
    id: "tomate",
    name: "Tomate Larga Vida",
    image: productoTomate,
    tagline: "Firmeza, color y consistencia en cada caja.",
    description:
      "Tomate de larga vida útil postcosecha, ideal para retail de rotación y para operaciones HORECA que exigen presentación uniforme y buen rendimiento en corte.",
    variedades: ["Larga Vida", "Roma / Perita", "Cherry en racimo"],
    calibres: ["GG (82–102 mm)", "G (67–82 mm)", "M (57–67 mm)", "P (47–57 mm)"],
    origen: "Valle de Quillota · Región del Maule",
    temporada: "Todo el año (peak: nov–abr)",
    presentacion: "Caja de 10 kg · Bandeja 5 kg · Racimo en caja de 6 kg",
    atributos: [
      { k: "Grado Brix", v: "4.5° – 5.5°" },
      { k: "Color (escala USDA)", v: "5–6 al despacho" },
      { k: "Cadena de frío", v: "10–12 °C" },
      { k: "Vida útil", v: "10–14 días en góndola" },
    ],
  },
  {
    id: "limon",
    name: "Limón Sutil / Eureka",
    image: productoLimon,
    tagline: "Aroma, acidez y rendimiento de jugo garantizados.",
    description:
      "Limón de cáscara pareja y alto contenido de jugo. Selección para bar, cocina de restaurante y góndola de supermercado, con calibre uniforme para presentación premium.",
    variedades: ["Eureka", "Fino / Génova", "Sutil (Pica)"],
    calibres: ["70", "75", "90", "100", "110", "125", "140"],
    origen: "Región de Coquimbo · Valle del Limarí",
    temporada: "Todo el año (peak: abr–oct)",
    presentacion: "Caja de 10 kg · Malla 2 kg · Granel 20 kg",
    atributos: [
      { k: "Contenido de jugo", v: "≥ 35%" },
      { k: "Acidez cítrica", v: "5–7% ac. cítrico" },
      { k: "Cadena de frío", v: "8–10 °C" },
      { k: "Presentación", v: "Cáscara amarilla uniforme sin manchas" },
    ],
  },
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

// 32 comunas de La Araucanía agrupadas por provincia
const CAUTIN = [
  "Carahue", "Cholchol", "Cunco", "Curarrehue", "Freire", "Galvarino",
  "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial",
  "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra",
  "Temuco", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica",
];
const MALLECO = [
  "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay",
  "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria",
];
const COVERAGE_ACTIVE = ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"];
const ALL_COMUNAS = [...CAUTIN, ...MALLECO];

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
      <Catalogo />
      <QRCard />
      <Coverage />
      <Testimonials />
      <SupermarketBanner />
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
          <a href="#catalogo" className="hover:text-primary">Catálogo</a>
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
          El primer hub agro con{" "}
          <span className="text-[color:var(--primary-deep)]">logística integral</span> de productos frescos para La Araucanía.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Soy <strong className="text-foreground">Claudio Ayelef</strong>, Key Account Manager que
          representa al primer hub agro especialista en distribución de productos frescos con
          logística integral desde <strong className="text-foreground">Temuco</strong>, capital
          de la Región, hacia toda La Araucanía. Un solo interlocutor para retail, HORECA y
          exportadores.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#catalogo"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Ver catálogo de productos →
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
          <Badge>Primer hub agro de La Araucanía</Badge>
          <Badge>Logística integral desde Temuco · {todayEs()}</Badge>
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

function Catalogo() {
  const [active, setActive] = useState<string>(CATALOGO[0].id);
  const producto = CATALOGO.find((p) => p.id === active) ?? CATALOGO[0];

  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          品 · Catálogo
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Productos frescos, con ficha técnica clara
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Cada producto llega documentado: variedad, calibre, origen, temporada y presentación.
          Sin sorpresas para tu equipo de compras ni para tu chef.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATALOGO.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={
              active === p.id
                ? "rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
                : "rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground hover:text-primary"
            }
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {CATALOGO.map((p) => (
          <article
            key={p.id}
            className={
              "group overflow-hidden rounded-2xl border bg-card transition " +
              (active === p.id
                ? "border-primary shadow-md"
                : "border-border hover:border-primary/40")
            }
          >
            <button
              onClick={() => setActive(p.id)}
              className="block w-full text-left"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-widest text-[color:var(--primary-deep)]">
                  Ficha
                </div>
                <div className="mt-1 text-lg font-semibold">{p.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              </div>
            </button>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 rounded-3xl border border-border bg-card p-6 md:grid-cols-[1.1fr,1fr] md:p-10">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Ficha técnica
          </div>
          <h3 className="mt-2 text-2xl font-semibold">{producto.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {producto.description}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <SpecBlock label="Variedades" items={producto.variedades} />
            <SpecBlock label="Calibres" items={producto.calibres} />
          </div>

          <dl className="mt-6 grid gap-3 text-sm">
            <SpecRow k="Origen" v={producto.origen} />
            <SpecRow k="Temporada" v={producto.temporada} />
            <SpecRow k="Presentación" v={producto.presentacion} />
          </dl>
        </div>

        <aside className="rounded-2xl border border-primary/20 bg-primary p-6 text-primary-foreground">
          <div className="text-xs uppercase tracking-widest opacity-80">
            Proceso productivo
          </div>
          <div className="mt-2 text-lg font-semibold">Trazabilidad y calidad</div>
          <ul className="mt-4 space-y-3 text-sm">
            {producto.atributos.map((a) => (
              <li key={a.k} className="flex flex-col gap-0.5 border-b border-white/15 pb-3 last:border-none last:pb-0">
                <span className="text-[11px] uppercase tracking-widest opacity-75">{a.k}</span>
                <span className="font-medium">{a.v}</span>
              </li>
            ))}
          </ul>
          <a
            href="#cotizar"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-background px-4 py-3 text-sm font-medium text-primary hover:opacity-90"
          >
            Cotizar {producto.name} →
          </a>
        </aside>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Catálogo inicial: palta Hass, tomate y limón. Cebolla, ajo y otros productos frescos
        disponibles bajo pedido.
      </p>
    </section>
  );
}

function SpecBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span
            key={i}
            className="rounded-full border border-border bg-background px-2.5 py-1 text-xs"
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 pb-3 last:border-none last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
      <dd className="text-sm text-foreground sm:text-right">{v}</dd>
    </div>
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
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          La Región de La Araucanía está conformada por 32 comunas distribuidas en dos
          provincias: <strong className="text-foreground">Cautín</strong> (21 comunas) y{" "}
          <strong className="text-foreground">Malleco</strong> (11 comunas). Operamos en toda la
          región con zonas activas y de expansión.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <ProvinciaBlock
            titulo="Provincia de Cautín"
            subtitulo="21 comunas · Capital regional: Temuco"
            comunas={CAUTIN}
          />
          <ProvinciaBlock
            titulo="Provincia de Malleco"
            subtitulo="11 comunas · Capital provincial: Angol"
            comunas={MALLECO}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background p-4 text-xs">
          <span className="inline-flex items-center gap-2 font-medium">
            <span className="h-2 w-2 rounded-full bg-[color:var(--accent-fresh)]" />
            Zona activa
          </span>
          <span className="text-muted-foreground">
            Ruta con despacho recurrente. Otras comunas: consultar frecuencia.
          </span>
        </div>
      </div>
    </section>
  );
}

function ProvinciaBlock({
  titulo,
  subtitulo,
  comunas,
}: {
  titulo: string;
  subtitulo: string;
  comunas: string[];
}) {
  return (
    <div>
      <div className="mb-1 text-sm font-semibold">{titulo}</div>
      <div className="mb-4 text-xs text-muted-foreground">{subtitulo}</div>
      <div className="flex flex-wrap gap-2">
        {comunas.map((c) => {
          const active = COVERAGE_ACTIVE.includes(c);
          return (
            <span
              key={c}
              className={
                active
                  ? "rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                  : "rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
              }
            >
              {c}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    rubro: "HORECA · Restaurante",
    quote:
      "Antes perseguíamos al proveedor; ahora Claudio nos avisa con anticipación y resuelve todo. La palta Hass es impecable.",
    author: "Gerente de Restaurante · Temuco",
  },
  {
    rubro: "HORECA · Hotel",
    quote:
      "La consistencia en la entrega y la calidad nos permite ofrecer un desayuno de excelencia todos los días.",
    author: "Jefe de Compras · Hotel Boutique, Pucón",
  },
  {
    rubro: "HORECA · Casino",
    quote:
      "Nos ayuda a planificar la compra, recomienda calibres y siempre está disponible. Es un socio estratégico.",
    author: "Encargado de Abastecimiento · Casino, Temuco",
  },
  {
    rubro: "Retail · Supermercado",
    quote:
      "La rotación en góndola mejoró notoriamente. Calibres uniformes, entregas puntuales y precios negociados con transparencia.",
    author: "Jefe de Frutas y Verduras · Supermercado Regional, Temuco",
  },
  {
    rubro: "Retail · Minimarket",
    quote:
      "Para un local de barrio, tener un solo contacto que resuelve pedidos chicos con calidad de mayorista es un antes y un después.",
    author: "Propietario · Minimarket, Villarrica",
  },
  {
    rubro: "Exportador · Palta Hass",
    quote:
      "Coordinamos volúmenes de exportación con calibres específicos. Claudio entiende la exigencia del mercado externo y cumple.",
    author: "Gerente Comercial · Exportadora Frutícola, Región de La Araucanía",
  },
];

const TESTIMONIAL_FILTERS = ["Todos", "Exportador", "Retail", "HORECA"] as const;

function Testimonials() {
  const [filter, setFilter] = useState<(typeof TESTIMONIAL_FILTERS)[number]>("Todos");
  const items =
    filter === "Todos"
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.rubro.toLowerCase().startsWith(filter.toLowerCase()));

  return (
    <section id="testimonios" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">声 · Testimonios</div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Confianza construida con clientes reales
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Filtra por rubro del cliente: exportadores de fruta, cadenas de retail y operadores
          HORECA (Hoteles, Restaurantes, Casinos y Cafeterías).
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {TESTIMONIAL_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? "rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
                  : "rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground hover:text-primary"
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((t) => (
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

function SupermarketBanner() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative min-h-[280px] md:min-h-[440px]">
            <img
              src={claudioSupermercado}
              alt="Claudio Ayelef en el sector de frutas y verduras de un supermercado en La Araucanía"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-card/80" />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              現場 · En terreno
            </div>
            <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              En la sala, junto a tu sector de frutas y verduras.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              No solo despachamos: acompañamos la operación en piso. Reviso calibres, rotación
              y presentación en góndola para que la palta Hass, el tomate, el limón, la cebolla y
              el ajo lleguen a tu cliente final tal como se seleccionaron en origen.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex gap-2"><span className="text-[color:var(--accent-fresh)]">◆</span> Auditoría de calidad en punto de venta</li>
              <li className="flex gap-2"><span className="text-[color:var(--accent-fresh)]">◆</span> Recomendación de calibres por temporada</li>
              <li className="flex gap-2"><span className="text-[color:var(--accent-fresh)]">◆</span> Reposición coordinada con tu equipo de frutería</li>
            </ul>
            <div className="mt-8">
              <a
                href="#cotizar"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Agendar visita a mi sala →
              </a>
            </div>
          </div>
        </div>
      </div>
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
        <SelectField label="Comuna de entrega" name="comuna" required options={ALL_COMUNAS} />
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
