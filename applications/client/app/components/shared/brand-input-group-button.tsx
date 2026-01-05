import type React from "react";
import type { Button } from "../ui/button";
import { InputGroupButton } from "~ui/input-group";
import { Spinner } from "../ui/spinner";

export type BrandInputGroupButtonProps = {
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
} & React.ComponentProps<typeof InputGroupButton>;

export function BrandInputGroupButton({
  isLoading,
  isDisabled,
  ...props
}: BrandInputGroupButtonProps) {
  return (
    <InputGroupButton disabled={isDisabled || isLoading} {...props}>
      {isLoading && <Spinner />}
      {props.children}
    </InputGroupButton>
  );
}
