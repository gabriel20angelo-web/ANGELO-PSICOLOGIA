import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import MaterialsPreview from '@/components/home/MaterialsPreview';
import FutureContent from '@/components/home/FutureContent';

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
        <FutureContent />
      </main>
      <Footer showMaterialsCta={true} />
    </>
  );
}
