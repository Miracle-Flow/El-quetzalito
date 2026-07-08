import Navbar from "@/components/Navbar";
import MenuCarta from "@/components/MenuCarta";
import PageAnimations from "@/components/PageAnimations";

export const metadata = {
  title: "The Menu — El Quetzalito",
  description:
    "Guatemalan platters, breakfast, seafood and traditional atoles — the full menu at El Quetzalito. Order for pickup or delivery.",
};

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <main>
        <MenuCarta />
      </main>
      <PageAnimations />
    </>
  );
}
