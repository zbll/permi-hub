import { Field } from "~/components/ui/field";
import { BaseLabel } from "./base-label";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { BaseFormFooter } from "./base-form-footer";
import { doRenderText, type BaseFormField, type FormType } from "./form-types";

export type PasswordField = {
  type: "password";
  isNewPassword?: boolean;
} & BaseFormField;

export interface PasswordFormBuilderProps {
  form: FormType;
  name: string;
  config: PasswordField;
  isFrist: boolean;
}

export function PasswordFormBuilder({
  form,
  name,
  config,
  isFrist,
}: PasswordFormBuilderProps) {
  const { required, label, placeholder, tabIndex, description, isNewPassword } =
    config;

  return (
    <form.Field name={name} key={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid} className={cn(!isFrist && "mt-4")}>
            <BaseLabel required={required} label={label} />
            <Input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value as any}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={isInvalid}
              placeholder={doRenderText(placeholder)}
              tabIndex={tabIndex}
              autoComplete={isNewPassword ? "new-password" : "current-password"}
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
