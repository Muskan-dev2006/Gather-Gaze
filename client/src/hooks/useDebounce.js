import { useEffect, useState } from "react";

const DEFAULT_DEBOUNCE_MS = 300;

export default function useDebounce(value, delay = DEFAULT_DEBOUNCE_MS) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
