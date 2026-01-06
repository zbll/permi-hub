import { Textarea } from "~/components/ui/textarea";
import type { LengthSchema } from "./form-schma-builder";
import { cn } from "~/lib/utils";
import type React from "react";
import type { Input } from "~/components/ui/input";
import { type BaseFormField, doRenderText } from "./form-types";

export type TextareaField = {
  minLength?: LengthSchema;
  maxLength?: LengthSchema;
  rows?: number;
  resize?: boolean;
  autoComplete?: React.ComponentProps<typeof Input>["autoComplete"];
} & BaseFormField;

export interface TextareaFormBuilderProps {
  config: TextareaField;
  field: any;
  isInvalid: boolean;
}

export function TextareaFormBuilder({
  config,
  field,
  isInvalid,
}: TextareaFormBuilderProps) {
  const { placeholder, tabIndex, autoComplete, rows, resize = false } = config;
  return (
    <Textarea
      id={field.name}
      name={field.name}
      value={field.state.value as any}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      aria-invalid={isInvalid}
      placeholder={doRenderText(placeholder)}
      tabIndex={tabIndex}
      autoComplete={autoComplete}
      className={cn(!resize && "resize-none")}
      rows={rows}
    />
  );
}
