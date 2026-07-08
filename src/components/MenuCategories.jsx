import Image from "next/image";
import tacos from "@/assets/tacos2.jpg";
import burrito from "@/assets/burrito.jpg";
import nachos from "@/assets/nachos.jpg";

const cards = [
  {
    label: "The classic",
    title: "Tacos",
    description: "Corn tortillas pressed by hand. Loaded and folded.",
    image: tacos,
    alt: "Birria tacos topped with cilantro and onion",
  },
  {
    label: "The wrap",
    title: "Burritos",
    description: "Rice, beans, protein, salsa — wrapped tight.",
    image: burrito,
    alt: "A burrito cut in half showing chicken, slaw, and crema",
  },
  {
    label: "The share",
    title: "Nachos",
    description: "Chips fried in-house, loaded to the edge.",
    image: nachos,
    alt: "Loaded nachos with pico de gallo, jalapeño, and crema",
  },
];

export default function MenuCategories() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:px-12 lg:py-32 xl:px-16">
      <div className="mx-auto w-full max-w-none">
        {/* section head — matches FullMenu treatment */}
        <div className="text-center">
          <p className="text-base font-bold tracking-[0.22em] text-[#2E5AA8] sm:text-lg">
            WHAT TO ORDER
          </p>
          <h2 className="mt-5 font-display text-6xl font-extrabold tracking-tight text-ink sm:text-7xl lg:text-8xl">
            Explore Our Menu
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-moss sm:text-xl lg:text-2xl">
            Three things we make well — every service, every plate.
          </p>
        </div>

        {/* three tinted cards, but photo is now the top half */}
        <ul className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-10">
          {cards.map(({ label, title, description, image, alt }) => (
            <li key={title} data-menu-card>
              <a
                href="/menu"
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-[#FEFBEE] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(32,48,27,0.35)]"
              >
                {/* photo — top of card, generous */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>

                {/* text half */}
                <div className="flex flex-1 flex-col p-10 sm:p-12">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#C8442C]">
                    {label}
                  </p>

                  <h3 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-[2.75rem]">
                    {title}
                  </h3>

                  <p className="mt-5 flex-1 text-lg leading-relaxed text-moss">
                    {description}
                  </p>

                  <p className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-ink">
                    <span className="border-b border-ink/40 pb-1 transition-colors group-hover:border-[#C8442C]">
                      See more
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

        {/* bottom link */}
        <div className="mt-16 text-center">
          <a
            href="/menu"
            className="group inline-flex items-baseline gap-3 font-serif text-lg italic text-ink"
          >
            <span className="border-b border-[#2E5AA8]/60 pb-1 transition-colors group-hover:border-[#2E5AA8]">
              View the full menu
            </span>
            <span
              aria-hidden="true"
              className="not-italic text-[#2E5AA8] transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
