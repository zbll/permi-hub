import type React from "react";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { Spinner } from "../ui/spinner";

export interface BrandButtonProps {
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function BrandButton({
  onClick,
  type,
  variant,
  size,
  className,
  isLoading,
  isDisabled,
  children,
}: React.PropsWithChildren<BrandButtonProps>) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled || isLoading) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <Button
      type={type}
      className={cn(className, "cursor-pointer")}
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isDisabled || isLoading}
    >
      {isLoading && <Spinner />}
      {children}
    </Button>
  );
}
