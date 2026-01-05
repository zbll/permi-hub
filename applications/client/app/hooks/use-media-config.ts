import type { MediaData } from "~/lib/utils";
import { useState, useEffect } from "react";

export function useMediaConfig(data: MediaData) {
  const { sm, md, lg, xl, "2xl": twoXl } = data;

  // 定义响应式断点状态
  const [breakpoint, setBreakpoint] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [matches, setMatches] = useState<Record<string, boolean>>({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    "2xl": false,
  });

  // 更新断点匹配状态的函数
  const updateMatches = () => {
    const newMatches: Record<string, boolean> = {
      sm: window.matchMedia(`(max-width: 640px)`).matches,
      md: window.matchMedia(`(max-width: 768px)`).matches,
      lg: window.matchMedia(`(max-width: 1024px)`).matches,
      xl: window.matchMedia(`(max-width: 1280px)`).matches,
      "2xl": window.matchMedia(`(max-width: 1536px)`).matches,
    };

    // 确定当前断点
    let currentBreakpoint: string | null = null;
    if (newMatches.sm) currentBreakpoint = "sm";
    else if (newMatches.md) currentBreakpoint = "md";
    else if (newMatches.lg) currentBreakpoint = "lg";
    else if (newMatches.xl) currentBreakpoint = "xl";
    else if (newMatches["2xl"]) currentBreakpoint = "2xl";

    setMatches(newMatches);
    setBreakpoint(currentBreakpoint);
    setCurrentValue(
      currentBreakpoint ? (data as any)[currentBreakpoint as any] : null,
    );
  };

  useEffect(() => {
    // 初始设置
    updateMatches();

    window.addEventListener("resize", updateMatches);

    // 清理事件监听器
    return () => {
      window.removeEventListener("resize", updateMatches);
    };
  }, [sm, md, lg, xl, twoXl]);

  // 返回断点信息和匹配状态
  return {
    breakpoint,
    matches,
    isSm: matches.sm,
    isMd: matches.md,
    isLg: matches.lg,
    isXl: matches.xl,
    is2Xl: matches["2xl"],
    mediaData: data,
    currentValue,
  };
}
