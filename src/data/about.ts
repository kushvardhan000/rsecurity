
export const ABOUT = {
  eyebrow: "About Ranchi Security",
  headline: "A Legacy of Trust, Discipline & Excellence",
  accent: "Excellence",

  summary:
      "Established in 1995, M/s Ranchi Security (P) Ltd. is one of the pioneers of Jharkhand's private security industry. Registered under the Companies Act, 1956, this Ex-Servicemen enterprise has built its legacy on military discipline, integrity and operational excellence, emerging as a thought and knowledge leader in the industry.",
  homeDetail:
    "Empanelled with the Directorate General Resettlement (DGR), Ministry of Defence, since 1996, RSP has served government departments, PSUs and industry with disciplined, dependable service.",
  body: [
    "M/s Ranchi Security (P) Ltd. (RSP) has been among the pioneers of the private security industry in Jharkhand since its incorporation under the Companies Act 1956 in 1995. An Ex-Servicemen enterprise, RSP has contributed as a thought and knowledge leader in the industry since its inception.",
    "Empanelled with the Directorate General Resettlement (DGR), Ministry of Defence, since 1996, RSP has been sponsored to serve government departments and Public Sector Undertakings (PSUs). Over the years, it has built a strong reputation for honest, sincere and efficient service across government, PSU and industry assignments.",
    "Through continuous innovation, quality training and rigorous compliance, RSP delivers dependable security solutions—an approach recognised with honours from industry-linked organisations.",
  ],

  whyChooseUs: [
    {
      title: "Ex-Servicemen Leadership",
      description:
        "Built on military discipline, integrity and operational accountability.",
      icon: "shield",
    },
    {
      title: "Government Empanelment",
      description:
        "DGR-empanelled with the Ministry of Defence since 1996.",
      icon: "government",
    },
    {
      title: "ISO 9001:2015 Certification",
      description:
        "Quality systems that support consistent, reliable service delivery.",
      icon: "quality",
    },
    {
      title: "NSDC/MEPSC Accredited Training",
      description:
        "NSDC and MEPSC-accredited training under NSQF standards.",
      icon: "training",
    },
  ],

  cta: {
    label: "Our story",
    href: "/about",
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
    portrait: "/about/bg-image.png",
    portraitAlt:
      "Ranchi Security leadership presenting company credentials",
    campus: "/about/bg-image.png",
    campusAlt:
      "Ranchi Security leadership presenting company credentials",
    cutout: "/about/bg-image.png",
    cutoutAlt: "Ranchi Security leadership portrait",
  },

  badgeText: "RANCHI SECURITY · EX-SERVICEMEN LED · ESTD 1995 · ",
} as const;

export type AboutStat = (typeof ABOUT.stats)[number];
export type AboutOrg = (typeof ABOUT.organisations)[number];