import { createFileRoute, Link } from "@tanstack/react-router";
import heroBanner from "@/assets/hero-banner.png.asset.json";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshKey · Abastecimiento de productos frescos en La Araucanía" },
      {
        name: "description",
        content:
          "Un solo interlocutor para abastecimiento, logística y seguimiento de frutas y verduras en La Araucanía. Continuidad operativa para retail y HORECA.",
      },
      { property: "og:title", content: "FreshKey · Continuidad operativa en frescos" },
      {
        property: "og:description",
        content:
          "Abastecimiento integral de frescos desde Temuco a las 32 comunas de La Araucanía. Retail, HORECA y exportadores.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const WHATSAPP = "56935179017";
const WA_URL = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Hola, quiero recibir una propuesta de abastecimiento de productos frescos.",
)}`;

function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav />
      <Hero />
      <Stats />
      <Problema />
      <Transformacion />
      <Plan />
      <Resultados />
      <Cobertura />
      <CTAFinal />
      <Plataforma />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="FreshKey" className="h-8 w-8 rounded-md object-contain" />
          <span className="text-sm font-semibold tracking-tight">FreshKey · B2B</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          <a href="#problema" className="hover:text-emerald-800">Problema</a>
          <a href="#plan" className="hover:text-emerald-800">Plan</a>
          <a href="#resultados" className="hover:text-emerald-800">Resultados</a>
          <a href="#cobertura" className="hover:text-emerald-800">Cobertura</a>
          <Link to="/plataforma" className="hover:text-emerald-800">Plataforma</Link>
        </nav>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full bg-emerald-900 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800 md:inline-flex"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={heroBanner.url}
        alt="Camión refrigerado con productos frescos y Key Account Manager de FreshKey en La Araucanía"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-emerald-950/30" />
      <div className="relative mx-auto flex max-w-6xl items-end px-5 py-16 md:min-h-[520px] md:py-24">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/plataforma"
            hash="cotizar"
            className="inline-flex items-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-emerald-950 hover:bg-amber-300"
          >
            Quiero una propuesta de abastecimiento →
          </Link>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20"
          >
            Hablar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: "<2h", l: "Respuesta" },
    { v: "32", l: "Comunas" },
    { v: "7 días", l: "Despacho" },
    { v: "1", l: "Interlocutor" },
  ];
  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-10 md:grid-cols-4">
        {items.map((i) => (
          <div key={i.l} className="text-center">
            <div className="text-3xl font-semibold text-emerald-900 md:text-4xl">{i.v}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-slate-500">{i.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Problema() {
  const items = [
    {
      t: "Caos de proveedores",
      d: "Tres, cuatro o cinco contactos distintos para conseguir lo que necesitas. Si uno falla, improvisas.",
    },
    {
      t: "Precios impredecibles",
      d: "La temporada alta te encuentra sin stock o pagando de más.",
    },
    {
      t: "Nadie responde",
      d: "Cuando un pedido llega mal, no hay un responsable que resuelva.",
    },
  ];
  return (
    <section id="problema" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-widest text-emerald-800">El problema</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Lo que hoy te quita tiempo y plata
        </h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((i) => (
          <div key={i.t} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">{i.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{i.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-3xl text-lg font-medium text-slate-800">
        No es falta de proveedores. Es falta de un{" "}
        <span className="text-emerald-800">socio que se haga responsable</span> de que todo funcione.
      </p>
    </section>
  );
}

function Transformacion() {
  const rows = [
    ["Persigues al proveedor para confirmar el pedido", "Te avisan antes de que preguntes"],
    ["No sabes si el precio subirá esta semana", "Precio estable acordado por volumen"],
    ["Calibres inconsistentes", "Calibre correcto para tu rubro"],
    ["Si algo falla, nadie responde", "Un solo interlocutor, respuesta rápida"],
  ];
  return (
    <section className="bg-emerald-950 py-20 text-white md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-xs uppercase tracking-widest text-amber-300">La transformación</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          De la incertidumbre al control
        </h2>
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-2 bg-white/5 text-xs uppercase tracking-widest text-emerald-100/80">
            <div className="p-4">Antes</div>
            <div className="p-4 border-l border-white/10">Después</div>
          </div>
          {rows.map(([a, b], i) => (
            <div key={i} className="grid grid-cols-2 border-t border-white/10 text-sm">
              <div className="p-4 text-emerald-100/70">{a}</div>
              <div className="p-4 border-l border-white/10 font-medium text-white">{b}</div>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-lg text-emerald-50/90">
          No vendemos paltas ni tomates. Vendemos la{" "}
          <span className="text-amber-300">tranquilidad</span> de que tu abastecimiento nunca es tu
          problema.
        </p>
      </div>
    </section>
  );
}

function Plan() {
  const steps = [
    { n: 1, t: "Conversamos", d: "Entendemos tu operación y tus problemas actuales." },
    { n: 2, t: "Diseñamos", d: "Calibres, volúmenes y frecuencia de entrega a medida." },
    { n: 3, t: "Ejecutamos", d: "Seguimiento, ajustes y soporte en tiempo real." },
  ];
  return (
    <section id="plan" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="text-xs uppercase tracking-widest text-emerald-800">El plan</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        Así se ordena tu abastecimiento
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-sm font-semibold text-white">
              {s.n}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-slate-600">{s.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Agendar conversación de 10 minutos →
        </a>
      </div>
    </section>
  );
}

function Resultados() {
  const items = [
    {
      w: "Casino · Temuco",
      q: "Reducimos los quiebres de stock en temporada alta y dejamos de hacer compras de emergencia.",
    },
    {
      w: "Supermercado regional",
      q: "La rotación en góndola mejoró en cuanto empezamos a recibir calibres uniformes por pedido.",
    },
    {
      w: "Minimarket · Villarrica",
      q: "Conseguimos condiciones de mayorista en volúmenes de barrio, con un solo pedido semanal.",
    },
  ];
  return (
    <section id="resultados" className="bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-xs uppercase tracking-widest text-emerald-800">Resultados</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Lo que cambia cuando dejas de perseguir proveedores
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((i) => (
            <figure key={i.w} className="rounded-2xl border border-slate-200 bg-white p-6">
              <blockquote className="text-sm italic leading-relaxed text-slate-700">
                “{i.q}”
              </blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-widest text-emerald-800">
                {i.w}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cobertura() {
  return (
    <section id="cobertura" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-emerald-800">Cobertura</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Operamos en toda La Araucanía
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Logística integral desde Temuco hacia las 32 comunas de la región, en las provincias
            de Cautín y Malleco.
          </p>
          <p className="mt-4 text-sm font-medium text-slate-800">
            Temuco · Padre Las Casas · Villarrica · Pucón · Angol y comunas aledañas.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-xs uppercase tracking-widest text-slate-500">Principales ciudades</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Temuco","Padre Las Casas","Villarrica","Pucón","Angol","Victoria","Lautaro","Loncoche","Nueva Imperial","Carahue","Freire","Vilcún","Traiguén","Collipulli","Curacautín","Gorbea",
            ].map((c) => (
              <span key={c} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-900">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTAFinal() {
  return (
    <section className="bg-emerald-900 py-20 text-white md:py-28">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
          Tu abastecimiento puede dejar de ser un problema esta semana
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base text-emerald-50/90">
          Una conversación de 10 minutos para entender tu operación y mostrarte, en concreto, cómo
          se ordena.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/plataforma"
            hash="cotizar"
            className="inline-flex items-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-emerald-950 hover:bg-amber-300"
          >
            Recibir una propuesta esta semana →
          </Link>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
          >
            WhatsApp directo
          </a>
        </div>
      </div>
    </section>
  );
}

function Plataforma() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-8 md:flex-row md:items-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-emerald-800">Plataforma</div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
            Ver catálogo y plataforma de abastecimiento
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Catálogo con fichas técnicas, simulador de cotización, productos picados y cotización
            detallada.
          </p>
        </div>
        <Link
          to="/plataforma"
          className="inline-flex items-center rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Entrar a la plataforma →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 text-xs text-slate-500 md:flex-row md:items-center">
        <div>© {new Date().getFullYear()} FreshKey · PMA SpA — Hub agro en La Araucanía</div>
        <div className="flex gap-4">
          <a href="mailto:freshkey.b2b@gmail.com" className="hover:text-emerald-800">
            freshkey.b2b@gmail.com
          </a>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-800">
            +56 9 3517 9017
          </a>
        </div>
      </div>
    </footer>
  );
}