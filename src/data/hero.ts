export type HeroSlide = {
  src: string;
  alt: string;
  focal: string;
  focalMobile: string;
  caption: string;
  w: number;
  h: number;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/hero/slide-1-gate.jpg",
    alt: "Guards on duty at an industrial site",
    focal: "center center",
    focalMobile: "50% 20%",
    caption: "Securing industrial infrastructure · 2023",
    w: 1920,
    h: 1281,
  },
  {
    src: "/hero/slide-2-industrial.jpg",
    alt: "Professional guards monitoring the main entrance",
    focal: "center top",
    focalMobile: "50% 20%",
    caption: "Access control and perimeter defense",
    w: 1920,
    h: 1282,
  },
  {
    src: "/hero/slide-1-training.jpg",
    alt: "Cadets undergoing rigorous physical training",
    focal: "center top",
    focalMobile: "50% 20%",
    caption: "Training batches undergoing drills",
    w: 2048,
    h: 1234,
  },
  {
    src: "/hero/slide-5-summit.jpg",
    alt: "CAPSI/Skill summit event",
    focal: "center center",
    focalMobile: "50% 20%",
    caption: "Industry representation at CAPSI Summit · New Delhi",
    w: 1024,
    h: 768,
  },
  {
    src: "/hero/slidee.jpeg",
    alt: "Jindal Steel placement drive",
    focal: "center top",
    focalMobile: "50% 20%",
    caption: "Placement drive at Jindal Steel · 2023",
    w: 922,
    h: 691,
  },
];
