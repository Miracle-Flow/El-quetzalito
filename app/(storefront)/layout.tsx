import LanguageProvider from "@/features/marketing/language-provider";
import Footer from "@/features/restaurant/Footer";
import Navbar from "@/features/restaurant/Navbar";

import "../globals.css";

/**
 * Storefront (cart / checkout) shares marketing chrome so cart trigger
 * and navigation stay available during ordering.
 */
export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 pt-24">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
