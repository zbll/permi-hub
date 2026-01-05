import React from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Permissions } from "@packages/types";

type PermissionKey = keyof Omit<typeof Permissions, "Admin">;

export interface PermissionItemProps {
  itemKey: PermissionKey;
  text: string;
  value: boolean;
  onChange?: (itemKey: PermissionKey, checked: boolean) => void;
}

export function PermissionItem({
  itemKey,
  text,
  value,
  onChange,
}: PermissionItemProps) {
  const itemCheckboxId = `item-${itemKey}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange?.(itemKey, !value);
  };

  return (
    <div
      className="flex items-center gap-3"
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        id={itemCheckboxId}
        checked={value}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />
      <Label
        htmlFor={itemCheckboxId}
        className="flex items-center gap-3 cursor-pointer"
        onClick={handleClick}
      >
        {text}
      </Label>
    </div>
  );
}
