import { NAV_LINKS, type NavLink } from "./nav";

export const FOOTER = {
  // TODO: confirm footer tagline with client
  headline: "Secure. Skilled. Trusted.",

  about:
    "Ranchi Security Pvt. Ltd. is a Jharkhand-based private security, skill-training and manpower company led by ex-servicemen — serving Jharkhand, Bihar and Odisha with discipline.",

  quickLinks: NAV_LINKS as readonly NavLink[],

  // TODO: confirm column naming — first list mixes industries and service types
  services: [
    "Industrial",
    "Mining",
    "Escorting",
    "Institutional",
    "Event",
    "Township",
    "Detective",
    "Retail",
    "Hotel",
    "Cellular",
  ],

  serviceGroups: [
    "Security",
    "Training Certification & Consultancy",
    "Investigation",
    "Dog Squad",
    "Outsourcing",
    "Manpower Supply",
    "Marketing",
  ],

  // TODO: replace text badges with real affiliation logos
  affiliations: ["MEPSC", "JSDMS", "Skill India", "SKSDC", "CAPSI"],
} as const;
