import type { useForm } from "@tanstack/react-form";

export type RenderText = string | (() => string);

export type BaseFormField = {
  required?: boolean | (() => boolean);
  error?: RenderText;
  label: RenderText;
  placeholder?: RenderText;
  tabIndex?: number;
  description?: RenderText;
  schema?: () => any;
  validator?: (data: {
    value: any;
    fieldApi: any;
  }) => Promise<string | undefined>;
};

export type FormType = ReturnType<typeof useForm>;

export type FieldType = Parameters<
  Parameters<ReturnType<typeof useForm>["Field"]>[0]["children"]
>[0];

export function doRenderText(text?: RenderText): string {
  if (typeof text === "function") {
    return text();
  }
  return text || "";
}

export function checkIsRequired(required?: boolean | (() => boolean)): boolean {
  if (typeof required === "function") {
    return required();
  }
  return required || false;
}
