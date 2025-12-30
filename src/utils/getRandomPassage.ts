import passages from "../data/data.json";
import type { Difficulty } from "../types/typing";
import type { PassageData } from "../types/typing";

const data = passages as PassageData;

export function getRandomPassage(difficulty: Difficulty): string {
  const list = data[difficulty];
  const index = Math.floor(Math.random() * list.length);
  return list[index].text;
}
