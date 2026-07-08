import type { CollectionConfig } from "payload";

import { Category } from "./category.ts";
import { DailyAvailability } from "./daily-availability.ts";
import { Media } from "./media.ts";
import { MenuItem } from "./menu-item.ts";
import { Menu } from "./menu.ts";
import { MigrationCheck } from "./migration-check.ts";
import { ModifierGroup } from "./modifier-group.ts";
import { ModifierOption } from "./modifier-option.ts";
import { Promotion } from "./promotion.ts";
import { Users } from "./users.ts";

export const collections: CollectionConfig[] = [
  Users,
  MigrationCheck,
  Media,
  Menu,
  Category,
  MenuItem,
  ModifierGroup,
  ModifierOption,
  DailyAvailability,
  Promotion,
];
