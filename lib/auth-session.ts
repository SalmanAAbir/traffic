export type OtpMode = "register" | "login";

const PHONE_KEY = "dt_otp_phone";
const MODE_KEY = "dt_otp_mode";

export function setOtpContext(phone: string, mode: OtpMode) {
  sessionStorage.setItem(PHONE_KEY, phone);
  sessionStorage.setItem(MODE_KEY, mode);
}

export function getOtpContext(): { phone: string; mode: OtpMode } | null {
  if (typeof window === "undefined") return null;
  const phone = sessionStorage.getItem(PHONE_KEY);
  const mode = sessionStorage.getItem(MODE_KEY) as OtpMode | null;
  if (!phone || (mode !== "register" && mode !== "login")) return null;
  return { phone, mode };
}

export function clearOtpContext() {
  sessionStorage.removeItem(PHONE_KEY);
  sessionStorage.removeItem(MODE_KEY);
}
