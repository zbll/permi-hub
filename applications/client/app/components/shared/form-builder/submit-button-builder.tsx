import { cn } from "~/lib/utils";
import { BrandButton } from "../brand-button";
import { doRenderText, type FormType, type RenderText } from "./form-types";

export type SubmitField = {
  position?: "left" | "right";
  text: RenderText;
  cancel?: {
    text: RenderText;
  };
};

export interface SubmitFieldBuilderProps {
  form: FormType;
  field: SubmitField;
  onCancel?: () => void;
}

export function SubmitFieldBuilder({
  form,
  field,
  onCancel,
}: SubmitFieldBuilderProps) {
  return (
    <form.Subscribe>
      {(data) => (
        <div
          className={cn(
            "flex items-center mt-4 gap-4",
            field.position === "left" ? "justify-start" : "justify-end",
          )}
        >
          {field.cancel && (
            <BrandButton
              type="button"
              variant="secondary"
              isLoading={data.isSubmitting}
              onClick={onCancel}
            >
              {doRenderText(field.cancel.text)}
            </BrandButton>
          )}
          <BrandButton
            type="submit"
            isLoading={data.isSubmitting}
            isDisabled={!data.canSubmit}
          >
            {doRenderText(field.text)}
          </BrandButton>
        </div>
      )}
    </form.Subscribe>
  );
}
