"use client";

import Image from "next/image";

import { useTranslation } from "@/lib/i18n";

import bowl from "@/features/restaurant/assets/bowl.jpg";

import { ArrowRightIcon, LimeDoodle } from "./icons";

export default function PromoBanner() {
  const { t } = useTranslation();

  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28 xl:px-24">
      <div className="relative overflow-hidden rounded-[3rem] bg-navy">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="relative h-80 sm:h-[28rem] lg:h-[640px]">
            <div className="absolute inset-8 overflow-hidden rounded-full lg:inset-y-14 lg:right-6 lg:left-14 lg:rounded-[4rem]">
              <Image
                src={bowl}
                alt="A colorful bowl with grilled chicken, corn, greens, and tomatoes"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="relative px-10 pt-4 pb-16 text-white sm:px-16 lg:py-24 lg:pr-24 lg:pl-6">
            <span className="inline-block rounded-full bg-white/15 px-6 py-2.5 text-sm font-bold tracking-[0.18em]">
              {t("promo.badge")}
            </span>
            <h2 className="mt-6 font-display text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl xl:text-7xl">
              {t("promo.heading")}
            </h2>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-white/80 sm:text-2xl">
              {t("promo.body")}
            </p>
            <a
              href="/menu"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-5 text-lg font-bold text-navy transition-colors hover:bg-cream"
            >
              {t("promo.cta")}
              <ArrowRightIcon className="h-6 w-6" />
            </a>
            <LimeDoodle className="absolute right-12 bottom-12 hidden h-36 w-36 rotate-12 lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
