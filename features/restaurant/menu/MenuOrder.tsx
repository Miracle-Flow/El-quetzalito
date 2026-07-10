import DailySpecialsSection from "./DailySpecialsSection";
import { DAILY_SPECIALS_ID, menuCategories } from "./data";
import MenuSection from "./MenuSection";
import MenuTabs from "./MenuTabs";

const tabs = [
  { id: DAILY_SPECIALS_ID, label: "Daily Specials" },
  ...menuCategories.map((category) => {
    const [label] = category.label.split(" / ");
    return { id: category.id, label };
  }),
];

export default function MenuOrder() {
  return (
    <div className="bg-cream pt-24">
      <header className="px-6 pt-12 pb-10 text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-brand uppercase">El Quetzalito</p>
        <h1 className="mt-2 text-5xl font-black tracking-tight text-ink">The Menu</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-moss">
          Guatemalan platters, breakfast served all day, antojitos, and traditional drinks — hecho
          con amor.
        </p>
      </header>

      <MenuTabs tabs={tabs} />

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <DailySpecialsSection />
        {menuCategories.map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
      </main>
    </div>
  );
}
