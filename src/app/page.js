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

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Prelude />
        <About />
        <div className="max-w-[1180px] mx-auto px-6 md:px-12 py-4">
          <MandalaDivider size={56} opacity={0.3} />
        </div>
        <Cartography />
        <StudyPaths />
        <MaterialsPreview />
        <CoursesPreview />
        <BlogPreview />
        <Testimonials />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer showMaterialsCta={false} />
    </>
  );
}
