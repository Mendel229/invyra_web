/**
 * Registre de tous les templates disponibles dans le code.
 * Sert de source de vérité pour la page admin — permet de détecter
 * les templates présents dans le code mais pas encore en base.
 */

export type EventType = "mariage" | "anniversaire" | "bapteme" | "soiree_vip" | "corporate" | "autre";
export type TemplateTier = "gratuit" | "premium";

export interface TemplateRegistryEntry {
  web_template_key: string;
  name: string;
  description: string;
  event_type: EventType;
  tier: TemplateTier;
  sort_order: number;
  is_animated: boolean;
  /** Couleurs par défaut du template */
  default_colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  /** Champs de personnalisation spécifiques au template */
  custom_fields: Array<{
    key: string;
    label: string;
    type: "text" | "textarea" | "color" | "colorList" | "toggle" | "url" | "timeline" | "imageList" | "number";
    required: boolean;
    default?: unknown;
    max?: number;
    placeholder?: string;
  }>;
  /** Images de démo (noms de fichiers dans public/templates/{key}/) */
  demo_images: string[];
}

export const TEMPLATES_REGISTRY: TemplateRegistryEntry[] = [
  // ─── Mariage ──────────────────────────────────────────────────────────────
  {
    web_template_key: "mariage-dore",
    name: "Élégance Dorée",
    description: "Invitation mariage classique aux ornements dorés et fond crème.",
    event_type: "mariage",
    tier: "gratuit",
    sort_order: 1,
    is_animated: true,
    default_colors: { primary: "#B88922", secondary: "#FFF8ED", accent: "#D4A017" },
    custom_fields: [
      { key: "nomCouple", label: "Noms du couple", type: "text", required: false, placeholder: "Marie & Jean" },
    ],
    demo_images: ["hero.jpg"],
  },
  {
    web_template_key: "midnight-romance",
    name: "Midnight Romance",
    description: "Mariage sombre et romantique aux tons nuit et or.",
    event_type: "mariage",
    tier: "premium",
    sort_order: 2,
    is_animated: true,
    default_colors: { primary: "#D4A017", secondary: "#0D0A1A", accent: "#A78BFA" },
    custom_fields: [
      { key: "nomCouple", label: "Noms du couple", type: "text", required: false, placeholder: "Marie & Jean" },
    ],
    demo_images: ["hero.jpg"],
  },
  {
    web_template_key: "sauge-eukalyptus",
    name: "Sauge & Eukalyptus",
    description: "Mariage nature, tons vert sauge, fleurs blanches et enveloppe animée.",
    event_type: "mariage",
    tier: "premium",
    sort_order: 3,
    is_animated: true,
    default_colors: { primary: "#6b8055", secondary: "#f5f2eb", accent: "#8a9e72" },
    custom_fields: [
      { key: "nomCouple", label: "Noms du couple", type: "text", required: false, placeholder: "Marie & Jean" },
      { key: "dresscodeText", label: "Dress code", type: "text", required: false, placeholder: "Tenue champêtre" },
    ],
    demo_images: ["hero.jpg", "floral.png"],
  },
  {
    web_template_key: "olive-elegant",
    name: "Olive Élégant",
    description: "Mariage vert olive, monogramme, timeline du programme et enveloppe.",
    event_type: "mariage",
    tier: "premium",
    sort_order: 4,
    is_animated: true,
    default_colors: { primary: "#4a5e38", secondary: "#f7f5ef", accent: "#8a9e72" },
    custom_fields: [
      { key: "nomCouple", label: "Noms du couple", type: "text", required: false, placeholder: "Marie & Jean" },
      { key: "mapsUrl", label: "Lien Google Maps", type: "url", required: false, placeholder: "https://maps.google.com/..." },
      { key: "dresscodeText", label: "Code vestimentaire", type: "text", required: false, placeholder: "Tenue formelle" },
      {
        key: "timeline",
        label: "Programme de la journée",
        type: "timeline",
        required: false,
        default: [
          { time: "09h00", label: "Cérémonie" },
          { time: "11h30", label: "Cocktail" },
          { time: "13h00", label: "Réception" },
        ],
      },
    ],
    demo_images: ["hero.jpg"],
  },

  // ─── Anniversaire ─────────────────────────────────────────────────────────
  {
    web_template_key: "anniversaire-colore",
    name: "Fête Colorée",
    description: "Anniversaire festif aux couleurs vives et motifs wax africains.",
    event_type: "anniversaire",
    tier: "gratuit",
    sort_order: 5,
    is_animated: true,
    default_colors: { primary: "#FF7A18", secondary: "#D72A50", accent: "#FDE047" },
    custom_fields: [
      { key: "age", label: "Âge fêté", type: "number", required: false, placeholder: "30" },
    ],
    demo_images: ["hero.jpg"],
  },
  {
    web_template_key: "neon-birthday",
    name: "Neon Birthday",
    description: "Anniversaire néon cyber, style club avec particules lumineuses.",
    event_type: "anniversaire",
    tier: "premium",
    sort_order: 6,
    is_animated: true,
    default_colors: { primary: "#A855F7", secondary: "#090814", accent: "#22D3EE" },
    custom_fields: [
      { key: "age", label: "Âge fêté", type: "number", required: false, placeholder: "25" },
      { key: "dresscodeText", label: "Dress code / Thème", type: "text", required: false, placeholder: "All Black" },
    ],
    demo_images: ["hero.jpg"],
  },
  {
    web_template_key: "birthday-party",
    name: "Birthday Party",
    description: "Anniversaire rose poudré, polaroids, calendrier et timeline festive.",
    event_type: "anniversaire",
    tier: "premium",
    sort_order: 7,
    is_animated: true,
    default_colors: { primary: "#e879a0", secondary: "#fff5f8", accent: "#f9c8d9" },
    custom_fields: [
      {
        key: "timeline",
        label: "Programme de la soirée",
        type: "timeline",
        required: false,
        default: [
          { time: "15:00", label: "Accueil des invités" },
          { time: "15:15", label: "Séance photo" },
          { time: "16:00", label: "Animation & surprises" },
        ],
      },
      {
        key: "dresscodeColors",
        label: "Couleurs du dress code",
        type: "colorList",
        required: false,
        max: 4,
        default: ["#f9c8d9", "#f0a0c0", "#e879a0", "#d44b80"],
      },
      {
        key: "giftText",
        label: "Message cadeau (laisser vide pour masquer)",
        type: "textarea",
        required: false,
        placeholder: "Une enveloppe me touchera autant...",
      },
      {
        key: "mapsUrl",
        label: "Lien Google Maps",
        type: "url",
        required: false,
        placeholder: "https://maps.google.com/...",
      },
      {
        key: "images",
        label: "Photos (jusqu'à 5)",
        type: "imageList",
        max: 5,
        required: false,
      },
    ],
    demo_images: ["hero.jpg", "polaroid-1.jpg", "polaroid-2.jpg"],
  },

  // ─── Baptême ──────────────────────────────────────────────────────────────
  {
    web_template_key: "bapteme-celeste",
    name: "Douceur Céleste",
    description: "Baptême délicat aux tons bleu ciel et blanc avec des nuages.",
    event_type: "bapteme",
    tier: "gratuit",
    sort_order: 8,
    is_animated: true,
    default_colors: { primary: "#7EB8D4", secondary: "#F0F8FF", accent: "#B8D4E8" },
    custom_fields: [],
    demo_images: ["hero.jpg"],
  },
  {
    web_template_key: "sacred-lilies",
    name: "Sacred Lilies",
    description: "Baptême élégant aux lys sacrés et dorures.",
    event_type: "bapteme",
    tier: "premium",
    sort_order: 9,
    is_animated: true,
    default_colors: { primary: "#8B6C9E", secondary: "#FAF7FF", accent: "#D4A017" },
    custom_fields: [],
    demo_images: ["hero.jpg"],
  },

  // ─── Corporate ────────────────────────────────────────────────────────────
  {
    web_template_key: "african-tech",
    name: "African Tech",
    description: "Événement corporate tech avec circuits kente animés.",
    event_type: "corporate",
    tier: "gratuit",
    sort_order: 10,
    is_animated: true,
    default_colors: { primary: "#D4A017", secondary: "#1A0533", accent: "#8B5CF6" },
    custom_fields: [
      { key: "speakerName", label: "Intervenant principal", type: "text", required: false, placeholder: "Dr. Amina Koné" },
    ],
    demo_images: ["hero.jpg"],
  },
  {
    web_template_key: "executive-summit",
    name: "Executive Summit",
    description: "Sommet exécutif sobre et prestige.",
    event_type: "corporate",
    tier: "premium",
    sort_order: 11,
    is_animated: true,
    default_colors: { primary: "#1A1A2E", secondary: "#FFFFFF", accent: "#D4A017" },
    custom_fields: [
      { key: "speakerName", label: "Intervenant principal", type: "text", required: false, placeholder: "Dr. Amina Koné" },
    ],
    demo_images: ["hero.jpg"],
  },

  // ─── Soirée VIP ───────────────────────────────────────────────────────────
  {
    web_template_key: "golden-gala",
    name: "Golden Gala",
    description: "Soirée VIP dorée et luxueuse.",
    event_type: "soiree_vip",
    tier: "premium",
    sort_order: 12,
    is_animated: true,
    default_colors: { primary: "#D4A017", secondary: "#0A0A0A", accent: "#F5D060" },
    custom_fields: [
      { key: "dresscodeText", label: "Dress code", type: "text", required: false, placeholder: "Black tie" },
    ],
    demo_images: ["hero.jpg"],
  },
  {
    web_template_key: "midnight-accra",
    name: "Midnight Accra",
    description: "Soirée VIP nocturne aux inspirations africaines.",
    event_type: "soiree_vip",
    tier: "premium",
    sort_order: 13,
    is_animated: true,
    default_colors: { primary: "#FF6B35", secondary: "#0D0D0D", accent: "#FFD700" },
    custom_fields: [
      { key: "dresscodeText", label: "Dress code", type: "text", required: false, placeholder: "Afro-chic" },
    ],
    demo_images: ["hero.jpg"],
  },

  // ─── Autre ────────────────────────────────────────────────────────────────
  {
    web_template_key: "simple-other",
    name: "Simple & Élégant",
    description: "Template universel sobre pour tout type d'événement.",
    event_type: "autre",
    tier: "gratuit",
    sort_order: 14,
    is_animated: false,
    default_colors: { primary: "#5B21B6", secondary: "#FFFFFF", accent: "#D4A017" },
    custom_fields: [],
    demo_images: [],
  },
];

/** Map par web_template_key pour accès rapide */
export const TEMPLATES_BY_KEY = Object.fromEntries(
  TEMPLATES_REGISTRY.map((t) => [t.web_template_key, t])
) as Record<string, TemplateRegistryEntry>;

/** Labels lisibles pour event_type */
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  mariage: "Mariage",
  anniversaire: "Anniversaire",
  bapteme: "Baptême",
  soiree_vip: "Soirée VIP",
  corporate: "Corporate",
  autre: "Autre",
};
