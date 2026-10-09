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
    title: "Industrial Security",
    short: "Protection of industrial installations, utilities, materials and classified information against loss and damage.",
    long: "Protection of industrial installations, resources, utilities, materials and classified information essential to prevent loss or damage.",
    image: "/services/industrial.jpg",
    focal: "center center",
    tag: "01",
  },
  {
    slug: "mining",
    title: "Mining Security",
    short: "Access control, visitor and contractor accountability, and patrol vehicles for large mine sites. Reduces pilferage and keeps teams safe.",
    long: "Security, access control and accountability are fundamental to a safe environment for employees, contractors and visitors at mine sites. Our controlled measures cover employee, contractor and visitor management and emergency evacuation accountability. RSP deploys professionally trained mine security guards and site-compliant patrol and high-speed patrol vehicles to supervise vast regional sites and reduce pilferage.",
    image: "/services/mining.jpg",
    focal: "center center",
    tag: "02",
  },
  {
    slug: "escort",
    title: "Escort Security",
    short: "Trained escort teams for valuables, personnel and goods in transit.",
    long: "Armoured and dignitary escort for VIPs, cash and valuables — every movement planned route-by-route with vetted, licensed personnel.",
    image: "/services/escort.jpg",
    focal: "center center",
    tag: "03",
    todo: true,
  },
  {
    slug: "institutional",
    title: "Institutional Security",
    short: "Disciplined guarding for campuses, hospitals and offices, with visitor management and emergency response.",
    long: "Guard placement for schools, colleges, hospitals, government offices and PSU premises, with access control and visitor management.",
    image: "/services/institutional.jpg",
    focal: "center center",
    tag: "04",
    todo: true,
  },
  {
    slug: "event",
    title: "Event Security",
    short: "Crowd, access and VIP management for conferences, weddings and public events.",
    long: "Crowd control, entry screening and perimeter security for weddings, conferences, exhibitions and public events of any scale.",
    image: "/services/event.jpg",
    focal: "center center",
    tag: "05",
    todo: true,
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