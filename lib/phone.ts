/** Normalize to local form `01xxxxxxxxx` or return null if invalid BD mobile. */
export function normalizeBdPhone(input: string): string | null {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, "");

  let local = digits;
  if (digits.startsWith("880") && digits.length >= 12) {
    local = `0${digits.slice(3)}`;
  } else if (digits.length === 10 && digits.startsWith("1")) {
    local = `0${digits}`;
  }

  if (!/^01[3-9]\d{8}$/.test(local)) {
    return null;
  }
  return local;
}

export function formatBdPhoneDisplay(normalized: string): string {
  return `${normalized.slice(0, 5)} ${normalized.slice(5, 8)} ${normalized.slice(8)}`;
}
