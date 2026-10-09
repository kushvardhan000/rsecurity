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
    id: "iedra-anirudha",
    slug: "iedra-anirudha",
    name: "IEDRA Anirudha",
    type: "Membership",
    image: "/membership/iedra-anirudha.jpeg",
    width: 800,
    height: 1000,
  },
  {
    id: "fjcci-ranchi",
    slug: "fjcci-ranchi",
    name: "FJCCI Ranchi",
    type: "Membership",
    image: "/membership/fjcci-ranchi.jpeg",
    width: 800,
    height: 1000,
  },
  {
    id: "apdi-2018",
    slug: "apdi-2018",
    name: "APDI 2018",
    type: "Membership",
    image: "/membership/apdi-2018.jpeg",
    width: 800,
    height: 1000,
  },
  {
    id: "all-india-human-rights-association",
    slug: "all-india-human-rights-association",
    name: "All India Human Rights Association",
    type: "Membership",
    image: "/membership/all-india-human-rights-association.jpeg",
    width: 800,
    height: 1000,
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