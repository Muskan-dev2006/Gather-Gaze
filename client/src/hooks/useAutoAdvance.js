import { useEffect, useState } from "react";

export default function useAutoAdvance(count, delayMs, isPaused) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex((index) => (count > 0 ? index % count : 0));
  }, [count]);

  useEffect(() => {
    if (count < 2 || isPaused) return undefined;
    const timerId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % count);
    }, delayMs);
    return () => window.clearInterval(timerId);
  }, [count, delayMs, isPaused]);

  return [currentIndex, setCurrentIndex];
}
