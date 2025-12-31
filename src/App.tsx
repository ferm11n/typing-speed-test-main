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
      className="p-8 outline-none min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Typing Speed Test
        </h1>
        
        <div className="mb-6 flex justify-center">
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map(
              (d) => (
                <button
                  key={d}
                  disabled={state.phase === "running"}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 border rounded-lg transition-all duration-200 font-medium capitalize ${
                    d === difficulty
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  } ${
                    state.phase === "running" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {d}
                </button>
              )
            )}
          </div>
        </div>

        {state.phase === "idle" && (
          <div className="text-center">
            <button
              onClick={start}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Test
            </button>
            <p className="mt-4 text-gray-600">
              Click the button or start typing to begin
            </p>
          </div>
        )}

        {state.phase === "running" && (
          <div className="text-center mb-4">
            <button
              onClick={restart}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reset
            </button>
            <p className="mt-2 text-sm text-gray-600">
              Press to cancel and start over
            </p>
          </div>
        )}

        <div 
          onClick={state.phase === "idle" ? start : undefined}
          className={`mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200 ${
            state.phase === "idle" ? "cursor-pointer hover:shadow-md transition-shadow" : ""
          }`}
        >
          <TypingArea
            passage={state.passage}
            currentIndex={state.currentIndex}
            errors={state.errors}
          />
        </div>

        {state.phase !== "idle" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{wpm}</p>
                <p className="text-sm text-gray-600">WPM</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.floor((endTime - startTime) / 1000)}s
                </p>
                <p className="text-sm text-gray-600">Time</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-center text-gray-700">
                Best ({difficulty}): <span className="font-bold text-orange-600">{best[difficulty]} WPM</span>
              </p>
            </div>
            
            {state.phase === "finished" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <p className="text-green-600 font-medium">Correct: {correct}</p>
                  </div>
                  <div>
                    <p className="text-red-600 font-medium">Incorrect: {state.errors.size}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {state.phase === "finished" && (
          <div className="text-center mt-6">
            <button
              onClick={restart}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;