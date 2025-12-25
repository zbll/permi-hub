import { getContext } from "hono/context-storage";

export class I18nService<T extends Record<string, string>> {
  private locales: Map<string, T> = new Map();

  loadLocale(lang: string, locale: T) {
    this.locales.set(lang, locale);
  }

  t(key: keyof T, params?: Record<string, string>) {
    const ctx = getContext();
    const lang = ctx.get("language");
    const locale = this.locales.get(lang);

    const value = locale?.[key] ?? String(key);
    return params ? this.interpolate(value, params) : value;
  }

  private interpolate(
    template: string,
    params: Record<string, string>,
  ): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || "");
  }
}
