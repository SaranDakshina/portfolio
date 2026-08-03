import Hero from "@/components/sections/Hero";
import FeaturedWork from "@/components/sections/FeaturedWork";
import CareerTimeline from "@/components/career-timeline/CareerTimeline";
import Skills from "@/components/sections/Skills";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <CareerTimeline />
      <Skills />
      <About />
      <Contact />
    </>
  );
}
