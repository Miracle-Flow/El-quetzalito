import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Crimson_Text,
  Ephesis,
  Figtree,
  Geist_Mono,
  Playfair_Display,
} from "next/font/google";

import Footer from "@/features/marketing/Footer";
import Navbar from "@/features/marketing/Navbar";

import "../globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const ephesis = Ephesis({
  variable: "--font-ephesis",
  subsets: ["latin"],
  weight: ["400"],
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

// Retained so shadcn's @theme inline --font-mono keeps a definition.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Quetzalito — Real Mexican, Fresh Off the Fire",
  description:
    "Street-style tacos, slow-braised birria, and handmade tortillas — pressed and fired to order. Order online for pickup or delivery.",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${figtree.variable} ${playfair.variable} ${ephesis.variable} ${crimson.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
