import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";

/**
 * A toggle button that switches between English and Arabic.
 *
 * • When the current language is English it displays "عربي" (click to switch to Arabic).
 * • When the current language is Arabic  it displays "English" (click to switch to English).
 *
 * Uses the `useLanguage` hook from the i18n context and the
 * Shadcn UI `Button` component for consistent styling.
 */
export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 font-medium"
      data-testid="button-language-toggle"
    >
      <Globe className="w-4 h-4" />
      <span>{language === "en" ? "عربي" : "English"}</span>
    </Button>
  );
}
