export const SITE = {
  companyName: "Ranchi Security Pvt. Ltd.",
  shortName: "RSPL",
  tagline:
    "Disciplined security, certified training and dependable manpower — led by ex-servicemen across Jharkhand, Bihar and Odisha.",

  // TODO: confirm establishment year — live site says 1997
  establishedYear: 1995,

  contact: {
    // TODO: add real phone number
    phone: "0651-2280191, 09234012013, 09234615297",
    email: "security.rsp@gmail.com",
    // TODO: add real office address
    address: "301, Girdhar Plaza, Opp Gaushala, Harmu Bypass Road, Ranchi-834001",
  },

  socials: [
    { label: "Email", href: "mailto:security.rsp@gmail.com" },
    { label: "Twitter", href: "https://twitter.com/RSPL6" },
    { label: "Facebook", href: "https://www.facebook.com/" },
  ],

  stats: {
    deployed: 40000,
    trained: 25000,
  },
} as const;

export type Site = typeof SITE;
