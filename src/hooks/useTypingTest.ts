import { useState } from "react";
import { getRandomPassage } from "../utils/getRandomPassage";
import type { Difficulty, TestPhase } from "../types/typing";

interface TypingState {
  phase: TestPhase;
  passage: string;
  currentIndex: number;
  errors: Set<number>;
  startTime: number | null;
  endTime: number | null;
}

export function useTypingTest(difficulty: Difficulty) {
  const [state, setState] = useState<TypingState>({
    phase: "idle",
    passage: getRandomPassage(difficulty),
    currentIndex: 0,
    errors: new Set(),
    startTime: null,
    endTime: null,
  });

  const start = () => {
    setState({
      phase: "running",
      passage: getRandomPassage(difficulty),
      currentIndex: 0,
      errors: new Set(),
      startTime: Date.now(),
      endTime: null,
    });
  };

  const restart = () => {
    setState({
      phase: "idle",
      passage: getRandomPassage(difficulty),
      currentIndex: 0,
      errors: new Set(),
      startTime: null,
      endTime: null,
    });
  };

  const handleKey = (key: string) => {
    setState((s) => {
      if (s.phase !== "running") return s;

      if (key === "Backspace") {
        if (s.currentIndex === 0) return s;
        const newIndex = s.currentIndex - 1;
        const errors = new Set(s.errors);
        // Eliminar el error de la posición anterior si existe
        errors.delete(newIndex);
        return { ...s, currentIndex: newIndex, errors };
      }

      if (key.length !== 1) return s;

      const expected = s.passage[s.currentIndex];
      if (!expected) return s;

      const errors = new Set(s.errors);
      if (key !== expected) {
        errors.add(s.currentIndex);
      } else {
        // Si la letra es correcta, eliminar cualquier error en esta posición
        errors.delete(s.currentIndex);
      }

      const nextIndex = s.currentIndex + 1;
      const finished = nextIndex >= s.passage.length;

      return {
        ...s,
        phase: finished ? "finished" : "running",
        currentIndex: nextIndex,
        errors,
        endTime: finished ? Date.now() : s.endTime,
      };
    });
  };

  return {
    state,
    start,
    restart,
    handleKey,
  };
}
