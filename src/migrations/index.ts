import * as migration_20260708_070153 from "./20260708_070153";

export const migrations = [
  {
    up: migration_20260708_070153.up,
    down: migration_20260708_070153.down,
    name: "20260708_070153",
  },
];
