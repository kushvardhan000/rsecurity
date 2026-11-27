import {
  AboutGroup,
  AboutJourney,
  AboutPillars,
  AboutStory,
} from "@/src/components/about/AboutEditorial";
import { Membership } from "@/src/components/membership/Membership";

export const metadata = {
  title: "About Ranchi Security | Ex-Servicemen Led Security & Training",
  description:
    "Founded in 1995 by ex-servicemen, Ranchi Security is one of Jharkhand's pioneering private security companies delivering protection through quality training, innovation and strict compliance.",
};

export default function AboutPage() {
  return (
    <>
      <AboutStory />
      <AboutJourney />
      <AboutGroup />
      <AboutPillars />
      <Membership variant="editorial" />
    </>
  );
}
