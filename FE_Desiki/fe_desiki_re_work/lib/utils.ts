import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { store } from "@/app/store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function để check token validation
export const isTokenValid = (): boolean => {
  const token = store.getState().user.token;
  if (!token) return false;

  try {
    // Decode JWT để check expiration (nếu cần)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    // Nếu không decode được thì coi như invalid
    return false;
  }
};

// Helper function để lấy token hiện tại
export const getCurrentToken = (): string | null => {
  return store.getState().user.token;
};
