import type { BaseFormField } from "./form-types";
import type React from "react";

export type CustomField = {
  content: (option: {
    value: any;
    handleBlur: () => void;
    handleChange: (updater: unknown) => void;
  }) => React.ReactNode;
} & BaseFormField;

export interface CustomFormBuilderProps {
  config: CustomField;
  field: any;
}

export function CustomFormBuilder({ config, field }: CustomFormBuilderProps) {
  const { content } = config;
  return (
    <>
      {content({
        ...field,
        value: field.state.value,
      })}
    </>
  );
}
