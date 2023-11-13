import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_LOCALE = "de-DE"; //todo: get from browser
export const formatDate = (date: Date | null) => {
  if (date === null) {
    return "";
  }
  return new Date(date).toLocaleDateString(DEFAULT_LOCALE);
};

export const formatTime = (date: Date | null) => {
  if (date === null) {
    return "";
  }
  return new Date(date).toLocaleTimeString(DEFAULT_LOCALE);
};

export const formatDateTime = (date: Date | null) => {
  if (date === null) {
    return "";
  }
  let date1 = new Date(date);
  return (
    date1.toLocaleDateString(DEFAULT_LOCALE) +
    " " +
    date1.toLocaleTimeString(DEFAULT_LOCALE)
  );
};

export const getTimestamp = () => {
  const currentDate = new Date();
  const formattedTimestamp = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return formattedTimestamp;
};
