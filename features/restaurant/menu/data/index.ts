import { appetizers } from "./appetizers";
import { bakery } from "./bakery";
import { breakfast } from "./breakfast";
import { drinks } from "./drinks";
import { especiales } from "./especiales";

export { dailySpecialsDays, dailySpecialsNote, dailySpecialsNoteEs } from "./dailySpecials";
export type { DailySpecialsDay } from "./dailySpecials";

export const DAILY_SPECIALS_ID = "daily-specials";

export const menuCategories = [breakfast, appetizers, especiales, bakery, drinks];
