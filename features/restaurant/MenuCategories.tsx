"use client";

import Image from "next/image";

import { useTranslation } from "@/lib/i18n";

const cards = [
  {
    titleKey: "Churrasco Tikal",
    labelKey: "menuCat.card1.label",
    descKey: "menuCat.card1.desc",
    src: "/Menu/Churrasco_Tikal.avif",
    alt: "Churrasco Tikal — grilled meats with cebollines and macaroni salad",
  },
  {
    titleKey: "Carne Asada",
    labelKey: "menuCat.card2.label",
    descKey: "menuCat.card2.desc",
    src: "/Menu/Carne Asada.avif",
    alt: "Carne Asada — grilled marinated beef with sides",
  },
  {
    titleKey: "Costillas BBQ",
    labelKey: "menuCat.card3.label",
    descKey: "menuCat.card3.desc",
    src: "/Menu/Costillas BBQ.avif",
    alt: "Costillas BBQ — BBQ pork ribs with sides",
  },
];

export default function MenuCategories() {
  const { t } = useTranslation();

  return (
    <section className="px-6 py-24 sm:px-10 lg:px-12 lg:py-32 xl:px-16">
      <div className="mx-auto w-full max-w-none">
        <div className="text-center">
          <p className="text-base font-bold tracking-[0.22em] text-navy sm:text-lg">
            {t("menuCat.eyebrow")}
          </p>
          <h2 className="mt-5 font-display text-6xl font-extrabold tracking-tight text-ink sm:text-7xl lg:text-8xl">
            {t("menuCat.heading")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-moss sm:text-xl lg:text-2xl">
            {t("menuCat.subheading")}
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-10">
          {cards.map(({ titleKey, labelKey, descKey, src, alt }) => (
            <li key={titleKey} data-menu-card>
              <a
                href="/menu"
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-[#FEFBEE] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(32,48,27,0.35)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-10 sm:p-12">
                  <p className="text-[0.7rem] font-semibold tracking-[0.32em] text-[#C8442C] uppercase">
                    {t(labelKey)}
                  </p>

                  <h3 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-[2.75rem]">
                    {titleKey}
                  </h3>

                  <p className="mt-5 flex-1 text-lg leading-relaxed text-moss">{t(descKey)}</p>

                  <p className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.28em] text-ink uppercase">
                    <span className="border-b border-ink/40 pb-1 transition-colors group-hover:border-navy">
                      {t("menuCat.seeMore")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 text-center">
          <a
            href="/menu"
            className="group inline-flex items-baseline gap-3 font-serif text-lg text-ink italic"
          >
            <span className="border-b border-navy/60 pb-1 transition-colors group-hover:border-navy">
              {t("menuCat.viewFull")}
            </span>
            <span
              aria-hidden="true"
              className="text-navy not-italic transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
