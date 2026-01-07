import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { doRenderText, type BaseFormField, type FieldType } from "./form-types";
import { MultiAsyncSelect } from "~/components/ui/multi-async-select";
import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";

export type SelectFormOption = { value: string; label: string };

export type SelectFormBuilderOptions = {
  options: SelectFormOption[];
  multiple?: boolean;
} & BaseFormField;

export interface SelectFormBuilderProps {
  config: SelectFormBuilderOptions;
  field: FieldType;
  isInvalid: boolean;
}

export function SelectFormBuilder({
  config,
  field,
  isInvalid,
}: SelectFormBuilderProps) {
  const { t } = useTranslation();

  const { placeholder, tabIndex, multiple } = config;
  return (
    <>
      {multiple && (
        <MultiAsyncSelect
          options={config.options}
          onValueChange={(e) => field.handleChange(e)}
          hideSelectAll={true}
          hideActions={true}
          placeholder={doRenderText(placeholder)}
          clearText={t(Locale.Shared$Select$Multiple$Cancel)}
          closeText={t(Locale.Shared$Select$Multiple$Close)}
          aria-invalid={isInvalid}
          tabIndex={tabIndex}
        />
      )}
      {!multiple && (
        <Select
          value={field.state.value as any}
          onValueChange={(e) => field.handleChange(e)}
          aria-invalid={isInvalid}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={doRenderText(placeholder)}
              tabIndex={tabIndex}
            />
          </SelectTrigger>
          <SelectContent>
            {config.options.map(({ value, label }) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
}
