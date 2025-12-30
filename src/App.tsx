import { useEffect, useState } from "react";
import { useTypingTest } from "./hooks/useTypingTest";
import { useBestWPM } from "./hooks/useBestWPM";
import { TypingArea } from "./components/TypingArea";
import type { Difficulty } from "./types/typing";

function App() {
  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");

  const { state, start, restart, handleKey } =
    useTypingTest(difficulty);

  const { best, updateBest } = useBestWPM();

  const startTime = state.startTime ?? Date.now();
  const endTime =
    state.phase === "finished" && state.endTime
      ? state.endTime
      : Date.now();

  const minutes =
    (endTime - startTime) / 60000 || 1 / 60;

  const correct =
    Math.max(state.currentIndex - state.errors.size, 0);

  const wpm = Math.round((correct / 5) / minutes);

  const accuracy =
    state.currentIndex === 0
      ? 100
      : Math.round(
          (correct / state.currentIndex) * 100
        );

  useEffect(() => {
    if (state.phase === "finished") {
      updateBest(difficulty, wpm);
    }
  }, [state.phase, wpm, difficulty]);

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => handleKey(e.key)}
      className="p-8 outline-none"
    >
      <div className="mb-4 flex gap-2">
        {(["easy", "medium", "hard"] as Difficulty[]).map(
          (d) => (
            <button
              key={d}
              disabled={state.phase === "running"}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 border rounded ${
                d === difficulty
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {d}
            </button>
          )
        )}
      </div>

      {state.phase === "idle" && (
        <button
          onClick={start}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Start
        </button>
      )}

      <TypingArea
        passage={state.passage}
        currentIndex={state.currentIndex}
        errors={state.errors}
      />

      {state.phase !== "idle" && (
        <div className="mt-4 space-y-1">
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>
            Best ({difficulty}): {best[difficulty]} WPM
          </p>
        </div>
      )}

      {state.phase === "finished" && (
        <button
          onClick={restart}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Next
        </button>
      )}
    </div>
  );
}

export default App;
