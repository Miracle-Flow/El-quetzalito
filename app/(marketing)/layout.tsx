import type { Metadata } from "next";
import {
  Cinzel,
  Crimson_Text,
  Figtree,
  Geist_Mono,
  Great_Vibes,
  Playfair_Display,
} from "next/font/google";

import Footer from "@/features/marketing/Footer";
import LanguageProvider from "@/features/marketing/language-provider";
import Navbar from "@/features/marketing/Navbar";

import "../globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
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
      className={`${cinzel.variable} ${greatVibes.variable} ${figtree.variable} ${playfair.variable} ${crimson.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
