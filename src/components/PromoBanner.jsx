import Image from "next/image";
import bowl from "@/assets/bowl.jpg";
import { ArrowRightIcon, LimeDoodle } from "./icons";

export default function PromoBanner() {
  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28 xl:px-24">
      <div className="relative overflow-hidden rounded-[3rem] bg-[#142340]">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="relative h-80 sm:h-[28rem] lg:h-[640px]">
            <div className="absolute inset-8 overflow-hidden rounded-full lg:inset-y-14 lg:left-14 lg:right-6 lg:rounded-[4rem]">
              <Image
                src={bowl}
                alt="A colorful bowl with grilled chicken, corn, greens, and tomatoes"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="relative px-10 pb-16 pt-4 text-white sm:px-16 lg:py-24 lg:pl-6 lg:pr-24">
            <span className="inline-block rounded-full bg-white/15 px-6 py-2.5 text-sm font-bold tracking-[0.18em]">
              LIMITED TIME
            </span>
            <h2 className="mt-6 font-display text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl xl:text-7xl">
              The Chipotle-Lime Bowl Is Back
            </h2>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-white/80 sm:text-2xl">
              Smoky fire-grilled chicken, charred corn, black beans, and lime
              crema — around for the summer only.
            </p>
            <a
              href="/menu"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-5 text-lg font-bold text-[#2E5AA8] transition-colors hover:bg-cream"
            >
              Order Now
              <ArrowRightIcon className="h-6 w-6" />
            </a>
            <LimeDoodle className="absolute bottom-12 right-12 hidden h-36 w-36 rotate-12 lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
