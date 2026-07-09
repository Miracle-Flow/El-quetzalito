const faqs = [
  {
    q: "Do you take walk-ins?",
    a: "Yes — walk in any time we're open, or order ahead through the site for pickup or delivery. Whichever gets you fed faster.",
  },
  {
    q: "Are the tortillas made in-house?",
    a: "Every morning, by hand, from fresh masa. When we run out, we're out — that's the honest answer.",
  },
  {
    q: "Vegetarian and gluten-free options?",
    a: "Plenty. Vegetarian dishes are marked with a leaf on the menu. Corn tortillas are naturally gluten-free — ask us and we'll flag anything that isn't.",
  },
  {
    q: "How spicy are the salsas?",
    a: "Three: a mild verde, a medium roja, and a habanero that means business. All hecha en casa.",
  },
  {
    q: "Do you cater larger orders?",
    a: "Yes. Give us 48 hours' notice for anything over twenty people and we'll build a spread — tacos, birria, sides, and salsas by the pint.",
  },
  {
    q: "What are your hours?",
    a: "Tuesday through Sunday, 11am to 9pm. Closed Mondays so the team can rest and prep for the week.",
  },
];

export default function Faqs() {
  return (
    <section
      id="faqs"
      className="scroll-mt-20 bg-[#FEFBEE] px-6 py-24 sm:px-10 lg:px-16 lg:py-32 xl:px-24"
    >
      <div className="text-center">
        <p className="text-base font-bold tracking-[0.28em] text-[#2E5AA8] sm:text-lg">
          GOT QUESTIONS?
        </p>
        <h2 className="mt-5 font-display text-6xl font-extrabold tracking-tight text-ink sm:text-7xl lg:text-8xl">
          We&apos;ve got answers.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-moss sm:text-xl lg:text-2xl">
          Everything you might want to know before you order. Anything else,
          give us a call — the phone rings straight to the pass.
        </p>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-2 xl:gap-8">
        {faqs.map(({ q, a }) => (
          <div
            key={q}
            className="flex flex-col rounded-[2rem] border border-cream-deep bg-white p-10 shadow-[0_1px_0_rgb(32_48_27_/_0.04),0_16px_40px_-24px_rgb(32_48_27_/_0.18)] sm:p-12"
          >
            <h3 className="font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
              {q}
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-moss sm:text-xl">
              {a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
