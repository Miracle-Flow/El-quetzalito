"use client";

import Image from "next/image";

import { useTranslation } from "@/lib/i18n";

import GuatemalanPattern from "./GuatemalanPattern";

const plates = [
  {
    name: "Churrasco Tikal",
    descKey: "sig.plate1.desc",
    price: "$20",
    src: "/Menu/Churrasco_Tikal.avif",
  },
  { name: "Carne Asada", descKey: "sig.plate2.desc", price: "$15", src: "/Menu/Carne Asada.avif" },
  {
    name: "Costillas BBQ",
    descKey: "sig.plate3.desc",
    price: "$18",
    src: "/Menu/Costillas BBQ.avif",
  },
  { name: "Alitas BBQ", descKey: "sig.plate4.desc", price: "$14", src: "/Menu/Alitas BBQ.avif" },
  {
    name: "Desayuno El Quetzalito",
    descKey: "sig.plate5.desc",
    price: "$12",
    src: "/Menu/Desayuno El Quetzalito.avif",
  },
  {
    name: "Pepián de Gallina o Res",
    descKey: "sig.plate6.desc",
    price: "$14",
    src: "/Menu/Pepián de Gallina o Res.avif",
  },
];

export default function Signatures() {
  const { t } = useTranslation();

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
          {plates.map(({ name, descKey, price, src }) => (
            <li key={name}>
              <a
                href="/menu"
                className="group flex items-start gap-4 rounded-xl border border-cream-deep bg-white p-4 transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="text-base leading-snug font-bold text-ink">{name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-moss">
                    {t(descKey)}
                  </p>
                  <p className="mt-auto pt-2 text-sm font-bold text-ink">{price}</p>
                </div>
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                  <Image
                    src={src}
                    alt={name}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </a>
            </li>
          ))}
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
