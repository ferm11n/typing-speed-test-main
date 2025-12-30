import { useState, useEffect, useRef } from "react";
import { getRandomPassage } from "../utils/getRandomPassage";
import type { Difficulty, TestPhase, TimerMode } from "../types/typing";

interface TypingState {
  phase: TestPhase;
  passage: string;
  currentIndex: number;
  errors: Set<number>;
  startTime: number | null;
  endTime: number | null;
  timerMode: TimerMode;
  timeRemaining: number | null;
}

export function useTypingTest(difficulty: Difficulty, timerMode: TimerMode) {
  const [state, setState] = useState<TypingState>({
    phase: "idle",
    passage: getRandomPassage(difficulty),
    currentIndex: 0,
    errors: new Set(),
    startTime: null,
    endTime: null,
    timerMode,
    timeRemaining: timerMode === "time" ? 60 : null,
  });


  //Usando tipos de navegador (pq es un challenge enfocado a front)
  const intervalRef = useRef<number | null>(null); 
  //Al usar eso, tmb hay que llamar a window.setTimeout y no solamente a setTimeout

  useEffect(() => {
    if (state.phase === "running" && state.timerMode === "time" && state.timeRemaining !== null) {
      intervalRef.current = setInterval(() => {
        setState((s: TypingState) => {
          const newTimeRemaining = s.timeRemaining! - 1;
          if (newTimeRemaining <= 0) {
            return {
              ...s,
              phase: "finished",
              endTime: Date.now(),
              timeRemaining: 0,
            };
          }
          return { ...s, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.phase, state.timerMode, state.timeRemaining]);

  const start = () => {
    setState({
      phase: "running",
      passage: getRandomPassage(difficulty),
      currentIndex: 0,
      errors: new Set(),
      startTime: Date.now(),
      endTime: null,
      timerMode,
      timeRemaining: timerMode === "time" ? 60 : null,
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
      timerMode,
      timeRemaining: timerMode === "time" ? 60 : null,
    });
  };

  const handleKey = (key: string) => {
    setState((s: TypingState) => {
      if (s.phase !== "running") return s;

      if (key === "Backspace") {
        if (s.currentIndex === 0) return s;
        return { ...s, currentIndex: s.currentIndex - 1 };
      }

      if (key.length !== 1) return s;

      const expected = s.passage[s.currentIndex];
      if (!expected) return s;

      const errors = new Set(s.errors);
      if (key !== expected) errors.add(s.currentIndex);

      const nextIndex = s.currentIndex + 1;
      const finished = s.timerMode === "text" && nextIndex >= s.passage.length;

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