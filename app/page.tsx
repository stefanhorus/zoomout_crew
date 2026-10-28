import { Intro } from "@/components/home/Intro";
import { ParallaxBand } from "@/components/home/ParallaxBand";
import { SelectedWork } from "@/components/home/SelectedWork";
import { ServicesIndex } from "@/components/home/ServicesIndex";
import { ShopTeaser } from "@/components/home/ShopTeaser";
import { TextMarquee } from "@/components/home/TextMarquee";
import { ZoomHero } from "@/components/home/ZoomHero";
import { CallToAction } from "@/components/site/CallToAction";
import { LogoMarquee } from "@/components/site/LogoMarquee";
import { Process } from "@/components/site/Process";
import { Testimonials } from "@/components/site/Testimonials";

export default function Home() {
  return (
    <>
      <ZoomHero />
      <Intro />
      <LogoMarquee />
      <SelectedWork />
      <ServicesIndex />
      <TextMarquee />
      <Process backdrop />
      <ParallaxBand />
      <Testimonials backdrop />
      <ShopTeaser />
      <CallToAction backdrop />
    </>
  );
}
