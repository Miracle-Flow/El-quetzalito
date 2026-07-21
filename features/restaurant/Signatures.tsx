"use client";

import Image from "next/image";

import { useTranslation } from "@/lib/i18n";

import { Button } from "@/components/ui/button";

import { useCartStore } from "@/src/store/cart.ts";

import GuatemalanPattern from "./GuatemalanPattern";

const plates = [
  {
    slug: "churrasco-tikal",
    nameKey: "sig.plate1.name",
    spanishName: "Churrasco Tikal",
    descKey: "sig.plate1.desc",
    price: 20,
    src: "/Menu/Churrasco_Tikal.avif",
  },
  {
    slug: "carne-asada",
    nameKey: "sig.plate2.name",
    spanishName: "Carne Asada",
    descKey: "sig.plate2.desc",
    price: 15,
    src: "/Menu/Carne Asada.avif",
  },
  {
    slug: "costillas-bbq",
    nameKey: "sig.plate3.name",
    spanishName: "Costillas BBQ",
    descKey: "sig.plate3.desc",
    price: 18,
    src: "/Menu/Costillas BBQ.avif",
  },
  {
    slug: "alitas-bbq",
    nameKey: "sig.plate4.name",
    spanishName: "Alitas BBQ",
    descKey: "sig.plate4.desc",
    price: 14,
    src: "/Menu/Alitas BBQ.avif",
  },
  {
    slug: "desayuno-el-quetzalito",
    nameKey: "sig.plate5.name",
    spanishName: "Desayuno El Quetzalito",
    descKey: "sig.plate5.desc",
    price: 12,
    src: "/Menu/Desayuno El Quetzalito.avif",
  },
  {
    slug: "pepian-gallina-res",
    nameKey: "sig.plate6.name",
    spanishName: "Pepián de Gallina o Res",
    descKey: "sig.plate6.desc",
    price: 14,
    src: "/Menu/Pepián de Gallina o Res.avif",
  },
];

function slugToId(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = Math.trunc(hash * 31 + (slug.codePointAt(i) ?? 0)) % 2_147_483_647;
  }
  return Math.abs(hash);
}

export default function Signatures() {
  const { t, locale } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

  function handleAdd(plate: (typeof plates)[number]) {
    addItem(
      {
        id: slugToId(plate.slug),
        name: plate.spanishName,
        basePrice: plate.price * 100,
        category: "Signatures",
        categoryId: 0,
        availabilityType: "steamTable",
      },
      [],
      1,
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#FEFBEE] px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24">
      {/* Huipil textile pattern — decorative background */}
      <GuatemalanPattern
        patternId="gt-huipil-sig"
        className="pointer-events-none absolute inset-0 h-full w-full text-navy opacity-[0.04]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[70%] -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(29,52,84,0.08),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-base font-bold tracking-[0.28em] text-navy sm:text-lg">
            {t("sig.eyebrow")}
          </p>
          <h2 className="mt-5 font-display text-6xl font-extrabold tracking-tight text-ink sm:text-7xl lg:text-8xl">
            {t("sig.heading")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-moss sm:text-xl">
            {t("sig.subheading")}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plates.map((plate) => {
            const displayName = t(plate.nameKey);
            const showSubName = locale === "en";

            return (
              <li key={plate.slug}>
                <article className="flex items-start gap-4 rounded-xl border border-cream-deep bg-white p-4 transition-shadow duration-200 hover:shadow-md">
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className="text-base leading-snug font-bold text-ink">{displayName}</h3>
                      {showSubName && (
                        <span className="text-xs font-medium text-moss/70 italic">
                          {plate.spanishName}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-moss">
                      {t(plate.descKey)}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <p className="text-sm font-bold text-ink">${plate.price}</p>
                      <Button size="sm" onClick={() => handleAdd(plate)}>
                        + Add
                      </Button>
                    </div>
                  </div>
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                    <Image
                      src={plate.src}
                      alt={plate.spanishName}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 text-center">
          <a
            href="/menu"
            className="group inline-flex items-baseline gap-3 font-serif text-lg text-ink italic"
          >
            <span className="border-b border-navy/60 pb-1 transition-colors group-hover:border-navy">
              {t("sig.viewFull")}
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
