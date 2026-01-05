import type { BuilderOptions } from "~/components/shared/form-builder/brand-form-builder";
import { Locale } from "~/locale/declaration";
import { RolePermissionSelect } from "./permission-select/role-permission-select";
import z from "zod";

export type RoleBuilderOptionsProps = {
  role: string;
  permissions: string[];
  description: string;
};

export function createRoleBuilderOptions(
  t: (key: string) => string,
  options?: RoleBuilderOptionsProps,
): BuilderOptions {
  return {
    role: {
      type: "text",
      required: true,
      defaultValue: options?.role ?? "",
      error: () => t(Locale.Role$Add$Form$Role$Empty),
      label: () => t(Locale.Role$Add$Form$Role),
    },
    permission: {
      type: "custom",
      defaultValue: options?.permissions ?? [],
      label: () => t(Locale.Role$Add$Form$Permissions),
      content: ({ value, handleChange, handleBlur }) => (
        <RolePermissionSelect
          value={value}
          onChange={(value) => {
            handleBlur();
            handleChange(value);
          }}
        />
      ),
      schema: () => z.array(z.string()),
    },
    description: {
      type: "textarea",
      defaultValue: options?.description ?? "",
      label: () => t(Locale.Role$Add$Form$Description),
    },
    submit: {
      type: "submit",
      text: () => t(Locale.Text$Confirm),
      cancel: {
        text: () => t(Locale.Text$Cancel),
      },
    },
  };
}
