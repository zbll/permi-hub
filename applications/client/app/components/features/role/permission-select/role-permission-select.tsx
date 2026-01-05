import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PermissionGroup, type PermissionGroupItem } from "./permission-group";
import { Locale } from "~/locale/declaration";
import { Permissions } from "@packages/types";

type PermissionKey = keyof Omit<typeof Permissions, "Admin">;

// 权限分组配置
const permissionGroups = [
  {
    groupKey: "Logger",
    groupTextKey: Locale.Permission$Logger,
    items: [
      { itemKey: "LoggerGet" as const, textKey: Locale.Permission$Logger$Get },
    ],
  },
  {
    groupKey: "Role",
    groupTextKey: Locale.Permission$Role,
    items: [
      { itemKey: "RoleGet" as const, textKey: Locale.Permission$Role$Get },
      { itemKey: "RoleAdd" as const, textKey: Locale.Permission$Role$Add },
      { itemKey: "RoleEdit" as const, textKey: Locale.Permission$Role$Edit },
      {
        itemKey: "RoleDelete" as const,
        textKey: Locale.Permission$Role$Delete,
      },
    ],
  },
  {
    groupKey: "Permission",
    groupTextKey: Locale.Permission$Permission,
    items: [
      {
        itemKey: "PermissionGet" as const,
        textKey: Locale.Permission$Permission$Get,
      },
    ],
  },
];

// 权限标识映射
const PermissionIdMap: Record<PermissionKey, string> = {
  Logger: "logger",
  LoggerGet: "logger:get",
  Role: "role",
  RoleAdd: "role:add",
  RoleGet: "role:get",
  RoleEdit: "role:edit",
  RoleDelete: "role:delete",
  Permission: "permission",
  PermissionGet: "permission:get",
};

export interface RolePermissionSelectProps {
  value: string[];
  onChange?: (value: string[]) => void;
}

export function RolePermissionSelect({
  value: externalValue,
  onChange: externalOnChange,
}: RolePermissionSelectProps) {
  const { t } = useTranslation();

  // 计算权限状态
  const permissionState = useMemo(() => {
    // 生成每个子项的选中状态
    const itemCheckedMap = new Map<PermissionKey, boolean>();
    permissionGroups.forEach((group) => {
      group.items.forEach((item) => {
        itemCheckedMap.set(
          item.itemKey,
          externalValue.includes(PermissionIdMap[item.itemKey]),
        );
      });
    });

    // 生成每个分组的状态（全选/半选/未选）
    const groupStateMap = new Map<
      (typeof permissionGroups)[number]["groupKey"],
      {
        checked: boolean;
        indeterminate: boolean;
      }
    >();
    permissionGroups.forEach((group) => {
      const itemKeys = group.items.map((i) => i.itemKey);
      const checkedItems = itemKeys.filter((k) => itemCheckedMap.get(k));
      const checked =
        checkedItems.length > 0 || checkedItems.length === itemKeys.length;
      const indeterminate =
        checkedItems.length > 0 && checkedItems.length < itemKeys.length;
      groupStateMap.set(group.groupKey, { checked, indeterminate });
    });

    return { itemCheckedMap, groupStateMap };
  }, [externalValue]);

  // 处理权限项切换
  const handleItemToggle = useCallback(
    (itemKey: PermissionKey, checked: boolean) => {
      if (!externalOnChange) return;

      const targetId = PermissionIdMap[itemKey];
      externalOnChange(
        checked
          ? [...new Set([...externalValue, targetId])]
          : externalValue.filter((id) => id !== targetId),
      );
    },
    [externalValue, externalOnChange],
  );

  // 处理分组切换
  const handleGroupToggle = useCallback(
    (groupKey: string, checked: boolean, indeterminate: boolean) => {
      if (!externalOnChange) return;

      const group = permissionGroups.find((g) => g.groupKey === groupKey);
      if (!group) return;

      const groupItemIds = group.items.map((i) => PermissionIdMap[i.itemKey]);

      if (!checked && indeterminate) {
        externalOnChange([
          ...new Set([
            ...externalValue.filter((id) => !groupItemIds.includes(id)),
            ...groupItemIds,
          ]),
        ]);
      } else if (checked) {
        externalOnChange([...new Set([...externalValue, ...groupItemIds])]);
      } else {
        externalOnChange(
          externalValue.filter((id) => !groupItemIds.includes(id)),
        );
      }
    },
    [externalValue, externalOnChange],
  );

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      {permissionGroups.map((group) => {
        const groupState = permissionState.groupStateMap.get(group.groupKey)!;

        // 准备分组项的文本和值
        const groupItems: PermissionGroupItem[] = group.items.map((item) => ({
          itemKey: item.itemKey,
          text: t(item.textKey),
        }));

        // 准备子项的选中状态
        const itemValues = group.items.reduce(
          (acc, item) => {
            acc[item.itemKey] =
              permissionState.itemCheckedMap.get(item.itemKey) || false;
            return acc;
          },
          {} as Record<PermissionKey, boolean>,
        );

        return (
          <PermissionGroup
            key={group.groupKey}
            groupKey={group.groupKey}
            groupText={t(group.groupTextKey)}
            items={groupItems}
            checked={groupState.checked}
            indeterminate={groupState.indeterminate}
            itemValues={itemValues}
            onGroupChange={externalOnChange ? handleGroupToggle : undefined}
            onItemChange={externalOnChange ? handleItemToggle : undefined}
          />
        );
      })}
    </div>
  );
}
