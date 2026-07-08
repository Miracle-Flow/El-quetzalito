import Image from "next/image";
import bowl from "@/assets/bowl.jpg";
import burrito from "@/assets/burrito.jpg";
import nachos from "@/assets/nachos.jpg";
import tacos1 from "@/assets/tacos1.jpg";
import tacos2 from "@/assets/tacos2.jpg";
import tacos3 from "@/assets/tacos3.jpg";
import tacos4 from "@/assets/tacos4.jpg";

const plates = [
  { name: "Parillada Chapina", price: "$22", image: tacos1, alt: "Grilled mixed meats platter" },
  { name: "Sopa de Gallina", price: "$13", image: bowl, alt: "Guatemalan hen soup with vegetables" },
  { name: "Churrasco Tikal", price: "$20", image: tacos2, alt: "Guatemalan-style grilled meat with cebollines" },
  { name: "Tamales de Elote", price: "$4", image: burrito, alt: "Sweet corn tamales with sour cream" },
  { name: "Ceviche", price: "$14", image: nachos, alt: "Lime-marinated shrimp ceviche" },
  { name: "Churrasco Mixto", price: "$20", image: tacos3, alt: "Mixed grill with pasta salad" },
  { name: "Pollo Asado", price: "$12", image: tacos4, alt: "Grilled chicken plate" },
];

function tileTransform(i, total) {
  const center = (total - 1) / 2;
  const offset = i - center;
  const rotateZ = offset * 5;
  const translateY = Math.abs(offset) * 22;
  return `translateY(${translateY}px) rotateZ(${rotateZ}deg)`;
}

export default function Signatures() {
  return (
    <section className="relative overflow-hidden bg-[#FEFBEE] px-6 py-28 sm:px-10 lg:px-16 lg:py-40 xl:px-24">
      {/* soft radial warmth behind the fan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[70%] -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(46,90,168,0.08),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* section head */}
        <div className="text-center">
          <p className="text-base font-bold tracking-[0.28em] text-[#2E5AA8] sm:text-lg">
            SIGNATURES
          </p>
          <h2 className="mt-5 font-display text-6xl font-extrabold tracking-tight text-ink sm:text-7xl lg:text-8xl">
            What the kitchen is known for.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-moss sm:text-xl lg:text-2xl">
            Seven plates we're known for — pulled straight from the carta.
          </p>
        </div>

        {/* fanned photo gallery */}
        <div className="relative mt-20 lg:mt-28">
          {/* desktop / tablet — fanned overlapping tiles */}
          <ul className="hidden items-center justify-center gap-3 pb-24 sm:flex lg:gap-5 xl:gap-7">
            {plates.map(({ name, price, image, alt }, i) => (
              <li
                key={name}
                className="group relative shrink-0"
                style={{
                  transform: tileTransform(i, plates.length),
                  transformStyle: "preserve-3d",
                  transition:
                    "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  zIndex: 10 - Math.abs(i - (plates.length - 1) / 2),
                }}
              >
                <div className="relative aspect-[3/4] w-56 overflow-hidden rounded-2xl bg-[#fdf9f0] shadow-[0_30px_62px_-18px_rgba(20,35,64,0.5)] ring-1 ring-black/5 transition-transform duration-500 group-hover:scale-[1.06] lg:w-72 xl:w-80">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 16rem, 13rem"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                  />
                  <div className="absolute inset-x-4 bottom-4 text-white sm:inset-x-5 sm:bottom-5">
                    <div className="font-display text-sm font-bold uppercase leading-tight tracking-[0.14em] drop-shadow-md lg:text-base">
                      {name}
                    </div>
                    <div className="mt-1 font-serif text-base italic text-white/95 drop-shadow-md lg:text-lg">
                      {price}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* mobile — horizontal snap-scroll */}
          <ul className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-4 sm:hidden">
            {plates.map(({ name, price, image, alt }) => (
              <li key={name} className="snap-start shrink-0">
                <div className="relative aspect-[3/4] w-48 overflow-hidden rounded-2xl bg-[#fdf9f0] shadow-[0_18px_36px_-14px_rgba(20,35,64,0.4)]">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="12rem"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                  />
                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <div className="font-display text-sm font-bold uppercase leading-tight tracking-[0.14em] drop-shadow-md">
                      {name}
                    </div>
                    <div className="mt-1 font-serif text-base italic text-white/95 drop-shadow-md">
                      {price}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
