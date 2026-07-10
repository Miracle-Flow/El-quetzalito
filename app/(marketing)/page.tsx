import Faqs from "@/features/marketing/Faqs";
import Hero from "@/features/marketing/Hero";
import Marquee from "@/features/marketing/Marquee";
import MenuCategories from "@/features/marketing/MenuCategories";
import PageAnimations from "@/features/marketing/PageAnimations";
import PromoBanner from "@/features/marketing/PromoBanner";
import Signatures from "@/features/marketing/Signatures";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <MenuCategories />
      <Signatures />
      <PromoBanner />
      <Faqs />
      <PageAnimations />
    </>
  );
}
