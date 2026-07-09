import Faqs from "@/features/restaurant/Faqs";
import Hero from "@/features/restaurant/Hero";
import Marquee from "@/features/restaurant/Marquee";
import MenuCategories from "@/features/restaurant/MenuCategories";
import PageAnimations from "@/features/restaurant/PageAnimations";
import PromoBanner from "@/features/restaurant/PromoBanner";
import Signatures from "@/features/restaurant/Signatures";

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
