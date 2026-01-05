import { FieldDescription, FieldError } from "~/components/ui/field";
import { doRenderText, type RenderText } from "./form-types";

export interface BaseFormFooterProps {
  description?: RenderText;
  isInvalid: boolean;
  errors: any;
}

export function BaseFormFooter({
  description,
  isInvalid,
  errors,
}: BaseFormFooterProps) {
  return (
    <>
      {description && (
        <FieldDescription>{doRenderText(description)}</FieldDescription>
      )}
      {isInvalid && <FieldError errors={errors} />}
    </>
  );
}
