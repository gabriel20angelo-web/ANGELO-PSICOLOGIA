import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import MaterialsPreview from '@/components/home/MaterialsPreview';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import ContactCTA from '@/components/home/ContactCTA';
import FutureContent from '@/components/home/FutureContent';
import BlogPreview from '@/components/home/BlogPreview';
import CoursesPreview from '@/components/home/CoursesPreview';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">
          <div className="w-full h-px gold-gradient" />
        </div>
        <About />
        <MaterialsPreview />
        <CoursesPreview />
        <BlogPreview />
        <Testimonials />
        <FutureContent />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer showMaterialsCta={false} />
    </>
  );
}
