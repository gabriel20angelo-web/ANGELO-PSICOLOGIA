import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import Prelude from '@/components/home/Prelude';
import About from '@/components/home/About';
import Cartography from '@/components/home/Cartography';
import StudyPaths from '@/components/home/StudyPaths';
import MaterialsPreview from '@/components/home/MaterialsPreview';
import CoursesPreview from '@/components/home/CoursesPreview';
import BlogPreview from '@/components/home/BlogPreview';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import ContactCTA from '@/components/home/ContactCTA';
import MandalaDivider from '@/components/ui/MandalaDivider';
import {
  AlchemyDivider,
  DiamondChain,
} from '@/components/illustrations';

function Break({ children, pad = 'py-4' }) {
  return (
    <div className={`max-w-[1180px] mx-auto px-6 md:px-12 ${pad}`}>{children}</div>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Prelude />
        <About />
        <Break>
          <MandalaDivider size={56} opacity={0.3} />
        </Break>
        <Cartography />
        <Break pad="py-2">
          <AlchemyDivider />
        </Break>
        <StudyPaths />
        <MaterialsPreview />
        <Break pad="py-2">
          <DiamondChain />
        </Break>
        <CoursesPreview />
        <BlogPreview />
        <Break pad="py-2">
          <AlchemyDivider />
        </Break>
        <Testimonials />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer showMaterialsCta={false} />
    </>
  );
}
