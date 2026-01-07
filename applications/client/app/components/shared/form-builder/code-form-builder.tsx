import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { useState, useEffect } from "react";
import { BrandInputGroupButton } from "../brand-input-group-button";
import {
  type BaseFormField,
  type FieldType,
  type FormType,
  type RenderText,
  doRenderText,
} from "./form-types";
import type { LengthSchema } from "./form-schma-builder";

export type CodeField = {
  length?: LengthSchema;
  action: {
    text: RenderText;
    onClick?: (formValues: { email: string | undefined }) => Promise<void>;
    countdown?: number;
  };
  getEmail: (form: FormType) => string | undefined;
} & BaseFormField;

export interface CodeFormBuilderProps {
  form: FormType;
  config: CodeField;
  field: FieldType;
  isInvalid: boolean;
  getEmail: (form: FormType) => string | undefined;
}

export function CodeFormBuilder({
  form,
  config,
  field,
  isInvalid,
  getEmail,
}: CodeFormBuilderProps) {
  const { length, placeholder, tabIndex, action } = config;

  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleClick = async () => {
    if (!config.action.onClick || countdown > 0) return;
    setIsLoading(true);
    // 获取表单中的邮箱值
    const formValues = { email: getEmail(form) };
    config.action
      .onClick(formValues)
      .then(() => {
        // 开始60秒倒计时
        setCountdown(action.countdown || 60);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 倒计时效果
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  return (
    <InputGroup>
      <InputGroupInput
        id={field.name}
        name={field.name}
        type="text"
        value={field.state.value as any}
        onBlur={field.handleBlur}
        onChange={(e) => {
          if (length?.value) {
            const value = e.target.value.slice(0, length.value);
            field.handleChange(value);
          } else {
            field.handleChange(e.target.value);
          }
        }}
        aria-invalid={isInvalid}
        placeholder={doRenderText(placeholder)}
        tabIndex={tabIndex}
        maxLength={length?.value}
        autoComplete="one-time-code"
      />
      <InputGroupAddon align="inline-end">
        <BrandInputGroupButton
          type="button"
          variant="outline"
          isLoading={isLoading}
          onClick={handleClick}
          isDisabled={countdown > 0}
        >
          {countdown > 0 ? `${countdown}s后重试` : doRenderText(action.text)}
        </BrandInputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
