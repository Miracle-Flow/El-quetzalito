"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo, BagIcon } from "./icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Non-home pages: navbar is always solid so it reads against light section backgrounds.
  const solid = !isHome || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-cream-deep bg-white/90 shadow-[0_6px_20px_-8px_rgba(32,48,27,0.18)] backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="flex h-24 items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24">
        <a href="/" aria-label="El Quetzalito — home">
          <Logo size="lg" dark={!solid} />
        </a>

        <ul className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-lg font-semibold transition-colors ${
                  solid
                    ? "text-moss hover:text-pine"
                    : "text-cream/90 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="/menu"
            className={`hidden rounded-full px-7 py-3.5 text-base font-bold transition-colors sm:inline-flex sm:items-center sm:gap-2 ${
              solid
                ? "bg-pine text-white hover:bg-pine-deep"
                : "bg-cream/95 text-ink hover:bg-white"
            }`}
          >
            <BagIcon className="h-5 w-5" />
            Order Now
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors lg:hidden ${
              solid ? "text-ink" : "text-cream"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-cream-deep bg-white px-4 pb-4 lg:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-sage"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="/menu"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-pine px-5 py-2.5 text-center text-sm font-bold text-white"
              >
                Order Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
