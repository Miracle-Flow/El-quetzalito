"use client";

import { useEffect, useRef } from "react";

import { useTranslation } from "@/lib/i18n";

import { ArrowRightIcon } from "./icons";

export default function Hero() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari checks the muted DOM property (not the HTML attribute) before allowing
    // autoplay. React's muted prop only sets the attribute, so we set the property too.
    video.muted = true;

    const tryPlay = () => {
      video.play().catch((_err: unknown) => {
        // Autoplay blocked (Low Power Mode, browser policy, etc.)
      });
    };

    // If data is already buffered (e.g. fast connection), play immediately.
    // Otherwise wait until Safari has enough data to start.
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
      return () => video.removeEventListener("loadeddata", tryPlay);
    }
  }, []);

  return (
    <section
      id="top"
      className="relative isolate w-full overflow-hidden bg-black text-cream"
      style={{ minHeight: "100svh" }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/herowalkin.mp4" type="video/mp4" />
      </video>

      {/* centered content */}
      <div
        className="relative flex flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: "100svh" }}
      >
        <img
          src="/logo.png"
          alt="El Quetzalito"
          className="h-28 w-auto sm:h-36 lg:h-44 xl:h-52"
          style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.4))" }}
        />
      </div>

      {/* chef's signature CTA — bottom right */}
      <a
        href="/menu"
        aria-label="Order online for pickup and delivery"
        className="group absolute right-6 bottom-8 z-10 flex flex-col items-end text-right sm:right-10 sm:bottom-12 lg:right-16 lg:bottom-14"
      >
        <div className="rounded-2xl bg-black/50 px-6 py-5 ring-1 ring-white/10 backdrop-blur-sm">
          <span
            className="block text-5xl leading-[0.9] text-cream sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-script)" }}
          >
            {t("hero.orderHere")}
          </span>

          <span className="mt-4 flex items-center justify-end gap-3 text-[0.68rem] font-semibold tracking-[0.32em] text-cream/85 uppercase sm:mt-5">
            <span
              aria-hidden="true"
              className="block h-px w-8 bg-cream/60 transition-all duration-500 group-hover:w-14 group-hover:bg-cream"
            />
            {t("hero.pickup")}
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </div>
      </a>
    </section>
  );
}
