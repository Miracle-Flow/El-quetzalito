import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import MenuCategories from "@/components/MenuCategories";
import Signatures from "@/components/Signatures";
import PromoBanner from "@/components/PromoBanner";
import Faqs from "@/components/Faqs";
import Footer from "@/components/Footer";
import PageAnimations from "@/components/PageAnimations";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <MenuCategories />
        <Signatures />
        <PromoBanner />
        <Faqs />
      </main>
      <Footer />
      <PageAnimations />
    </>
  );
}
