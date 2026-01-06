import { FieldDescription, FieldError } from "~/components/ui/field";
import { doRenderText, type RenderText } from "./form-types";
import z from "zod";

export interface BaseFormFooterProps {
  description?: RenderText;
  field: any;
}

const strArr = z.string().array();

export function BaseFormFooter({ description, field }: BaseFormFooterProps) {
  let isStringArray: boolean;
  try {
    strArr.parse(field.state.meta.errors);
    isStringArray = true;
  } catch (e: any) {
    isStringArray = false;
    e;
  }
  const asyncError = field.state.meta.errors.length > 0 && (
    <FieldError
      errors={field.state.meta.errors.map((u: string) => ({
        message: u,
      }))}
    />
  );
  const baseError =
    field.state.meta.isTouched && !field.state.meta.isValid ? (
      <FieldError errors={field.state.meta.errors} />
    ) : null;
  return (
    <>
      {description && (
        <FieldDescription>{doRenderText(description)}</FieldDescription>
      )}
      {isStringArray ? asyncError : baseError}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
