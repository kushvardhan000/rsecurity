export type ClientData = {
  name: string;
  slug: string;
  placeholder: boolean;
  logoUrl?: string;
};

export const CLIENTS_HEADING = {
  part1: "TRUSTED BY",
  part2: "Giants",
};

export const CLIENTS: ClientData[] = [
  { name: "Central Coalfields Limited", slug: "ccl", placeholder: false, logoUrl: "/clients/ccl.svg" },
  { name: "G4S", slug: "g4s", placeholder: false, logoUrl: "/clients/g4s.svg" },
  { name: "Himatsingka", slug: "himatsingka", placeholder: false, logoUrl: "/clients/himatsingka.svg" },
  { name: "ICFAI", slug: "icfai", placeholder: false, logoUrl: "/clients/icfai.svg" },
  { name: "IIT Bhubaneswar", slug: "iitbbs", placeholder: false, logoUrl: "/clients/iitbbs.svg" },
  { name: "Jindal Steel & Power", slug: "jindalsteelpower", placeholder: false, logoUrl: "/clients/jindalsteelpower.svg" },
  { name: "JSW", slug: "jsw", placeholder: false, logoUrl: "/clients/jsw.svg" },
  { name: "NIFT", slug: "nift", placeholder: false, logoUrl: "/clients/nift.svg" },
  { name: "OPGC", slug: "opgc", placeholder: false, logoUrl: "/clients/opgc.svg" },
  { name: "SAIL", slug: "sail", placeholder: false, logoUrl: "/clients/sail.svg" },
  { name: "Tata Steel", slug: "tatasteel", placeholder: false, logoUrl: "/clients/tatasteel.svg" },
  { name: "Thriveni", slug: "thriveni", placeholder: false, logoUrl: "/clients/thriveni.svg" },

  ];
