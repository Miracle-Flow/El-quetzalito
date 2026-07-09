import Image from "next/image";
import heroTacos from "@/features/restaurant/assets/tacos1.jpg";
import { Logo } from "./icons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative scroll-mt-20 overflow-hidden bg-black text-cream">
      <Image
        src={heroTacos}
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

        <h2 className="mt-10 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-7xl">
          Cocina de <span className="text-[#2E5AA8]">Puebla.</span>
        </h2>

        <nav aria-label="Footer navigation" className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {navLinks.map(({ href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-base font-semibold text-cream transition-colors hover:text-[#2E5AA8]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-cream/70">
          <span>1428 Calle del Mercado, Puebla</span>
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
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#top" className="transition-colors hover:text-white">
              Terms &amp; Conditions
            </a>
          </li>
        </ul>

        <p className="mt-6 text-sm text-cream/60">
          © 2026 El Quetzalito · Real Mexican, fresh off the fire.
        </p>
        <p className="mt-3 text-sm text-cream/60">
          Hecho con cariño en{" "}
          <span className="font-semibold text-[#2E5AA8]">Puebla, MX</span>
        </p>
      </div>
    </footer>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cream/40" />
  );
}
