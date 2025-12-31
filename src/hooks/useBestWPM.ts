import { useEffect, useState } from "react";
import type { BestWPMRecord, Difficulty } from "../types/typing";

const STORAGE_KEY = "best-wpm";

const DEFAULT: BestWPMRecord = {
  easy: 0,
  medium: 0,
  hard: 0,
};

export function useBestWPM() {
  const [best, setBest] = useState<BestWPMRecord>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(best));
  }, [best]);

  const updateBest = (difficulty: Difficulty, wpm: number) => {
    setBest((prev) =>
      wpm > prev[difficulty]
        ? { ...prev, [difficulty]: wpm }
        : prev
    );
  };

  return { best, updateBest };
}
