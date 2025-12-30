import { useEffect, useState } from "react";
import { useTypingTest } from "./hooks/useTypingTest";
import { useBestWPM } from "./hooks/useBestWPM";
import { TypingArea } from "./components/TypingArea";
import { FeedbackMessage } from "./components/FeedbackMessage";
import { Confetti } from "./components/Confetti";
import type { Difficulty, TimerMode } from "./types/typing";

function App() {
  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");
  
  const [timerMode, setTimerMode] =
    useState<TimerMode>("time");

  const { state, start, restart, handleKey } =
    useTypingTest(difficulty, timerMode);

  const { best, updateBest, feedback } = useBestWPM();

  const startTime = state.startTime ?? Date.now();
  const endTime =
    state.phase === "finished" && state.endTime
      ? state.endTime
      : Date.now();

  const minutes = timerMode === "time" 
    ? 1 
    : (endTime - startTime) / 60000 || 1 / 60;

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
          Test de Velocidad de Escritura
        </h1>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as Difficulty[]).map(
              (d) => (
                <button
                  key={d}
                  disabled={state.phase === "running"}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 border rounded-lg transition-all duration-200 font-medium ${
                    d === difficulty
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  } ${
                    state.phase === "running" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {d === "easy" ? "Fácil" : d === "medium" ? "Medio" : "Difícil"}
                </button>
              )
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              disabled={state.phase === "running"}
              onClick={() => setTimerMode("time")}
              className={`px-4 py-2 border rounded-lg transition-all duration-200 font-medium ${
                timerMode === "time"
                  ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              } ${
                state.phase === "running" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              Con tiempo (60 s)
            </button>
            <button
              disabled={state.phase === "running"}
              onClick={() => setTimerMode("text")}
              className={`px-4 py-2 border rounded-lg transition-all duration-200 font-medium ${
                timerMode === "text"
                  ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              } ${
                state.phase === "running" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              Texto
            </button>
          </div>
        </div>

        {state.phase === "idle" && (
          <div className="text-center">
            <button
              onClick={start}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Iniciar Test
            </button>
            <p className="mt-4 text-gray-600">
              Haz clic en el botón o comienza a escribir para iniciar
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

        <FeedbackMessage 
          isNewRecord={feedback.isNewRecord}
          isBaseline={feedback.isBaseline}
        />

        {state.phase !== "idle" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{wpm}</p>
                <p className="text-sm text-gray-600">WPM</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-sm text-gray-600">Precisión</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {timerMode === "time" && state.timeRemaining !== null
                    ? `${state.timeRemaining}s`
                    : `${Math.floor((endTime - startTime) / 1000)}s`}
                </p>
                <p className="text-sm text-gray-600">
                  {timerMode === "time" ? "Tiempo restante" : "Tiempo transcurrido"}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-center text-gray-700">
                Mejor marca ({difficulty === "easy" ? "Fácil" : difficulty === "medium" ? "Medio" : "Difícil"}): <span className="font-bold text-orange-600">{best[difficulty]} WPM</span>
              </p>
            </div>
            
            {state.phase === "finished" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <p className="text-green-600 font-medium">Correctos: {correct}</p>
                  </div>
                  <div>
                    <p className="text-red-600 font-medium">Incorrectos: {state.errors.size}</p>
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
              Siguiente Texto
            </button>
          </div>
        )}
      </div>
      
      <Confetti trigger={feedback.isNewRecord} />
    </div>
  );
}

export default App;