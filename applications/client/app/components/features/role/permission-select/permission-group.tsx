import React from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Permissions } from "@packages/types";
import { PermissionItem } from "./permission-item";

type PermissionKey = keyof Omit<typeof Permissions, "Admin">;

export interface PermissionGroupType {
  groupKey: string;
  groupText: string;
  items: PermissionGroupItem[];
}

export interface PermissionGroupItem {
  itemKey: PermissionKey;
  text: string;
}

export type PermissionGroupProps = {
  checked: boolean;
  indeterminate: boolean;
  itemValues: Record<PermissionKey, boolean>;
  onGroupChange?: (
    groupKey: string,
    checked: boolean,
    indeterminate: boolean,
  ) => void;
  onItemChange?: (itemKey: PermissionKey, checked: boolean) => void;
} & PermissionGroupType;

export function PermissionGroup({
  groupKey,
  groupText,
  items,
  checked,
  indeterminate,
  itemValues,
  onGroupChange,
  onItemChange,
}: PermissionGroupProps) {
  const groupCheckboxId = `group-${groupKey}`;

  const handleGroupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onGroupChange?.(groupKey, !checked, indeterminate);
  };

  return (
    <div
      className="flex flex-col items-start gap-3 rounded-md border p-3"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 分组标题 */}
      {onGroupChange && (
        <div className="flex items-center gap-2">
          <Checkbox
            id={groupCheckboxId}
            checked={checked}
            indeterminate={indeterminate}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleGroupClick?.(e);
            }}
          />
          <Label
            htmlFor={groupCheckboxId}
            className={cn(
              "cursor-pointer",
              "has-[aria-checked=true]:border-blue-600 has-[aria-checked=true]:bg-blue-50",
              "dark:has-[aria-checked=true]:border-blue-900 dark:has-[aria-checked=true]:bg-blue-950",
            )}
            onClick={handleGroupClick}
          >
            {groupText}
          </Label>
        </div>
      )}
      {!onGroupChange && <p>{groupText}</p>}

      {/* 子项列表 */}
      <div
        className="flex gap-4 flex-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item) => (
          <PermissionItem
            key={item.itemKey}
            itemKey={item.itemKey}
            text={item.text}
            value={itemValues[item.itemKey] || false}
            onChange={onItemChange}
          />
        ))}
      </div>
    </div>
  );
}
