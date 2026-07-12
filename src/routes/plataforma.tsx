import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import claudioSupermercado from "@/assets/claudio-supermercado.jpg";
import logoImg from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/plataforma")({
  component: Index,
});

// ============================================================
//  EDITABLE CONFIG
// ============================================================
const WHATSAPP_NUMBER = "56935179017";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola Claudio, me interesa cotizar productos frescos.",
)}`;
const CONTACT_EMAIL = "freshkey.b2b@gmail.com";

// Catálogo de productos frescos con ficha técnica y precio
type Producto = {
  id: string;
  name: string;
  image?: string;
  emoji?: string;
  tagline: string;
  description: string;
  variedades: string[];
  calibres: string[];
  origen: string;
  temporada: string;
  presentacion: string;
  atributos: { k: string; v: string }[];
  precio: number;
  unidad: string; // "kg", "unidad", "cabeza"
  comingSoon?: boolean;
};
const CATALOGO: Producto[] = [
  {
    id: "palta-12",
    name: "Palta Hass Calibre 12",
    emoji: "🥑",
    tagline: "Calibre XL premium · Próximamente en catálogo.",
    description:
      "Palta Hass calibre 12 (325–365 g por unidad). El calibre más grande para presentación premium, cartas de autor y regalos corporativos. Disponibilidad limitada por temporada.",
    variedades: ["Hass"],
    calibres: ["12 (325–365 g por unidad)"],
    origen: "Región de Valparaíso · Región Metropolitana",
    temporada: "Peak: sep–feb (consultar disponibilidad)",
    presentacion: "Caja de 10 kg · Pedido anticipado",
    atributos: [
      { k: "Materia seca", v: "≥ 24%" },
      { k: "Estado de madurez", v: "Verde firme" },
      { k: "Disponibilidad", v: "Próximamente · Precio a definir" },
    ],
    precio: 0,
    unidad: "kg",
    comingSoon: true,
  },
  {
    id: "palta-16",
    name: "Palta Hass Calibre 16",
    emoji: "🥑",
    tagline: "Calibre premium para retail y HORECA de alto nivel.",
    description:
      "Palta Hass calibre 16 de gran tamaño (270–300 g por unidad). Pulpa cremosa, alto contenido de aceite, ideal para presentación premium en góndola, tostadas gourmet y platos de autor.",
    variedades: ["Hass"],
    calibres: ["16 (270–300 g por unidad)"],
    origen: "Región de Valparaíso · Región Metropolitana",
    temporada: "Disponibilidad todo el año (peak: sep–mar)",
    presentacion: "Caja de 10 kg · Bin 400 kg · Granel a pedido",
    atributos: [
      { k: "Materia seca", v: "≥ 23%" },
      { k: "Estado de madurez", v: "Verde firme · Consumo inmediato" },
      { k: "Trazabilidad", v: "Por lote y huerto de origen" },
    ],
    precio: 3500,
    unidad: "kg",
  },
  {
    id: "palta-32",
    name: "Palta Hass Calibre 32",
    emoji: "🥑",
    tagline: "Calibre económico, rendimiento por kilo para volumen.",
    description:
      "Palta Hass calibre 32 (140–160 g por unidad). Excelente relación precio/kilo para casinos, minimarkets, juguerías y operaciones que priorizan rendimiento y rotación.",
    variedades: ["Hass"],
    calibres: ["32 (140–160 g por unidad)"],
    origen: "Región de Valparaíso · Región Metropolitana",
    temporada: "Disponibilidad todo el año (peak: sep–mar)",
    presentacion: "Caja de 10 kg · Bin 400 kg · Granel a pedido",
    atributos: [
      { k: "Materia seca", v: "≥ 23%" },
      { k: "Estado de madurez", v: "Verde firme · Consumo inmediato" },
      { k: "Trazabilidad", v: "Por lote y huerto de origen" },
    ],
    precio: 1900,
    unidad: "kg",
  },
  {
    id: "tomate",
    name: "Tomate",
    emoji: "🍅",
    tagline: "Firmeza, color y consistencia en cada caja.",
    description:
      "Tomate fresco de larga vida útil postcosecha, ideal para retail de rotación y para operaciones HORECA que exigen presentación uniforme y buen rendimiento en corte.",
    variedades: ["Larga Vida", "Roma / Perita", "Cherry en racimo"],
    calibres: ["GG (82–102 mm)", "G (67–82 mm)", "M (57–67 mm)", "P (47–57 mm)"],
    origen: "Valle de Quillota · Región del Maule",
    temporada: "Todo el año (peak: nov–abr)",
    presentacion: "Caja de 10 kg · Bandeja 5 kg · Racimo en caja de 6 kg",
    atributos: [
      { k: "Grado Brix", v: "4.5° – 5.5°" },
      { k: "Color (escala USDA)", v: "5–6 al despacho" },
      { k: "Vida útil", v: "10–14 días en góndola" },
    ],
    precio: 1000,
    unidad: "kg",
  },
  {
    id: "limon-messina",
    name: "Limón Amarillo Messina",
    emoji: "🍋",
    tagline: "Variedad Messina: aroma intenso y jugosidad garantizada.",
    description:
      "Limón amarillo variedad Messina, de cáscara amarilla uniforme y alto contenido de jugo. Selección para bar, cocina de restaurante y góndola de supermercado con calibre parejo.",
    variedades: ["Messina (amarillo)"],
    calibres: ["70", "75", "90", "100", "110", "125", "140"],
    origen: "Región de Coquimbo · Valle del Limarí",
    temporada: "Todo el año (peak: abr–oct)",
    presentacion: "Caja de 10 kg · Malla 2 kg · Granel 20 kg",
    atributos: [
      { k: "Contenido de jugo", v: "≥ 35%" },
      { k: "Acidez cítrica", v: "5–7% ac. cítrico" },
      { k: "Presentación", v: "Cáscara amarilla uniforme sin manchas" },
    ],
    precio: 300,
    unidad: "kg",
  },
  {
    id: "morron",
    name: "Pimiento Morrón Rojo",
    emoji: "🫑",
    tagline: "Código MR-O68 · Rojo intenso, pared gruesa.",
    description:
      "Pimiento morrón rojo MR-O68 de pared gruesa, apto para cocina caliente, parrilla y decoración de platos. Selección por color y firmeza.",
    variedades: ["Morrón Rojo MR-O68"],
    calibres: ["G · M · Uniforme"],
    origen: "Zona centro de Chile · Invernadero",
    temporada: "Todo el año",
    presentacion: "Caja 8 kg · 12 kg · Unidad",
    atributos: [
      { k: "Color", v: "Rojo intenso uniforme" },
      { k: "Firmeza", v: "Alta · Pared gruesa" },
      { k: "Formato", v: "Se vende por unidad" },
    ],
    precio: 857,
    unidad: "unidad",
  },
  {
    id: "champinon",
    name: "Champiñones Granel",
    emoji: "🍄",
    tagline: "Champiñón París fresco, listo para cocina profesional.",
    description:
      "Champiñón París (Agaricus bisporus) fresco a granel, para restaurantes, hoteles y casinos. Selección por tamaño y color, sin manchas.",
    variedades: ["París · Agaricus bisporus"],
    calibres: ["Chico · Mediano · Grande"],
    origen: "Región Metropolitana · Valparaíso",
    temporada: "Todo el año",
    presentacion: "Bandeja 250 g · 500 g · Granel caja 3 kg",
    atributos: [
      { k: "Color", v: "Blanco · Sin manchas" },
      { k: "Vida útil", v: "5–7 días refrigerado" },
    ],
    precio: 6600,
    unidad: "kg",
  },
  {
    id: "naranja",
    name: "Naranja",
    emoji: "🍊",
    tagline: "Naranja de jugo con dulzor equilibrado.",
    description:
      "Naranja de mesa y jugo, alta jugosidad y buen contenido de azúcar. Ideal para juguerías, cafeterías y desayunos de hotel.",
    variedades: ["Valencia · Navel"],
    calibres: ["56 · 64 · 72 · 80 · 88"],
    origen: "Región de Coquimbo · Valle del Limarí",
    temporada: "Todo el año (peak: jun–oct)",
    presentacion: "Caja 15 kg · Malla · Granel",
    atributos: [
      { k: "Contenido de jugo", v: "≥ 45%" },
      { k: "Grado Brix", v: "10° – 12°" },
    ],
    precio: 500,
    unidad: "kg",
  },
  {
    id: "cebolla",
    name: "Cebolla Granel",
    emoji: "🧅",
    tagline: "Cebolla firme para rotación diaria en cocina.",
    description:
      "Cebolla temprana y tardía a granel, calibre uniforme, pelable, ideal para volumen HORECA y reposición de retail.",
    variedades: ["Temprana", "Tardía"],
    calibres: ["M (60–80 mm)", "G (80–100 mm)"],
    origen: "Región de O'Higgins · Maule",
    temporada: "Todo el año",
    presentacion: "Granel caja 20 kg · Malla 5 kg · 10 kg",
    atributos: [
      { k: "Firmeza", v: "Alta" },
      { k: "Pelabilidad", v: "Óptima · Sin brotes" },
    ],
    precio: 500,
    unidad: "kg",
  },
  {
    id: "papa",
    name: "Papa Lavada",
    emoji: "🥔",
    tagline: "Papa lavada lista para cocina, calibre uniforme.",
    description:
      "Papa lavada de piel limpia y calibre parejo, apta para papas fritas, puré, cocción y horno. Reduce merma en cocina profesional.",
    variedades: ["Desirée", "Karú", "Yagana"],
    calibres: ["M (60–80 mm)", "G (80–100 mm)"],
    origen: "Región de La Araucanía · Los Lagos",
    temporada: "Todo el año",
    presentacion: "Saco 25 kg · Caja 20 kg · Granel",
    atributos: [
      { k: "Piel", v: "Lavada · Limpia" },
      { k: "Calibre", v: "Uniforme por lote" },
    ],
    precio: 420,
    unidad: "kg",
  },
  {
    id: "zanahoria",
    name: "Zanahoria",
    emoji: "🥕",
    tagline: "Zanahoria firme, dulce y de color intenso.",
    description:
      "Zanahoria seleccionada por calibre y color, para cocina, ensaladas frescas y jugos naturales. Rendimiento consistente por caja.",
    variedades: ["Nantes", "Chantenay"],
    calibres: ["Caja 10 kg · 20 kg"],
    origen: "Región Metropolitana · O'Higgins",
    temporada: "Todo el año",
    presentacion: "Caja 10 kg · 20 kg · Granel",
    atributos: [
      { k: "Color", v: "Naranja intenso" },
      { k: "Firmeza", v: "Alta" },
    ],
    precio: 400,
    unidad: "kg",
  },
  {
    id: "ajo",
    name: "Ajo",
    emoji: "🧄",
    tagline: "Cabezas firmes, aromáticas, sin brotes.",
    description:
      "Ajo morado y blanco de cabezas grandes, dientes bien formados, alto contenido aromático. Se comercializa por cabeza.",
    variedades: ["Morado", "Blanco"],
    calibres: ["M · G · GG (por cabeza)"],
    origen: "Región de Coquimbo · Valparaíso",
    temporada: "Todo el año (peak cosecha: nov–ene)",
    presentacion: "Malla 500 g · 1 kg · 5 kg · Cabeza unitaria",
    atributos: [
      { k: "Firmeza", v: "Alta · Sin brotes" },
      { k: "Formato", v: "Se vende por cabeza" },
    ],
    precio: 250,
    unidad: "cabeza",
  },
  {
    id: "papa-saco",
    name: "Papa por Saco",
    emoji: "🥔",
    tagline: "Saco 25 kg listo para cocina · Próximamente.",
    description:
      "Saco de papa lavada de 25 kg, formato práctico para cocinas de alto volumen. Se vende por unidad (saco).",
    variedades: ["Desirée", "Karú", "Yagana"],
    calibres: ["Saco 25 kg"],
    origen: "Región de La Araucanía · Los Lagos",
    temporada: "Todo el año",
    presentacion: "Saco 25 kg (unidad)",
    atributos: [
      { k: "Formato", v: "Saco 25 kg" },
      { k: "Disponibilidad", v: "Próximamente · Precio a definir" },
    ],
    precio: 0,
    unidad: "unidad",
    comingSoon: true,
  },
  {
    id: "cebolla-malla",
    name: "Malla de Cebolla",
    emoji: "🧅",
    tagline: "Malla lista para reposición · Próximamente.",
    description:
      "Malla de cebolla firme y de calibre uniforme, formato práctico para retail y HORECA. Se vende por unidad (malla).",
    variedades: ["Temprana", "Tardía"],
    calibres: ["Malla 10 kg"],
    origen: "Región de O'Higgins · Maule",
    temporada: "Todo el año",
    presentacion: "Malla (unidad)",
    atributos: [
      { k: "Formato", v: "Malla · Unidad" },
      { k: "Disponibilidad", v: "Próximamente · Precio a definir" },
    ],
    precio: 0,
    unidad: "unidad",
    comingSoon: true,
  },
  {
    id: "tomate-caja",
    name: "Caja de Tomates",
    emoji: "🍅",
    tagline: "Caja lista para reponer · Próximamente.",
    description:
      "Caja de tomates de larga vida, formato práctico para reposición diaria. Se vende por unidad (caja).",
    variedades: ["Larga Vida", "Roma / Perita"],
    calibres: ["Caja 10 kg"],
    origen: "Valle de Quillota · Región del Maule",
    temporada: "Todo el año",
    presentacion: "Caja (unidad)",
    atributos: [
      { k: "Formato", v: "Caja · Unidad" },
      { k: "Disponibilidad", v: "Próximamente · Precio a definir" },
    ],
    precio: 0,
    unidad: "unidad",
    comingSoon: true,
  },
  {
    id: "limon-malla",
    name: "Malla de Limones",
    emoji: "🍋",
    tagline: "Malla lista para reposición · Próximamente.",
    description:
      "Malla de limones amarillos Messina, formato práctico para retail y HORECA. Se vende por unidad (malla).",
    variedades: ["Messina (amarillo)"],
    calibres: ["Malla 2 kg"],
    origen: "Región de Coquimbo · Valle del Limarí",
    temporada: "Todo el año",
    presentacion: "Malla (unidad)",
    atributos: [
      { k: "Formato", v: "Malla · Unidad" },
      { k: "Disponibilidad", v: "Próximamente · Precio a definir" },
    ],
    precio: 0,
    unidad: "unidad",
    comingSoon: true,
  },
];

// Productos picados / procesados
const PICADOS = [
  {
    id: "palta-picada",
    emoji: "🥑",
    name: "Palta Picada",
    subtitle: "Cubos · Rodajas · Puré",
    tags: ["Cubos 1x1 cm", "Rodajas", "Puré"],
    presentacion: "Bandeja termosellada · Bolsa al vacío",
  },
  {
    id: "cebolla-picada",
    emoji: "🧅",
    name: "Cebolla Picada",
    subtitle: "Fina · Gruesa · Juliana",
    tags: ["Picada fina", "Juliana", "Aros"],
    presentacion: "Bolsa 1 kg · 5 kg · Granel",
  },
  {
    id: "mix",
    emoji: "🥗",
    name: "Mezclas Preparadas",
    subtitle: "Guacamole · Sofrito · Wok",
    tags: ["Guacamole", "Sofrito", "Mix Wok"],
    presentacion: "Bandeja · Bolsa · Pack a medida",
  },
];

// Sectores urbanos y periurbanos de Temuco con despacho frecuente
const SECTORES_TEMUCO = [
  {
    nombre: "El Carmen",
    zona: "Surponiente de Temuco",
    perfil:
      "Macrosector con fuerte crecimiento inmobiliario. Funciona como ciudad satélite con supermercados propios y colegios.",
    acceso: "Acceso por Avenida Pedro de Valdivia",
  },
  {
    nombre: "San Ramón",
    zona: "Suroeste, camino a Nueva Imperial",
    perfil:
      "Zona consolidada como dormitorio, con parcelas de agrado y casas de terrenos amplios más allá de Labranza.",
    acceso: "Ruta S-40",
  },
  {
    nombre: "Amanecer",
    zona: "Oeste de Temuco",
    perfil:
      "Barrio residencial histórico y de alta densidad, con vida de barrio tradicional y comercio local activo.",
    acceso: "Cercano a Pedro de Valdivia",
  },
  {
    nombre: "Metrenco",
    zona: "Sur · Padre Las Casas",
    perfil:
      "Alta expansión de condominios y villas hacia la Ruta 5 Sur. Tranquilidad a corta distancia del centro.",
    acceso: "Acceso directo a la Autopista",
  },
  {
    nombre: "Cajón / Vilcún",
    zona: "Noreste de Temuco",
    perfil:
      "Terrenos más grandes y entorno campestre, ideal para familias que buscan menor congestión.",
    acceso: "Ruta a Cajón / Cherquenco",
  },
  {
    nombre: "Labranza · Pedro de Valdivia",
    zona: "Poniente y centro-poniente",
    perfil:
      "Zonas de conurbación con alta densidad residencial, bien conectadas al centro y con retail consolidado.",
    acceso: "Ruta S-30 y ejes urbanos",
  },
];

const VCARD = `BEGIN:VCARD
VERSION:3.0
N:Ayelef;Claudio;;;
FN:Claudio Ayelef
ORG:PMA SpA
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

