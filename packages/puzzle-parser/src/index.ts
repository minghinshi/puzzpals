import { parse as parseAkari } from "./parsers/AkariParser.js";
import { type Grid as AkariGrid } from "./types/Akari.js";
import puzzle from "./demo-puzzles/akari2.json" with { type: "json" };

function createEmptyGrid(): AkariGrid {
  return parseAkari(puzzle) 
}

export { createEmptyGrid };