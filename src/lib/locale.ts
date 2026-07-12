export type Locale = "zh" | "en";

const localeStorageKey = "motion-text-kit-locale";
const localeChangeEvent = "motion-text-kit-locale-change";

export function getLocale(): Locale {
  if (typeof window === "undefined") {
    return "zh";
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey);
  if (storedLocale === "zh" || storedLocale === "en") {
    return storedLocale;
  }

  return [navigator.language, ...navigator.languages].some((language) =>
    language.toLowerCase().startsWith("zh"),
  )
    ? "zh"
    : "en";
}

export function subscribeToLocale(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(localeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(localeChangeEvent, onStoreChange);
  };
}

export function setLocale(locale: Locale): void {
  window.localStorage.setItem(localeStorageKey, locale);
  window.dispatchEvent(new Event(localeChangeEvent));
}
