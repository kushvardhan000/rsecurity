export type GalleryItem = {
  id: string;
  image: string;
  imageAlt: string;
  caption: string;
  year: string;
  w: number;
  h: number;
};

// 9 unique images repeated to form 27 items, shifted to avoid vertical stacking duplicates
const baseImages = [
  {
    image: "/gallery/f6.jpeg",
    // Director Vigyan Kumar with President Pratibha Patil and the CAPSI delegation, 2013
    caption: "Conversation meet with President Pratibha Patil & CAPSI delegation.",
    year: "2013",
    w: 960,
    h: 637,
  },
  {
    image: "/gallery/gallery1.jpg",
    // Director Anirudha Singh with Maharaja Bhanu Prakash Singh of Narsimgarh
    caption: "Director Anirudha Singh with Maharaja Bhanu Prakash Singh.",
    year: "2012", 
    w: 2048,
    h: 1234,
  },
  {
    image: "/gallery/f1.jpg",
    // Best Training Partner (East) award, 2016
    caption: "Receiving Best Training Partner (East) award from Shri Rajiv Pratap Rudy.",
    year: "2016",
    w: 629,
    h: 353,
  },
  {
    image: "/gallery/f2.jpeg",
    // MoU for Mega Skill Centre with Jharkhand CM Raghubar Das
    caption: "MoU for Mega Skill Centre with Jharkhand CM Raghubar Das.",
    year: "2017",
    w: 599,
    h: 604,
  },
  {
    image: "/gallery/f3.jpg",
    // Security & Skill Leadership Award, 2015
    caption: "Security & Skill Leadership Award from Gen. V.K. Singh.",
    year: "2015",
    w: 220,
    h: 182,
  },
  {
    image: "/gallery/f4.jpg",
    // Director Anirudha Singh with former CM Arjun Munda
    caption: "Director Anirudha Singh with former CM Arjun Munda.",
    year: "2011",
    w: 243,
    h: 182,
  },
  {
    image: "/gallery/f5.jpg",
    // Global Achievers Award, Bangkok
    caption: "Global Achievers Award from the Deputy PM of Thailand, Bangkok.",
    year: "2014",
    w: 224,
    h: 183,
  },
  {
    image: "/gallery/15nov.jpg",
    // Best Security Skill & Training Centre award, Delhi
    caption: "Best Security Skill & Training Centre award, presented by MoS G. Kishan Reddy.",
    year: "2019",
    w: 960,
    h: 760,
  },
  {
    image: "/gallery/img30100.jpg",
    // Director Vigyan Kumar with the Ministry of Skill Development
    caption: "Director Vigyan Kumar with the Minister of Skill Development, Shri Jayant Chowdhary.",
    year: "2024",
    w: 601,
    h: 794,
  }
];

export const GALLERY: GalleryItem[] = [];

// Create 27 items by taking 3 passes over the base 9 images,
// applying an offset rotation to avoid vertical stacking.
for (let pass = 0; pass < 3; pass++) {
  const offset = pass * 3;
  for (let i = 0; i < 9; i++) {
    const srcIndex = (i + offset) % 9;
    const base = baseImages[srcIndex];
    GALLERY.push({
      id: "gallery-img-" + pass + "-" + i,
      image: base.image,
      imageAlt: base.caption,
      caption: base.caption,
      year: base.year,
      w: base.w,
      h: base.h,
    });
  }
}
