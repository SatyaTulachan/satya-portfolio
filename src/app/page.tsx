import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Work from '@/components/Work';
import Skills from '@/components/Skills';
import Playroom from '@/components/Playroom';
import Contact from '@/components/Contact';
import SmoothScroll from '@/components/SmoothScroll';
import GsapEffects from '@/components/GsapEffects';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Work />
        <Skills />
        <Playroom />
        <Contact />
      </main>
      <SmoothScroll />
      <GsapEffects />
    </>
  );
}
