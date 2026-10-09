import { Hero } from "@/src/components/hero/Hero";
import Stats from "@/src/components/hero/Stats";
import { Services } from "@/src/components/services/Services";
import { Achievements } from "@/src/components/achievements/Achievements";
import { Events } from "@/src/components/events/Events";
import { Gallery } from "@/src/components/gallery/Gallery";
import { Awards } from "@/src/components/awards/Awards";
import { Membership } from "@/src/components/membership/Membership";
import { Clients } from "@/src/components/Clients";
import { CTA } from "@/src/components/cta/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Achievements />
      <Events />
      <Awards />
      <Membership />
      <Gallery />
      <Clients />
      <CTA />
    </>
  );
}