// Rubros que atiende PMA SpA
const RUBROS_CARDS = [
  { icon: "🍽️", name: "Restaurantes", desc: "Paltas por calibre, verduras frescas y reposición semanal confiable." },
  { icon: "🏭", name: "Casinos", desc: "Volúmenes grandes con precio estable y entrega programada." },
  { icon: "🏨", name: "Hoteles", desc: "Fruta y verdura seleccionada para desayunos y banquetería." },
  { icon: "🛒", name: "Minimarkets", desc: "Productos listos para reventa con buen margen y rotación." },
  { icon: "☕", name: "Cafeterías", desc: "Palta lista para tostadas y sándwiches, fruta fresca de temporada." },
  { icon: "🥤", name: "Juguerías", desc: "Fruta de temporada con el rendimiento que tu negocio necesita." },
];

const CLP = (n: number) =>
  "$" + n.toLocaleString("es-CL", { maximumFractionDigits: 0 });

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <PropuestaValor />
      <Hero />
      <Challenge />
      <Servicio />
      <Catalogo />
      <Picados />
      <Simulador />
      <Rubros />
      <SectoresTemuco />
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
          <img src={logoImg} alt="PMA SpA" className="h-10 w-10 rounded-full object-contain bg-white p-0.5 border border-border" />
          <span className="text-sm">
            <span className="block font-semibold leading-tight">Claudio Ayelef</span>
            <span className="block text-xs text-muted-foreground leading-tight">Key Account Manager · PMA SpA</span>
          </span>
        </a>
        <nav className="hidden gap-6 md:flex text-sm text-muted-foreground">
          <a href="#servicio" className="hover:text-primary">Servicio</a>
          <a href="#catalogo" className="hover:text-primary">Catálogo</a>
          <a href="#picados" className="hover:text-primary">Picados</a>
          <a href="#simulador" className="hover:text-primary">Simulador</a>
          <a href="#rubros" className="hover:text-primary">Rubros</a>
          <a href="#cobertura" className="hover:text-primary">Cobertura</a>
          <a href="#testimonios" className="hover:text-primary">Testimonios</a>
          <a href="#cotizar" className="hover:text-primary">Cotizar</a>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-full border border-primary/40 bg-card px-4 py-2 text-xs font-medium text-primary hover:bg-primary/5"
          >
            Acceder al Dashboard →
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

