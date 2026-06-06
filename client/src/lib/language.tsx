import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import en from "@/i18n/en.json";
import ar from "@/i18n/ar.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface TranslationMap {
  [key: string]: string | TranslationMap;
}

interface LanguageContextValue {
  /** Current active language code */
  language: Language;
  /** Switch language (persisted to localStorage) */
  setLanguage: (lang: Language) => void;
  /**
   * Translate a dot-notation key.
   *
   * Supports simple interpolation:
   *   t("dashboard.welcome", { name: "Ahmed" })
   *   → "Welcome back, Ahmed!"
   *
   * If the key is not found, the key itself is returned as a fallback.
   */
  t: (key: string, params?: Record<string, string | number>) => string;
  /** Text direction – "rtl" for Arabic, "ltr" for English */
  dir: Direction;
}

// ---------------------------------------------------------------------------
// Translations dictionary
// ---------------------------------------------------------------------------

const translations: Record<Language, TranslationMap> = {
  en: en as unknown as TranslationMap,
  ar: ar as unknown as TranslationMap,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = "proconnect-lang";

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") return stored;
  } catch {
    // localStorage might be unavailable (SSR, privacy mode, etc.)
  }
  return "en";
}

/**
 * Resolve a dot-notation key against a nested object.
 * e.g. resolve("landing.hero.title", translations.en) → "Empower Your …"
 */
function resolve(key: string, obj: TranslationMap): string | undefined {
  const parts = key.split(".");
  let current: TranslationMap | string = obj;

  for (const part of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as TranslationMap)[part];
    if (current === undefined) return undefined;
  }

  return typeof current === "string" ? current : undefined;
}

/**
 * Replace `{placeholder}` tokens with the matching values from `params`.
 */
function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = params[key];
    return val !== undefined ? String(val) : `{${key}}`;
  });
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  // Apply side-effects whenever the language changes
  useEffect(() => {
    const dir: Direction = language === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = language;
    document.documentElement.dir = dir;

    // Persist choice
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // silently ignore
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const value = resolve(key, translations[language]);
      if (value !== undefined) return interpolate(value, params);

      // Fallback to English if the key isn't found in the current language
      if (language !== "en") {
        const fallback = resolve(key, translations.en);
        if (fallback !== undefined) return interpolate(fallback, params);
      }

      // Last resort: return the key itself (useful during development)
      return key;
    },
    [language],
  );

  const dir: Direction = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a <LanguageProvider />");
  }
  return ctx;
}
