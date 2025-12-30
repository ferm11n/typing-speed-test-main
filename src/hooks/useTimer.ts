import { useEffect, useState } from "react";
import type { TestPhase } from "../types/typing";

interface TimerOptions {
  phase: TestPhase;
  duration: number; // segundos
}

export function useTimer({ phase, duration }: TimerOptions) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (phase !== "running") return;

    setTimeLeft(duration);

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, duration]);

  return {
    timeLeft,
    isFinished: timeLeft === 0,
  };
}
