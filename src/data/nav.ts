/** Primary links — visible in desktop bar and mobile sheet */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Events', href: '/events' },
  { label: 'Awards', href: '/awards' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Secondary links — desktop side-panel + mobile sheet only */
export const SECONDARY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Clients', href: '/clients' },
  { label: 'Careers', href: '/careers' },
] as const;

/** Combined links shown in the mobile sheet (primary + selected secondary) */
export const MOBILE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Events', href: '/events' },
  { label: 'Awards', href: '/awards' },
  { label: 'Clients', href: '/clients' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
export type SecondaryLink = (typeof SECONDARY_LINKS)[number];
export type MobileLink = (typeof MOBILE_LINKS)[number];