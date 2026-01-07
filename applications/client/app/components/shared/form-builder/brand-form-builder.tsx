import { useForm } from "@tanstack/react-form";
import { type TextField } from "./text-form-builder";
import { type CodeField } from "./code-form-builder";
import { SubmitFieldBuilder, type SubmitField } from "./submit-button-builder";
import { getFormSchema } from "./form-schma-builder";
import { type TextareaField } from "./textarea-form-builder";
import { type CustomField } from "./custom-form-builder";
import { type PasswordField } from "./password-form-builder";
import { BrandFormTemplate } from "./brand-form-template";
import { Field } from "~/components/ui/field";
import { cn } from "~/lib/utils";
import { BaseLabel } from "./base-label";
import { BaseFormFooter } from "./base-form-footer";
import type { SelectFormBuilderOptions } from "./select-from-builder";

type TDV = Record<string, any>;

export type BuilderField =
  | ({ type: "submit" } & SubmitField)
  | ({
      type: "text" | "email";
      defaultValue: any;
    } & TextField)
  | ({ type: "password"; defaultValue: any } & PasswordField)
  | ({ type: "textarea"; defaultValue: any } & TextareaField)
  | ({ type: "custom"; defaultValue: any } & CustomField)
  | ({ type: "select"; defaultValue: any } & SelectFormBuilderOptions)
  | ({ type: "code"; defaultValue: any } & CodeField);

export type BuilderOptions<TData extends TDV = TDV> = Record<
  keyof TData,
  BuilderField
>;

export type BuilderWithSubmitOptions<
  TData extends TDV = TDV,
  TSubmitKey extends string = "submit",
> = BuilderOptions<TData> & Record<TSubmitKey, BuilderField>;

export interface BrandFormBuilderProps<TData extends TDV = TDV> {
  options: BuilderOptions<TData>;
  onSubmit?: (value: TData) => Promise<void>;
  onCancel?: () => void;
}

function getDefaultValues<TData extends TDV = TDV>(
  options: BuilderOptions<TData>,
) {
  const defaultValues: TData = {} as TData;
  for (const key in options) {
    if (options[key].type !== "submit") {
      defaultValues[key] = options[key].defaultValue;
    }
  }
  return defaultValues;
}

export function BrandFormBuilder<TData extends TDV = TDV>({
  options,
  onSubmit,
  onCancel,
}: BrandFormBuilderProps<TData>) {
  const formSchema = getFormSchema(options);

  const form = useForm({
    defaultValues: getDefaultValues(options),
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit?.(value);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(options).map((key, index) => {
        const value = options[key];
        if (value.type === "submit") {
          return (
            <SubmitFieldBuilder
              key={key}
              form={form as any}
              field={value}
              onCancel={onCancel}
            />
          );
        }
        const isFirst = index === 0;
        return (
          <form.Field
            key={key}
            name={key}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: value.validator,
            }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field
                  data-invalid={isInvalid}
                  className={cn(!isFirst && "mt-4")}
                >
                  <BaseLabel required={value.required} label={value.label} />
                  <BrandFormTemplate
                    value={value}
                    form={form as any}
                    field={field}
                    isInvalid={isInvalid}
                  />
                  <BaseFormFooter
                    description={value.description}
                    field={field}
                  />
                </Field>
              );
            }}
          </form.Field>
        );
      })}
    </form>
  );
}
