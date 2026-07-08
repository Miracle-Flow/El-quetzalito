"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import tacos1 from "@/assets/tacos1.jpg";
import tacos2 from "@/assets/tacos2.jpg";
import tacos3 from "@/assets/tacos3.jpg";
import tacos4 from "@/assets/tacos4.jpg";
import { ArrowRightIcon } from "./icons";

const slides = [
  { src: tacos1, alt: "A hand squeezing fresh lime over a row of tacos loaded with salsa, avocado and cilantro" },
  { src: tacos2, alt: "Street-style corn tortilla tacos with cilantro, radish and lime" },
  { src: tacos3, alt: "Close-up of slow-braised birria tacos with chopped onion and cilantro" },
  { src: tacos4, alt: "Charred flour tortilla tacos with rare steak, salsa verde and lime on parchment" },
];

const SLIDE_MS = 5500;
const FADE_MS = 1200;

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative isolate w-full overflow-hidden bg-black text-cream"
      style={{ minHeight: "100svh" }}
    >
      {/* stacked cross-fade slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i === active ? "false" : "true"}
          className="absolute inset-0 transition-opacity ease-out"
          style={{
            opacity: i === active ? 1 : 0,
            transitionDuration: `${FADE_MS}ms`,
          }}
        >
          <Image
            src={slide.src}
            alt={i === active ? slide.alt : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            className="que-hero-pullback object-cover"
          />
        </div>
      ))}

      {/* clean neutral vignette — base dim + top/bottom shading */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* centered content */}
      <div
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: "100svh" }}
      >
        <h1 className="font-serif font-normal uppercase leading-[1.08] tracking-[0.05em] text-cream text-[2.5rem] sm:text-6xl lg:text-7xl xl:text-[5.75rem]">
          Real masa
          <br />
          <span className="italic font-normal tracking-[0.02em]">Real fire</span>
        </h1>

      </div>

      {/* chef's signature CTA — bottom right */}
      <a
        href="/menu"
        aria-label="Order online for pickup and delivery"
        className="group absolute right-6 bottom-8 z-10 flex flex-col items-end text-right sm:right-10 sm:bottom-12 lg:right-16 lg:bottom-14"
      >
        <span
          className="block text-cream text-5xl leading-[0.9] sm:text-6xl lg:text-7xl"
          style={{
            fontFamily: "var(--font-script)",
            textShadow: "0 2px 18px rgba(0,0,0,0.45)",
          }}
        >
          Order here
        </span>

        <span className="mt-4 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-cream/85 sm:mt-5">
          <span
            aria-hidden="true"
            className="block h-px w-8 bg-cream/60 transition-all duration-500 group-hover:w-14 group-hover:bg-cream"
          />
          Pickup &amp; delivery
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
        </span>
      </a>
    </section>
  );
}
