import { Hero } from "@/src/components/hero/Hero";
import Stats from "@/src/components/hero/Stats";
import { Services } from "@/src/components/services/Services";
import { HomeAbout } from "@/src/components/home/HomeAbout";
// import { WhyChooseUs } from "@/src/components/home/WhyChooseUs";
import { Events } from "@/src/components/events/Events";
import { Awards } from "@/src/components/awards/Awards";
import { Clients } from "@/src/components/Clients";
import { CTA } from "@/src/components/cta/CTA";

export default function HomePage() {
  return (
    <>
     <Stats />
      <Hero />
      <HomeAbout />
      <Services />
      {/* <WhyChooseUs /> */}
      {/* <Achievements /> */}
      <Events />
      <Awards />
      {/* <Membership /> */}
      {/* <Gallery /> */}
      <Clients />
      <CTA />
    </>
  );
}
