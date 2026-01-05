import { Field } from "~/components/ui/field";
import { doRenderText, type BaseFormField, type FormType } from "./form-types";
import { Input } from "~/components/ui/input";
import type React from "react";
import { cn } from "~/lib/utils";
import type { LengthSchema } from "./form-schma-builder";
import { BaseLabel } from "./base-label";
import { BaseFormFooter } from "./base-form-footer";

export type TextField = {
  autoComplete?: React.ComponentProps<typeof Input>["autoComplete"];
  minLength?: LengthSchema;
  maxLength?: LengthSchema;
} & BaseFormField;

export interface TextFormBuilderProps {
  form: FormType;
  name: string;
  config: TextField;
  isFrist: boolean;
}

export function TextFormBuilder({
  form,
  name,
  config,
  isFrist,
}: TextFormBuilderProps) {
  const { autoComplete, required, label, placeholder, tabIndex, description } =
    config;

  return (
    <form.Field name={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid} className={cn(!isFrist && "mt-4")}>
            <BaseLabel required={required} label={label} />
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
