import z, { ZodString } from "zod";
import type { BuilderOptions } from "./brand-form-builder";
import type { RenderText } from "./form-types";
import type { TextField } from "./text-form-builder";
import type { TextareaField } from "./textarea-form-builder";
import type { CodeField } from "./code-form-builder";

// 定义长度验证配置类型
export type LengthSchema = {
  value: number; // 长度值
  error?: RenderText; // 错误提示文本
};

/**
 * 根据表单构建选项生成 Zod 验证 schema
 * @param options 表单字段配置选项
 * @returns Zod 对象 schema
 */
export function getFormSchema<
  TData extends Record<string, any> = Record<string, any>,
>(options: BuilderOptions<TData>): any {
  // 初始化 schema 对象
  const schema: Record<string, any> = {};
  // 遍历所有选项
  for (const key in options) {
    const value = options[key];
    // 跳过提交按钮类型
    if (value.type === "submit") continue;
    if (value.schema) {
      schema[key] = value.schema();
      continue;
    }
    // 处理文本字段
    if (value.type === "text" || value.type === "password") {
      schema[key] = getTextSchema(value);
    }
    if (value.type === "code") {
      schema[key] = getCodeSchema(value);
    }
    // 处理邮箱字段
    if (value.type === "email") {
      schema[key] = getEmailSchema();
    }
    // 处理文本域字段
    if (value.type === "textarea") {
      schema[key] = getTextareaSchema(value);
    }
  }
  // 返回 Zod 对象 schema
  return z.object(schema);
}

/**
 * 为文本字段生成 Zod 验证 schema
 * @param value 文本字段配置
 * @returns Zod 字符串 schema
 */
function getTextSchema(value: TextField) {
  // 初始化字符串验证器，自动去除首尾空格
  let result: ZodString = z.string().trim();
  // 如果字段不是必需的，直接返回基本字符串验证器
  if (!value.required) return result;
  // 如果设置了最小长度，添加最小长度验证
  if (value.minLength) {
    result = result.min(value.minLength.value, {
      error: value.minLength.error,
    });
  }
  // 如果设置了最大长度，添加最大长度验证
  if (value.maxLength) {
    result = result.max(value.maxLength.value, {
      error: value.maxLength.error,
    });
  }
  // 如果没有设置最小或最大长度，但字段是必需的，则至少需要1个字符
  if (!value.minLength && !value.maxLength) {
    result = result.min(1, { error: value.error });
  }
  return result;
}

function getEmailSchema() {
  return z.email();
}

function getCodeSchema(value: CodeField) {
  let result = z.string().trim();
  if (value.length?.value) {
    result = result.length(value.length.value, {
      error: value.length.error,
    });
  }
  return result;
}

/**
 * 为文本域字段生成 Zod 验证 schema
 * @param value 文本域字段配置
 * @returns Zod 字符串 schema
 */
function getTextareaSchema(value: TextareaField) {
  // 初始化字符串验证器，自动去除首尾空格
  let result: ZodString = z.string().trim();
  // 如果字段不是必需的，直接返回基本字符串验证器
  if (!value.required) return result;
  // 如果设置了最小长度，添加最小长度验证
  if (value.minLength) {
    result = result.min(value.minLength.value, {
      error: value.minLength.error,
    });
  }
  // 如果设置了最大长度，添加最大长度验证
  if (value.maxLength) {
    result = result.max(value.maxLength.value, {
      error: value.maxLength.error,
    });
  }
  // 如果没有设置最小或最大长度，但字段是必需的，则至少需要1个字符
  if (!value.minLength && !value.maxLength) {
    result = result.min(1, { error: value.error });
  }
  return result;
}
