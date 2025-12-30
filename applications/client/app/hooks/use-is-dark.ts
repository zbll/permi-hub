export function useIsDark() {
  let result = false;
  if (window.matchMedia) {
    result = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return result;
}