function PropuestaValor() {
  const items = [
    {
      icon: "🎯",
      title: "Resolvemos tu abastecimiento crítico",
      desc: "Un solo interlocutor para palta, tomate, limón, cebolla y más. Menos proveedores, menos errores, menos merma en tu operación diaria.",
    },
    {
      icon: "📈",
      title: "Te hacemos más rentable",
      desc: "Calibres correctos por rubro, precio estable por volumen, entregas programadas y despacho de fin de semana. Cada peso invertido rinde en góndola y en cocina.",
    },
    {
      icon: "💚",
      title: "Construimos vínculo, no transacción",
      desc: "Kizuna (絆): el lazo. Seguimiento personal, visitas en tu local, ajustes en tiempo real y una relación donde tu satisfacción es la métrica que importa.",
    },
  ];
  return (
    <section id="propuesta" className="border-b border-border/60 bg-[color:var(--primary-deep)] text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent-fresh)]" />
              Propuesta de valor
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight">
              No se trata de nosotros. <span className="opacity-80">Se trata de que tu negocio funcione mejor.</span>
            </h2>
            <p className="mt-4 text-white/80 md:text-lg">
              Producto fresco correcto, en el momento correcto, al precio correcto — y una persona que responde cuando algo no calza.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[color:var(--primary-deep)] shadow-sm hover:bg-white/90"
          >
            Acceder al Dashboard →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <div className="text-3xl">{it.icon}</div>
              <h3 className="mt-3 text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-white/80 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
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
          PMA SpA · Región de La Araucanía
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
          <Badge>Logística integral desde Temuco</Badge>
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
            Productos seleccionados en origen, logística integral y un asesor que responde:
            frescura garantizada desde el campo hasta tu cocina o góndola.
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
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-7xl">
                    <span aria-hidden>{p.emoji}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-widest text-[color:var(--primary-deep)]">
                  Ficha
                </div>
                <div className="mt-1 text-lg font-semibold">{p.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                <p className="mt-2 text-xs font-semibold text-[color:var(--primary-deep)]">
                  {p.comingSoon
                    ? `Precio a definir · Próximamente (${p.unidad})`
                    : `${CLP(p.precio)} por ${p.unidad}`}
                </p>
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

      <p className="mt-6 text-xs text-muted-foreground">
        Todos los productos incluyen ficha técnica, precio referencial y logística integral desde Temuco.
      </p>
    </section>
  );
}

function Servicio() {
  return (
    <section
      id="servicio"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.96 0.04 150) 0%, oklch(0.93 0.06 150) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
            Nuestro sello
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            No vendemos productos,{" "}
            <span className="text-[color:var(--primary-deep)]">
              ofrecemos un servicio de compras de productos frescos
            </span>
            .
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
            Nos hacemos cargo de tu abastecimiento completo. Tú te enfocas en tu negocio;
            nosotros en la logística, la calidad y la consistencia de tus insumos.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <ServicioCard
            title="Abastecimiento integral"
            desc="Gestionamos toda tu compra de productos frescos. Un solo pedido, una sola factura, un solo interlocutor."
            icon="📦"
          />
          <ServicioCard
            title="Relación de confianza"
            desc="Excelencia con alma: calidad garantizada, cumplimiento impecable y atención personalizada."
            icon="🤝"
            highlight
          />
          <ServicioCard
            title="Despacho fin de semana"
            desc="Por volumen, coordinamos entregas sábado y domingo directo a tu local, restaurante u hotel."
            icon="🚚"
          />
          <ServicioCard
            title="Productos procesados"
            desc="Palta y cebolla picadas, mezclas preparadas y pack a medida para agilizar tu cocina."
            icon="🔪"
          />
          <ServicioCard
            title="Hub agro con logística integral"
            desc="Desde Temuco, capital regional, hacia toda La Araucanía con logística confiable."
            icon="🏭"
          />
        </div>
      </div>
    </section>
  );
}

