export type MembershipData = {
  id: string;
  slug: string;
  name: string;
  type: string;
  image: string;
  width: number;
  height: number;
};

export type MembershipLogoData = {
  id: string;
  caption: string;
  image: string;
};

export const MEMBERSHIPS: MembershipData[] = [
  {
    id: "capsi-security-leadership",
    slug: "capsi-security-leadership",
    name: "CAPSI Security Leadership",
    type: "Certificate",
    image: "/certificates/CAPSI Security Leadership Certificate.png",
    width: 1485,
    height: 1059,
  },
  {
    id: "iedra-excellence-in-security-service",
    slug: "iedra-excellence-in-security-service",
    name: "IEDRA Excellence in Security Service",
    type: "Award",
    image: "/certificates/IEDRA Excellence in Security Service Award.png",
    width: 1149,
    height: 1369,
  },
  {
    id: "indian-economic-development-membership",
    slug: "indian-economic-development-membership",
    name: "Indian Economic Development",
    type: "Membership",
    image:
      "/certificates/Indian Economic Development Membership Certificate.png",
    width: 1069,
    height: 1472,
  },
  {
    id: "global-achievers-award",
    slug: "global-achievers-award",
    name: "Global Achievers Award",
    type: "Award",
    image: "/certificates/Global Achievers Award Certificate.png",
    width: 1069,
    height: 1472,
  },
  {
    id: "global-achievers-foundation",
    slug: "global-achievers-foundation",
    name: "Global Achievers Foundation",
    type: "Certificate",
    image: "/certificates/Global Achievers Foundation Certificate.png",
    width: 1070,
    height: 1470,
  },
  {
    id: "digital-jagrukta-award",
    slug: "digital-jagrukta-award",
    name: "Digital Jagrukta Award",
    type: "Award",
    image: "/certificates/Digital Jagrukta Award Certificate.png",
    width: 1055,
    height: 1491,
  },
  {
    id: "assocham-skilling",
    slug: "assocham-skilling",
    name: "ASSOCHAM Skilling",
    type: "Certificate",
    image: "/certificates/Ornate ASSOCHAM Skilling Certificate.png",
    width: 1500,
    height: 1049,
  },
] as const;

export const MEMBERSHIP_LOGOS: MembershipLogoData[] = [
  {
    id: "sss",
    caption: "SSS",
    image: "/membership/membership-marquee-logo/sss.png",
  },
  {
    id: "ssog",
    caption: "SSOG",
    image: "/membership/membership-marquee-logo/ssog.png",
  },
  {
    id: "iedra",
    caption: "IEDRA",
    image: "/membership/membership-marquee-logo/iedra.png",
  },
  {
    id: "fjcci",
    caption: "FJCCI",
    image: "/membership/membership-marquee-logo/fjcci.png",
  },
  {
    id: "capsi",
    caption: "CAPSI",
    image: "/membership/membership-marquee-logo/capsi.png",
  },
  {
    id: "asci",
    caption: "ASCI",
    image: "/membership/membership-marquee-logo/asci.png",
  },
  {
    id: "apdi",
    caption: "APDI",
    image: "/membership/membership-marquee-logo/apdi.png",
  },
] as const;

export type Membership = (typeof MEMBERSHIPS)[number];
export type MembershipLogo = (typeof MEMBERSHIP_LOGOS)[number];