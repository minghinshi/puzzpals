import Cell from './models/Cell.js';
import { createEmptyGrid } from '../../packages/puzzle-parser/dist/esm/index.js';

// roomId => grid
const grids = new Map();

export { createEmptyGrid, grids };
