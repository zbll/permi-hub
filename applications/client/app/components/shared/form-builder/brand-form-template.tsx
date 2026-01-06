import type { BuilderField } from "./brand-form-builder";
import { CodeFormBuilder } from "./code-form-builder";
import { CustomFormBuilder } from "./custom-form-builder";
import type { FormType } from "./form-types";
import { PasswordFormBuilder } from "./password-form-builder";
import { TextFormBuilder } from "./text-form-builder";
import { TextareaFormBuilder } from "./textarea-form-builder";

export interface BrandFormTemplate {
  value: BuilderField;
  form: FormType;
  field: any;
  isInvalid: boolean;
}

export function BrandFormTemplate({
  value,
  form,
  field,
  isInvalid,
}: BrandFormTemplate) {
  if (value.type === "text" || value.type === "email") {
    return (
      <TextFormBuilder config={value} field={field} isInvalid={isInvalid} />
    );
  }
  if (value.type === "password") {
    return (
      <PasswordFormBuilder config={value} field={field} isInvalid={isInvalid} />
    );
  }
  if (value.type === "textarea") {
    return (
      <TextareaFormBuilder config={value} field={field} isInvalid={isInvalid} />
    );
  }
  if (value.type === "code") {
    return (
      <CodeFormBuilder
        form={form}
        config={value}
        field={field}
        isInvalid={isInvalid}
        getEmail={value.getEmail}
      />
    );
  }
  if (value.type === "custom") {
    return <CustomFormBuilder config={value} field={field} />;
  }
  return <div></div>;
}
