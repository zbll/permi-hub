import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function setAuthToken(token: string) {
  localStorage.setItem("authToken", token);
}

export async function getAuthToken() {
  return localStorage.getItem("authToken");
}

export async function removeAuthToken() {
  localStorage.removeItem("authToken");
}

/**
 * 函数防抖
 * 返回一个新函数，该函数会推迟原函数的执行，最多等待指定的延迟时间。
 * 主要用于限制函数的调用频率，避免因频繁调用而造成的性能问题。
 *
 * @param func 需要被推迟执行的原函数。
 * @param delay 延迟时间（毫秒）。
 * @returns 返回一个新函数，该函数具有与原函数相同的参数和返回值。
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): T {
  let timeoutId: NodeJS.Timeout | undefined;

  // 返回一个包装函数，用于控制原函数的执行。
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId); // 清除之前的定时器。

    // 设置新的定时器，当延迟时间过后执行原函数。
    timeoutId = setTimeout(() => {
      func.apply(this, args); // 使用apply确保this和参数正确传递给原函数。
      timeoutId = undefined; // 执行完成后，重置timeoutId。
    }, delay);
  } as T;
}

export type MediaData = {
  sm: any;
  md: any;
  lg: any;
  xl: any;
  "2xl": any;
};

export const MediaConfig = {
  RolePermssion: {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    "2xl": 5,
  },
};
