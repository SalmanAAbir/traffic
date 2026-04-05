"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { User } from "@/lib/types";
import {
  clearSession,
  getSessionPhone,
  getUserByPhone,
  notifyUserListeners,
  saveUser as persistUser,
} from "@/lib/user-storage";

type AppContextValue = {
  user: User | null;
  setUser: (u: User | null) => void;
  refreshUser: () => void;
  logout: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function subscribe(onChange: () => void) {
  window.addEventListener("dt-user-change", onChange);
  return () => window.removeEventListener("dt-user-change", onChange);
}

/** `getUserByPhone` parses JSON each call (new object reference). useSyncExternalStore requires a stable snapshot when data is unchanged. */
let cachedUser: User | null = null;
let cachedUserKey = "";

function getUserSnapshot(): User | null {
  const phone = getSessionPhone();
  const user = phone ? getUserByPhone(phone) : null;
  const key = `${phone ?? ""}\0${user ? JSON.stringify(user) : "null"}`;
  if (key === cachedUserKey) {
    return cachedUser;
  }
  cachedUserKey = key;
  cachedUser = user;
  return cachedUser;
}

function getServerUserSnapshot(): null {
  return null;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(
    subscribe,
    getUserSnapshot,
    getServerUserSnapshot,
  );

  const setUser = useCallback((u: User | null) => {
    if (u) persistUser(u);
    else clearSession();
  }, []);

  const refreshUser = useCallback(() => {
    notifyUserListeners();
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const value = useMemo(
    () => ({ user, setUser, refreshUser, logout }),
    [user, setUser, refreshUser, logout],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
