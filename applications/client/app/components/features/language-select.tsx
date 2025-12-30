import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~ui/select";
import i18next, { t } from "i18next";
import { Locale } from "~/locale/declaration";
import { SupportedLanguages } from "~/locale/i18n";
import { useEffect, useState } from "react";

export function LanguageSelect() {
  const [currentLanguage, setCurrentLanguage] = useState("");

  useEffect(() => {
    setCurrentLanguage(i18next.language);
  }, [i18next.language]);

  const handleLanguageChange = (language: string) => {
    if (language.trim() === "") return;
    setCurrentLanguage(language);
    i18next.changeLanguage(language);
  };

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-30">
        <SelectValue placeholder={t(Locale.Text$Language)} />
      </SelectTrigger>
      <SelectContent>
        {SupportedLanguages.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
