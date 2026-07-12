import type { Metadata } from "next";

import MenuOrder from "@/features/marketing/menu/MenuOrder";
import PageAnimations from "@/features/marketing/PageAnimations";

export const metadata: Metadata = {
  title: "The Menu — El Quetzalito",
  description:
    "Guatemalan platters, breakfast, seafood and traditional atoles — the full menu at El Quetzalito. Order for pickup or delivery.",
};

export default function MenuPage() {
  return (
    <>
      <MenuOrder />
      <PageAnimations />
    </>
  );
}
