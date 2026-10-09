
export const ABOUT = {
  eyebrow: "About Ranchi Security",
  headline: "Built by soldiers. Driven by skill.",
  accent: "Driven",

  // TODO: confirm founding year (site says 1995/1997 in places)
  body: "Founded in 1995 by ex-servicemen and energetic young professionals, Ranchi Security is one of Jharkhand's pioneering private security companies, delivering protection through quality training, innovation and strict compliance.",

  credentials: [
    "Ex-servicemen led",
    "Skill India & MEPSC affiliated",
    "Government skill-mission partner",
  ],

  cta: {
    label: "Our story →",
    href: "#",
  },

  // Stat strip (replaces "By the numbers" section)
  stats: [
    { label: "Personnel deployed", count: 40000, suffix: "+" },
    { label: "Youth trained & certified", count: 25000, suffix: "+" },
    { label: "Ex-servicemen deployed", count: 500, suffix: "+" },
    { label: "Group organisations", count: 3, suffix: "" },
  ],

  // Our group of three organisations
  groupTitle: "Our group",
  organisations: [
    { name: "Ranchi Security Pvt. Ltd.", note: "Private security, skill training & manpower" },
    { name: "Bhootpurv Sainik Kalyan Sangh", note: "Ex-servicemen welfare" },
    { name: "Barkha Consultancy Services Pvt. Ltd.", note: "Consultancy" },
  ],

  images: {
    portrait: "/about/director-minister.jpg",
    portraitAlt: "Director of Ranchi Security Pvt. Ltd., an ex-serviceman",
    landscape: "/about/guard-training.jpg",
    landscapeAlt: "Security guards in training formation",
  },

  badgeText: "RANCHI SECURITY · EX-SERVICEMEN LED · ESTD 1995 · ",
} as const;

export type AboutStat = (typeof ABOUT.stats)[number];
export type AboutOrg = (typeof ABOUT.organisations)[number];