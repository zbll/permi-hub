import { Field } from "~/components/ui/field";
import { cn } from "~/lib/utils";
import { BaseLabel } from "./base-label";
import { BaseFormFooter } from "./base-form-footer";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { useState, useEffect } from "react";
import { BrandInputGroupButton } from "../brand-input-group-button";
import {
  type BaseFormField,
  type FormType,
  type RenderText,
  doRenderText,
} from "./form-types";
import type { LengthSchema } from "./form-schma-builder";

export type CodeField = {
  length?: LengthSchema;
  action: {
    text: RenderText;
    onClick?: () => Promise<void>;
    countdown?: number;
  };
} & BaseFormField;

export interface CodeFormBuilderProps {
  form: FormType;
  name: string;
  config: CodeField;
  isFirst: boolean;
}

export function CodeFormBuilder({
  form,
  name,
  config,
  isFirst,
}: CodeFormBuilderProps) {
  const {
    length,
    required,
    label,
    placeholder,
    tabIndex,
    description,
    action,
  } = config;

  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleClick = async () => {
    if (!config.action.onClick || countdown > 0) return;
    setIsLoading(true);
    await config.action.onClick();
    setIsLoading(false);

    // 开始60秒倒计时
    setCountdown(action.countdown || 60);
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
    <form.Field name={name} key={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid} className={cn(!isFirst && "mt-4")}>
            <BaseLabel required={required} label={label} />
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
              />
              <InputGroupAddon align="inline-end">
                <BrandInputGroupButton
                  type="button"
                  variant="outline"
                  isLoading={isLoading}
                  onClick={handleClick}
                  disabled={countdown > 0}
                >
                  {countdown > 0
                    ? `${countdown}s后重试`
                    : doRenderText(action.text)}
                </BrandInputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <BaseFormFooter
              description={description}
              isInvalid={isInvalid}
              errors={field.state.meta.errors}
            />
          </Field>
        );
      }}
    </form.Field>
  );
}
