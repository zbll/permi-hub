import { Input } from "~/components/ui/input";
import { doRenderText, type BaseFormField } from "./form-types";

export type PasswordField = {
  type: "password";
  isNewPassword?: boolean;
} & BaseFormField;

export interface PasswordFormBuilderProps {
  config: PasswordField;
  field: any;
  isInvalid: boolean;
}

export function PasswordFormBuilder({
  config,
  field,
  isInvalid,
}: PasswordFormBuilderProps) {
  const { placeholder, tabIndex, isNewPassword } = config;

  return (
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
  );
}
