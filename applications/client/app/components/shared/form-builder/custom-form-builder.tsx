import { Field } from "~/components/ui/field";
import type { BaseFormField, FormType } from "./form-types";
import { cn } from "~/lib/utils";
import { BaseLabel } from "./base-label";
import { BaseFormFooter } from "./base-form-footer";
import type React from "react";
import type { ZodType } from "zod";

export type CustomField = {
  content: (option: {
    value: any;
    handleBlur: () => void;
    handleChange: (updater: unknown) => void;
  }) => React.ReactNode;
  schema: () => ZodType;
} & BaseFormField;

export function CustomFormBuilder(
  form: FormType,
  key: string,
  { required, label, description, content }: CustomField,
  isFrist: boolean,
) {
  return (
    <form.Field name={key} key={key}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid} className={cn(!isFrist && "mt-4")}>
            <BaseLabel required={required} label={label} />
            {content({
              ...field,
              value: field.state.value,
            })}
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
