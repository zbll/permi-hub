import { doRenderText, type BaseFormField } from "./form-types";
import { Input } from "~/components/ui/input";
import type React from "react";
import type { LengthSchema } from "./form-schma-builder";

export type TextField = {
  autoComplete?: React.ComponentProps<typeof Input>["autoComplete"];
  minLength?: LengthSchema;
  maxLength?: LengthSchema;
} & BaseFormField;

export interface TextFormBuilderProps {
  config: TextField;
  field: any;
  isInvalid: boolean;
}

export function TextFormBuilder({
  config,
  field,
  isInvalid,
}: TextFormBuilderProps) {
  const { autoComplete, placeholder, tabIndex } = config;

  return (
    <Input
      id={field.name}
      name={field.name}
      type="text"
      value={field.state.value as any}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={isInvalid}
      placeholder={doRenderText(placeholder)}
      tabIndex={tabIndex}
      autoComplete={autoComplete}
    />
  );
}
