export type Difficulty = "easy" | "medium" | "hard";

export type TestPhase = "idle" | "running" | "finished";

export interface Passage {
  id: string;
  text: string;
}

export type PassageData = Record<Difficulty, Passage[]>;

export type BestWPMRecord = {
  easy: number;
  medium: number;
  hard: number;
};
