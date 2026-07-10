import { appetizers } from "./appetizers";
import { breakfast } from "./breakfast";
import { drinks } from "./drinks";
import { especiales } from "./especiales";

export { dailySpecialsDays, dailySpecialsNote } from "./dailySpecials";
export type { DailySpecialsDay } from "./dailySpecials";

/** Daily specials render through their own section; images for them live in
 *  `public/menu/daily-specials/`. */
export const DAILY_SPECIALS_ID = "daily-specials";

/** Flat categories, in tab order (daily specials tab is prepended in the UI). */
export const menuCategories = [breakfast, appetizers, especiales, drinks];