function ServicioCard({
  title,
  desc,
  icon,
  highlight,
}: {
  title: string;
  desc: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl bg-card p-6 shadow-sm " +
        (highlight ? "border-2 border-primary" : "border border-border")
      }
    >
      <div className="text-3xl" aria-hidden>
        {icon}
      </div>
      <div className="mt-3 text-base font-semibold">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Picados() {
  return (
    <section id="picados" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8 text-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          加工 · Productos procesados
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Productos picados · Listo para usar
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Ahorra tiempo en tu cocina. Entregamos productos frescos ya procesados, en formatos
          adaptados a tu operación de retail u HORECA.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {PICADOS.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-border bg-card p-6 text-center transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="text-4xl" aria-hidden>
              {p.emoji}
            </div>
            <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>
            <p className="text-sm text-muted-foreground">{p.subtitle}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Presentación: {p.presentacion}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href="#cotizar"
          className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Solicitar cotización de productos picados →
        </a>
      </div>
    </section>
  );
}

function SectoresTemuco() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          都市 · Sectores urbanos de Temuco
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Despacho fino a los sectores de mayor crecimiento
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Además de las 32 comunas, atendemos los macrosectores de conurbación y expansión de
          Temuco con rutas dedicadas a retail de barrio, restaurantes y hoteles.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SECTORES_TEMUCO.map((s) => (
            <div
              key={s.nombre}
              className="rounded-2xl border border-border bg-background p-5"
            >
              <div className="text-xs uppercase tracking-widest text-[color:var(--primary-deep)]">
                {s.zona}
              </div>
              <div className="mt-1 text-base font-semibold">{s.nombre}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.perfil}</p>
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Conectividad: </span>
                {s.acceso}
              </div>
            </div>
          ))}
        </div>
      </div>
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
            <Row k="Organización" v="PMA SpA" />
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
      const { error } = await supabase.from("quote_requests").insert({
        rut: String(data.rut || ""),
        nombre: String(data.nombre || ""),
        rubro: String(data.rubro || ""),
        email,
        telefono: String(data.telefono || ""),
        comuna: String(data.comuna || ""),
        volumen: String(data.volumen || ""),
        mensaje: String(data.mensaje || "") || null,
      });
      if (error) throw error;
      // Enviar a WhatsApp y correo con el resumen
      const resumen = [
        `Nueva cotización FreshKey`,
        `RUT/Razón: ${data.rut}`,
        `Contacto: ${data.nombre}`,
        `Rubro: ${data.rubro}`,
        `Email: ${email}`,
        `Teléfono: ${data.telefono}`,
        `Comuna: ${data.comuna}`,
        `Volumen semanal: ${data.volumen}`,
        `Mensaje: ${data.mensaje || "-"}`,
      ].join("\n");
      const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(resumen)}`;
      const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        "Nueva cotización desde el sitio",
      )}&body=${encodeURIComponent(resumen)}`;
      window.open(wa, "_blank", "noopener,noreferrer");
      window.location.href = mail;
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

