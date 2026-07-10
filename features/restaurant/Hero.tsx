"use client";

import { ArrowRightIcon } from "./icons";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate w-full overflow-hidden bg-black text-cream"
      style={{ minHeight: "100svh" }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/herowalkin.mp4" type="video/mp4" />
      </video>

      {/* centered content */}
      <div
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: "100svh" }}
      >
        <h1 className="font-serif text-[2.5rem] leading-[1.08] font-normal tracking-[0.05em] text-cream uppercase sm:text-6xl lg:text-7xl xl:text-[5.75rem]">
          Real masa
          <br />
          <span className="font-normal tracking-[0.02em] italic">Real fire</span>
        </h1>
      </div>

      {/* chef's signature CTA — bottom right */}
      <a
        href="/menu"
        aria-label="Order online for pickup and delivery"
        className="group absolute right-6 bottom-8 z-10 flex flex-col items-end text-right sm:right-10 sm:bottom-12 lg:right-16 lg:bottom-14"
      >
        <span
          className="block text-5xl leading-[0.9] text-cream sm:text-6xl lg:text-7xl"
          style={{
            fontFamily: "var(--font-script)",
            textShadow: "0 2px 18px rgba(0,0,0,0.45)",
          }}
        >
          Order here
        </span>

        <span className="mt-4 flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.32em] text-cream/85 uppercase sm:mt-5">
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
