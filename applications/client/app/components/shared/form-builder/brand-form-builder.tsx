import { useForm } from "@tanstack/react-form";
import { TextFormBuilder, type TextField } from "./text-form-builder";
import { CodeFormBuilder, type CodeField } from "./code-form-builder";
import { SubmitFieldBuilder, type SubmitField } from "./submit-button-builder";
import { getFormSchema } from "./form-schma-builder";
import {
  TextareaFormBuilder,
  type TextareaField,
} from "./textarea-form-builder";
import { CustomFormBuilder, type CustomField } from "./custom-form-builder";
import { useState } from "react";
import {
  PasswordFormBuilder,
  type PasswordField,
} from "./password-form-builder";

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
  | ({ type: "code"; defaultValue: any } & CodeField);

export type BuilderOptions<TData extends TDV = TDV> = Record<
  keyof TData,
  BuilderField
>;

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
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: getDefaultValues(options),
    validators: {
      onBlur: formSchema,
    },
    onSubmit: ({ value }) => {
      setIsLoading(true);
      onSubmit?.(value).finally(() => setIsLoading(false));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(options).map((key, index) => {
        const isFirst = index === 0;
        const value = options[key];
        if (value.type === "submit") {
          return (
            <SubmitFieldBuilder
              key={key}
              field={value}
              isLoading={isLoading}
              onCancel={onCancel}
            />
          );
        }
        if (value.type === "text" || value.type === "email") {
          return (
            <TextFormBuilder
              form={form as any}
              config={value}
              key={key}
              name={key}
              isFrist={isFirst}
            />
          );
        }
        if (value.type === "password") {
          return (
            <PasswordFormBuilder
              key={key}
              form={form as any}
              name={key}
              config={value}
              isFrist={isFirst}
            />
          );
        }
        if (value.type === "textarea") {
          return (
            <TextareaFormBuilder
              key={key}
              form={form as any}
              name={key}
              config={value}
              isFrist={isFirst}
            />
          );
        }
        if (value.type === "code") {
          return (
            <CodeFormBuilder
              key={key}
              form={form as any}
              name={key}
              config={value}
              isFirst={isFirst}
            />
          );
        }
        if (value.type === "custom") {
          return CustomFormBuilder(form as any, key, value, isFirst);
        }
        return <div key={key}>123</div>;
      })}
    </form>
  );
}