function Simulador() {
  const [qty, setQty] = useState<Record<string, number>>({});

  const setValue = (id: string, v: number) => {
    setQty((prev) => ({ ...prev, [id]: v < 0 ? 0 : v }));
  };

  const total = useMemo(
    () =>
      CATALOGO.reduce(
        (sum, p) => sum + (p.comingSoon ? 0 : (qty[p.id] || 0) * p.precio),
        0,
      ),
    [qty],
  );

  const seleccionados = CATALOGO.filter((p) => (qty[p.id] || 0) > 0);

  const wsMessage =
    seleccionados.length > 0
      ? `Hola Claudio, quiero cotizar: ${seleccionados
          .map((p) =>
            `${qty[p.id]} ${p.unidad}(s) de ${p.name}${p.comingSoon ? " (precio a definir)" : ""}`,
          )
          .join(", ")}. Total estimado: ${CLP(total)}.`
      : "Hola Claudio, me interesa cotizar productos frescos.";
  const wsUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(wsMessage)}`;

  return (
    <section id="simulador" className="mx-auto max-w-6xl px-5 py-16">
      <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            見積 · Simulador
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Simulador de cotización
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Ingresa la cantidad requerida por producto y visualiza el total estimado. Los
            precios son referenciales por{" "}
            <strong className="text-foreground">unidad indicada</strong> y pueden variar según
            temporada y volumen.
          </p>
        </div>

        <div className="grid gap-3">
          {CATALOGO.map((p) => {
            const q = qty[p.id] || 0;
            const subtotal = p.comingSoon ? 0 : q * p.precio;
            return (
              <div
                key={p.id}
                className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-background p-4 sm:grid-cols-[auto,1fr,auto,auto,auto] sm:items-center"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl" aria-hidden>
                      {p.emoji}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {p.name}
                    {p.comingSoon && (
                      <span className="ml-2 rounded-full bg-[color:var(--accent-fresh)]/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[color:var(--primary-deep)]">
                        Próximamente
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.comingSoon ? `Precio a definir por ${p.unidad}` : `${CLP(p.precio)} por ${p.unidad}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setValue(p.id, q - 1)}
                    className="h-8 w-8 rounded-full border border-border text-lg leading-none hover:bg-secondary"
                    aria-label={`Menos ${p.name}`}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={q}
                    onChange={(e) =>
                      setValue(p.id, parseInt(e.target.value || "0", 10) || 0)
                    }
                    className="h-9 w-20 rounded-lg border border-border bg-background px-2 text-center text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setValue(p.id, q + 1)}
                    className="h-8 w-8 rounded-full border border-border text-lg leading-none hover:bg-secondary"
                    aria-label={`Más ${p.name}`}
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-muted-foreground sm:text-right">
                  {p.unidad}
                </div>
                <div className="text-sm font-semibold sm:text-right sm:min-w-[100px]">
                  {p.comingSoon ? <span className="text-muted-foreground">A definir</span> : CLP(subtotal)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-80">Total estimado</div>
            <div className="mt-1 text-3xl font-semibold">{CLP(total)}</div>
            <div className="mt-1 text-xs opacity-80">
              Referencial. IVA, despacho y descuentos por volumen se cotizan al confirmar.
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={wsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-background px-5 py-2.5 text-sm font-medium text-primary hover:opacity-90"
            >
              Enviar por WhatsApp →
            </a>
            <a
              href="#cotizar"
              className="inline-flex items-center rounded-full border border-primary-foreground/40 px-5 py-2.5 text-sm font-medium hover:bg-primary-foreground/10"
            >
              Cotización formal
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Rubros() {
  return (
    <section id="rubros" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8 text-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          業種 · Para tu negocio
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Abastecemos todo tipo de cocinas
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          De un local de barrio a una operación de banquetería: adaptamos el servicio a tu
          rubro, tu volumen y tu ritmo de reposición.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RUBROS_CARDS.map((r) => (
          <div
            key={r.name}
            className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="text-3xl" aria-hidden>
              {r.icon}
            </div>
            <h3 className="mt-3 text-lg font-semibold">{r.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const TRUST = [
  { t: "Respaldo PMA SpA", d: "Primer hub agro de La Araucanía, especialista en distribución de productos frescos." },
  { t: "Logística integral", d: "Desde Temuco hacia toda La Araucanía con entregas confiables." },
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
                <div className="text-xs text-muted-foreground">Key Account Manager · PMA SpA</div>
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
