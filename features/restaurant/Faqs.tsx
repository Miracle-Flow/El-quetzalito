"use client";

import { useTranslation } from "@/lib/i18n";

import GuatemalanPattern from "./GuatemalanPattern";

const faqKeys = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
];

export default function Faqs() {
  const { t } = useTranslation();

  return (
    <section
      id="faqs"
      className="relative scroll-mt-20 overflow-hidden bg-[#FEFBEE] px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24"
    >
      {/* Huipil textile pattern — decorative background */}
      <GuatemalanPattern
        patternId="gt-huipil-faqs"
        className="pointer-events-none absolute inset-0 h-full w-full text-navy opacity-[0.04]"
      />

      <div className="relative text-center">
        <p className="text-base font-bold tracking-[0.28em] text-navy sm:text-lg">
          {t("faq.eyebrow")}
        </p>
        <h2 className="mt-5 font-display text-6xl font-extrabold tracking-tight text-ink sm:text-7xl lg:text-8xl">
          {t("faq.heading")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-moss sm:text-xl lg:text-2xl">
          {t("faq.intro")}
        </p>
      </div>

      <div className="relative mt-20 grid gap-6 md:grid-cols-2 xl:gap-8">
        {faqKeys.map(({ q, a }) => (
          <div
            key={q}
            className="flex flex-col rounded-[2rem] border border-cream-deep bg-white p-10 shadow-[0_1px_0_rgb(32_48_27_/_0.04),0_16px_40px_-24px_rgb(32_48_27_/_0.18)] sm:p-12"
          >
            <h3 className="font-display text-2xl leading-tight font-extrabold text-ink sm:text-3xl">
              {t(q)}
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-moss sm:text-xl">{t(a)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
