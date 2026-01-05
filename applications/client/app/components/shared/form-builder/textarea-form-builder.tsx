import { Textarea } from "~/components/ui/textarea";
import type { LengthSchema } from "./form-schma-builder";
import { Field } from "~/components/ui/field";
import { cn } from "~/lib/utils";
import { BaseLabel } from "./base-label";
import { BaseFormFooter } from "./base-form-footer";
import type React from "react";
import type { Input } from "~/components/ui/input";
import { type BaseFormField, type FormType, doRenderText } from "./form-types";

export type TextareaField = {
  minLength?: LengthSchema;
  maxLength?: LengthSchema;
  rows?: number;
  resize?: boolean;
  autoComplete?: React.ComponentProps<typeof Input>["autoComplete"];
} & BaseFormField;

export interface TextareaFormBuilderProps {
  form: FormType;
  name: string;
  config: TextareaField;
  isFrist: boolean;
}

export function TextareaFormBuilder({
  form,
  name,
  config,
  isFrist,
}: TextareaFormBuilderProps) {
  const {
    required,
    label,
    placeholder,
    tabIndex,
    description,
    autoComplete,
    rows,
    resize = false,
  } = config;
  return (
    <form.Field name={name} key={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid} className={cn(!isFrist && "mt-4")}>
            <BaseLabel required={required} label={label} />
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
            <BaseFormFooter
              description={description}
              isInvalid={isInvalid}
              errors={field.state.meta.errors}
            />
          </Field>
        );
      }}
    </form.Field>
  );
}
