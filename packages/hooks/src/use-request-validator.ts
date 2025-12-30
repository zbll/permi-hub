import { RequestError } from "@packages/types";
import type { FindOptionsOrderValue } from "typeorm";

type ValueType =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

export type ValidatorOptions = {
  validatorRequired: (field: string) => string;
  validatorType: (field: string, type: ValueType) => string;
  validatorTypeArray: (field: string) => string;
  validatorNumberMin: (field: string, min: number) => string;
  validatorNumberMax: (field: string, max: number) => string;
  validatorNumberMinMax: (field: string, min: number, max: number) => string;
  validatorStringMinLength: (field: string, min: number) => string;
  validatorStringMaxLength: (field: string, max: number) => string;
  validatorStringMinMaxLength: (
    field: string,
    min: number,
    max: number,
  ) => string;
};

abstract class KeyFilter {
  constructor(
    protected object: Record<string, any>,
    protected key: string,
    protected options: ValidatorOptions,
  ) {}

  protected get value() {
    return this.object[this.key];
  }

  protected checkType(value: ValueType) {
    if (typeof this.value !== value) {
      throw new RequestError(this.options.validatorType(this.key, value));
    }
  }

  protected isArray() {
    if (!Array.isArray(this.value)) {
      throw new RequestError(this.options.validatorTypeArray(this.key));
    }
  }

  protected min(value: number) {
    if (this.value <= value) {
      throw new RequestError(this.options.validatorNumberMin(this.key, value));
    }
  }

  protected max(value: number) {
    if (this.value >= value) {
      throw new RequestError(this.options.validatorNumberMax(this.key, value));
    }
  }

  protected minMax(min: number, max: number) {
    if (this.value <= min || this.value >= max) {
      throw new RequestError(
        this.options.validatorNumberMinMax(this.key, min, max),
      );
    }
  }

  protected minLength(value: number) {
    if (this.value.length < value) {
      throw new RequestError(
        this.options.validatorStringMinLength(this.key, value),
      );
    }
  }

  protected maxLength(value: number) {
    if (this.value.length > value) {
      throw new RequestError(
        this.options.validatorStringMaxLength(this.key, value),
      );
    }
  }

  protected minMaxLength(min: number, max: number) {
    if (this.value.length < min || this.value.length > max) {
      throw new RequestError(
        this.options.validatorStringMinMaxLength(this.key, min, max),
      );
    }
  }
}

class KeyRequiredFilter extends KeyFilter {
  type(value: ValueType) {
    super.checkType(value);
    return this;
  }

  isArray() {
    super.isArray();
    return this;
  }

  min(value: number) {
    super.min(value);
    return this;
  }

  max(value: number) {
    super.max(value);
    return this;
  }

  minMax(min: number, max: number) {
    super.minMax(min, max);
    return this;
  }

  minLength(value: number) {
    super.minLength(value);
    return this;
  }

  maxLength(value: number) {
    super.maxLength(value);
    return this;
  }

  minMaxLength(min: number, max: number) {
    super.minMaxLength(min, max);
    return this;
  }

  toValue<T = any>() {
    return this.value as T;
  }

  toNumber(): number {
    return Number(this.value);
  }

  toString(): string {
    return String(this.value);
  }

  toBoolean(): boolean {
    if (typeof this.value === "string") {
      return this.value === "true";
    }
    if (typeof this.value === "number") {
      return this.value === 1;
    }
    if (typeof this.value === "boolean") {
      return this.value;
    }
    return Boolean(this.value);
  }
}

class KeyOptionalFilter extends KeyFilter {
  type(value: ValueType) {
    if (this.value !== undefined) {
      this.checkType(value);
    }
    return this;
  }
  isArray() {
    if (this.value !== undefined) {
      super.isArray();
    }
    return this;
  }
  min(value: number) {
    if (this.value !== undefined) {
      super.min(value);
    }
    return this;
  }
  max(value: number) {
    if (this.value !== undefined) {
      super.max(value);
    }
    return this;
  }
  minMax(min: number, max: number) {
    if (this.value !== undefined) {
      super.minMax(min, max);
    }
    return this;
  }
  minLength(value: number) {
    if (this.value !== undefined) {
      super.minLength(value);
    }
    return this;
  }
  maxLength(value: number) {
    if (this.value !== undefined) {
      super.maxLength(value);
    }
    return this;
  }
  minMaxLength(min: number, max: number) {
    if (this.value !== undefined) {
      super.minMaxLength(min, max);
    }
    return this;
  }

  toValue<T = any>() {
    return this.value as T | undefined;
  }

  toNumber(): number | undefined {
    return this.value !== undefined ? Number(this.value) : undefined;
  }

  toNumberWithDefault(defaultValue: number): number {
    return this.value !== undefined ? Number(this.value) : defaultValue;
  }

  toString(): string | undefined {
    return this.value !== undefined ? String(this.value) : undefined;
  }

  toStringWithDefault(defaultValue: string): string {
    return this.value !== undefined ? String(this.value) : defaultValue;
  }

  toBoolean(): boolean | undefined {
    if (this.value === undefined) {
      return undefined;
    }
    if (typeof this.value === "string") {
      return this.value === "true";
    }
    if (typeof this.value === "number") {
      return this.value === 1;
    }
    if (typeof this.value === "boolean") {
      return this.value;
    }
    return Boolean(this.value);
  }

  toBooleanWithDefault(defaultValue: boolean): boolean {
    if (this.value === undefined) {
      return defaultValue;
    }
    if (typeof this.value === "string") {
      return this.value === "true";
    }
    if (typeof this.value === "number") {
      return this.value === 1;
    }
    if (typeof this.value === "boolean") {
      return this.value;
    }
    return Boolean(this.value);
  }
}

export function useRequestValidator(
  value: Record<string, any>,
  options: ValidatorOptions,
) {
  const required = (key: string) => {
    if (value[key] === undefined) {
      throw new RequestError(options.validatorRequired(key));
    }
    return new KeyRequiredFilter(value, key, options);
  };

  const optional = (key: string) => {
    return new KeyOptionalFilter(value, key, options);
  };

  const fromSort = (sortKey: string, defaultSort?: FindOptionsOrderValue) => {
    if (value[sortKey] === undefined) return defaultSort;
    const sortValue = value[sortKey].toUpperCase();
    if (sortValue === "ASC") return "ASC";
    if (sortValue === "DESC") return "DESC";
    if (sortValue === "1") return "ASC";
    if (sortValue === "-1") return "DESC";
    return defaultSort;
  };

  return {
    required,
    optional,
    fromSort,
  };
}
