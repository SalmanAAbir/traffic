export const OFFENCE_TYPES = [
  "No number plate",
  "No parking",
  "Wrong route",
  "Signal violation",
  "Over speeding",
  "Wrong lane",
  "Other",
] as const;

export type OffenceType = (typeof OFFENCE_TYPES)[number];
