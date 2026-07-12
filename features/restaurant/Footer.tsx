"use client";

import Image from "next/image";

import { useTranslation } from "@/lib/i18n";

import heroBg from "@/features/restaurant/assets/Parrillada Chapina.webp";

import { Logo } from "./icons";

export default function Footer() {
  const { t } = useTranslation();

  const navLinks = [
    { href: "/", labelKey: "nav.home" },
    { href: "/menu", labelKey: "nav.menu" },
    { href: "/#faqs", labelKey: "nav.faqs" },
    { href: "/#contact", labelKey: "nav.contact" },
  ];

  return (
    <footer id="contact" className="relative scroll-mt-20 overflow-hidden bg-black text-cream">
      <Image
        src={heroBg}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 object-cover opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/78 to-black"
      />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-28 lg:py-32">
        <div className="flex justify-center">
          <Logo dark size="xl" />
        </div>

        <h2 className="mt-10 font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-white sm:text-6xl xl:text-7xl">
          Cocina <span className="text-gold">Chapina.</span>
        </h2>

        <nav aria-label="Footer navigation" className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {navLinks.map(({ href, labelKey }) => (
              <li key={labelKey}>
                <a
                  href={href}
                  className="text-base font-semibold text-cream transition-colors hover:text-gold"
                >
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-cream/70">
          <span>1428 Calle del Mercado</span>
          <Dot />
          <a href="tel:+15555550123" className="transition-colors hover:text-white">
            +1 (555) 555-0123
          </a>
          <Dot />
          <a href="mailto:hola@elquetzalito.com" className="transition-colors hover:text-white">
            hola@elquetzalito.com
          </a>
        </div>

        <div className="mt-14 h-px w-full bg-white/10" />

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-cream/70">
          <li>
            <a href="#top" className="transition-colors hover:text-white">
              {t("footer.privacy")}
            </a>
          </li>
          <li>
            <a href="#top" className="transition-colors hover:text-white">
              {t("footer.terms")}
            </a>
          </li>
        </ul>

        <p className="mt-6 text-sm text-cream/60">
          {t("footer.copyright")} {t("footer.tagline")}
        </p>
        <p className="mt-3 text-sm text-cream/60">
          {t("footer.madeWith")} <span className="font-semibold text-gold">Guatemala</span>
        </p>
      </div>
    </footer>
  );
}

function Dot() {
  return <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cream/40" />;
}
