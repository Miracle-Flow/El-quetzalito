import type { Metadata } from "next";

import MenuCarta from "@/features/restaurant/MenuCarta";
import PageAnimations from "@/features/restaurant/PageAnimations";

export const metadata: Metadata = {
  title: "The Menu — El Quetzalito",
  description:
    "Guatemalan platters, breakfast, seafood and traditional atoles — the full menu at El Quetzalito. Order for pickup or delivery.",
};

export default function MenuPage() {
  return (
    <>
      <MenuCarta />
      <PageAnimations />
    </>
  );
}
