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
  const [feedback, setFeedback] = useState<{
    isNewRecord: boolean;
    isBaseline: boolean;
  }>({ isNewRecord: false, isBaseline: false });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(best));
  }, [best]);

  const updateBest = (difficulty: Difficulty, wpm: number) => {
    const previousBest = best[difficulty];
    const isNewRecord = wpm > previousBest && previousBest > 0;
    const isBaseline = previousBest === 0;
    setBest((prev) =>
      wpm > prev[difficulty]
        ? { ...prev, [difficulty]: wpm }
        : prev
    );
    setFeedback({ isNewRecord, isBaseline });

    //Eliminar el feedback despues de 5 segundos
    setTimeout(() => {
      setFeedback({ isNewRecord: false, isBaseline: false });
    }, 5000);
  };

  return { best, updateBest, feedback };
}
