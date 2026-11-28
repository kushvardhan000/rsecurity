export type FeaturedService = {
  slug: string;
  title: string;
  short: string;
  long: string;
  image: string;
  focal: string;
  tag: string;
  todo?: boolean;
};

export type AlsoService = {
  slug: string;
  title: string;
};

export const FEATURED_SERVICES: FeaturedService[] = [
  {
    slug: "industrial",
    title: "Security Services",
    short:
      "Dependable security solutions for industrial, corporate, government, and PSU clients, backed by strict compliance standards and disciplined personnel.",
    long:
      "We provide dependable security solutions for industrial installations, corporate establishments, government bodies, and Public Sector Undertakings (PSUs). Our services are backed by strict compliance standards, professionally trained personnel, and disciplined security practices to ensure the protection of people, property, infrastructure, and valuable resources.",
    image:
    "/services/01.png",
    focal: "center center",
    tag: "01",
    todo: false,
  },
  {
    slug: "manpower",
    title: "Human Resource",
    short:
      "Reliable workforce supply tailored to the operational needs of government bodies, PSUs, and commercial enterprises.",
    long:
      "We provide reliable and professionally managed manpower solutions tailored to the operational requirements of government bodies, Public Sector Undertakings (PSUs), and commercial enterprises. Our workforce deployment focuses on organizational requirements, operational efficiency, and dependable personnel to support diverse business and institutional operations.",
    image: "/services/02.jpeg",
    focal: "center center",
    tag: "02",
    todo: false,
  },
  {
    slug: "training",
    title: "Training and Certification",
    short:
      "Accredited Skill Training Centres since 2012, developing skilled professionals under NSQF through MEPSC and NSDC.",
    long:
      "Since 2012, our Skill Training Centres have been accredited by the Management & Entrepreneurship and Professional Skills Council (MEPSC) and the National Skill Development Corporation (NSDC), under the Ministry of Skill Development and Entrepreneurship, Government of India. We train young men and women under the National Skill Qualification Framework (NSQF), equipping them with professional skills and industry-relevant competencies to elevate professionalism across the security and services sector.",
    image: "/services/04.jpeg",
    focal: "center center",
    tag: "03",
    todo: false,
  },
] as const;

export const ALSO_SERVICES: AlsoService[] = [
  { slug: "township", title: "Township" },
  { slug: "retail", title: "Retail" },
  { slug: "hotel", title: "Hotel" },
  { slug: "detective", title: "Detective" },
  { slug: "cellular", title: "Cellular" },
  { slug: "dog-squad", title: "Dog Squad" },
  { slug: "manpower", title: "Manpower Supply" },
] as const;