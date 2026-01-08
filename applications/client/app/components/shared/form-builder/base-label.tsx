import { FieldLabel } from "~/components/ui/field";
import { checkIsRequired, doRenderText, type RenderText } from "./form-types";
import { cn } from "~/lib/utils";

export interface BaseLabelProps {
  required?: boolean | (() => boolean);
  label?: RenderText;
}

export function BaseLabel({ required, label }: BaseLabelProps) {
  return (
    <FieldLabel
      className={cn(
        checkIsRequired(required) && "before:content-['*'] before:text-red-500",
      )}
    >
      {doRenderText(label)}
    </FieldLabel>
  );
}
