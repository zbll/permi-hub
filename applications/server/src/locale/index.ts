import en from "../locales/en.ts";
import zh from "../locales/zh.ts";
import { I18nService } from "./I18nService.ts";

const i18n = new I18nService<Record<keyof typeof en, string>>();

i18n.loadLocale("en", en);
i18n.loadLocale("zh", zh);

export const createValidatorOptions = {
  validatorRequired: (field: string) => i18n.t("validator.required", { field }),
  validatorType: (field: string, type: string) =>
    i18n.t("validator.type", { field, type }),
  validatorTypeArray: (field: string) =>
    i18n.t("validator.type.array", { field }),
  validatorNumberMin: (field: string, min: number) =>
    i18n.t("validator.number.min", { field, min: min.toString() }),
  validatorNumberMax: (field: string, max: number) =>
    i18n.t("validator.number.max", { field, max: max.toString() }),
  validatorNumberMinMax: (field: string, min: number, max: number) =>
    i18n.t("validator.number.minMax", {
      field,
      min: min.toString(),
      max: max.toString(),
    }),
  validatorStringMinLength: (field: string, min: number) =>
    i18n.t("validator.string.minLength", { field, min: min.toString() }),
  validatorStringMaxLength: (field: string, max: number) =>
    i18n.t("validator.string.maxLength", { field, max: max.toString() }),
  validatorStringMinMaxLength: (field: string, min: number, max: number) =>
    i18n.t("validator.string.minMaxLength", {
      field,
      min: min.toString(),
      max: max.toString(),
    }),
};

export { i18n };
