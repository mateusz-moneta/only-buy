type FuncType = (...args: unknown[]) => void;

export const debounce = (func: FuncType, wait: number, immediate: boolean) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: unknown[]) => {
    const later = () => {
      timeout = undefined;

      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
};
