import { addMinutes, set } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

import type { StoreSetting } from "@/payload-types.ts";

type WeeklyHour = NonNullable<StoreSetting["weeklyHours"]>[number];
type DailyOverride = NonNullable<StoreSetting["dailyOverrides"]>[number];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export interface PickupSlot {
  label: string;
  value: string;
}

export interface SlotGenerationInput {
  settings: Pick<
    StoreSetting,
    "weeklyHours" | "dailyOverrides" | "timezone" | "leadTimeMinutes" | "slotIntervalMinutes"
  >;
  now?: Date;
}

function parseTime(value: string | null | undefined): { hour: number; minute: number } | null {
  if (!value) return null;

  const [hourString, minuteString] = value.split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;

  return { hour, minute };
}

function getDateStringInZone(date: Date, timeZone: string): string {
  return formatInTimeZone(date, timeZone, "yyyy-MM-dd");
}

function getDayLabelInZone(date: Date): string {
  return DAY_LABELS[date.getDay()];
}

function buildOverrideMap(
  overrides: DailyOverride[] | null | undefined,
): Map<string, DailyOverride> {
  const map = new Map<string, DailyOverride>();

  if (!overrides) return map;

  for (const override of overrides) {
    if (override.date) {
      map.set(override.date, override);
    }
  }

  return map;
}

function findWeeklyHour(
  weeklyHours: WeeklyHour[] | null | undefined,
  dayLabel: string,
): WeeklyHour | undefined {
  return weeklyHours?.find((hour) => hour.day === dayLabel);
}

export function generatePickupSlots({
  settings,
  now = new Date(),
}: SlotGenerationInput): PickupSlot[] {
  const timeZone = settings.timezone || "America/Guatemala";
  const leadTimeMinutes = settings.leadTimeMinutes ?? 20;
  const slotIntervalMinutes = settings.slotIntervalMinutes ?? 15;

  const zonedNow = toZonedTime(now, timeZone);
  const todayString = getDateStringInZone(now, timeZone);
  const overrideMap = buildOverrideMap(settings.dailyOverrides);
  const override = overrideMap.get(todayString);

  if (override?.closed) return [];

  const dayLabel = getDayLabelInZone(zonedNow);
  const weeklyHour = findWeeklyHour(settings.weeklyHours, dayLabel);

  if (!weeklyHour || weeklyHour.closed) return [];

  const open = parseTime(override?.open ?? weeklyHour.open);
  const close = parseTime(override?.close ?? weeklyHour.close);

  if (!open || !close) return [];

  const openDate = set(zonedNow, {
    hours: open.hour,
    minutes: open.minute,
    seconds: 0,
    milliseconds: 0,
  });

  const closeDate = set(zonedNow, {
    hours: close.hour,
    minutes: close.minute,
    seconds: 0,
    milliseconds: 0,
  });

  if (openDate.getTime() >= closeDate.getTime()) return [];

  const cutoff = addMinutes(zonedNow, leadTimeMinutes);
  let slot = openDate;

  if (slot.getTime() < cutoff.getTime()) {
    const minutesAfterOpen = Math.ceil((cutoff.getTime() - openDate.getTime()) / (60 * 1000));
    const intervals = Math.ceil(minutesAfterOpen / slotIntervalMinutes);
    slot = addMinutes(openDate, intervals * slotIntervalMinutes);
  }

  const slots: PickupSlot[] = [];

  while (slot.getTime() <= closeDate.getTime()) {
    const absoluteSlot = fromZonedTime(slot, timeZone);
    slots.push({
      label: formatInTimeZone(absoluteSlot, timeZone, "h:mm a"),
      value: absoluteSlot.toISOString(),
    });
    slot = addMinutes(slot, slotIntervalMinutes);
  }

  return slots;
}
