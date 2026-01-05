import { parse as parseAkari } from "./parsers/AkariParser.js";
import { type Grid as AkariGrid } from "./types/Akari.js";
import puzzle from "./demo-puzzles/akari1.json" with { type: "json" };

function createEmptyGrid(): AkariGrid {
  return parseAkari(puzzle) 
}

function parsePuzzle(input: any): AkariGrid {
  return parseAkari(input);
}

export { createEmptyGrid, parsePuzzle };