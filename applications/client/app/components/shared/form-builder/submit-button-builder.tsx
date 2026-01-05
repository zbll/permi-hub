import { cn } from "~/lib/utils";
import { BrandButton } from "../brand-button";
import { doRenderText, type RenderText } from "./form-types";

export type SubmitField = {
  position?: "left" | "right";
  text: RenderText;
  cancel?: {
    text: RenderText;
  };
};

export interface SubmitFieldBuilderProps {
  field: SubmitField;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function SubmitFieldBuilder({
  field,
  isLoading,
  onCancel,
}: SubmitFieldBuilderProps) {
  return (
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
          isLoading={isLoading}
          onClick={onCancel}
        >
          {doRenderText(field.cancel.text)}
        </BrandButton>
      )}
      <BrandButton type="submit" isLoading={isLoading}>
        {doRenderText(field.text)}
      </BrandButton>
    </div>
  );
}
