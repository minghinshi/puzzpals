<template>
  <div class="grid-wrapper">
    <div class="grid" :style="{
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`
    }">
      <CellComponent v-for="(cell, idx) in cells" :key="idx" :idx="idx" :cell="cell" @left-click="onCellClicked"
        @right-click="onCellRightClicked" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CellComponent from "@/components/Cell.vue";
import Cell from "@/models/Cell";
import type CellState from "@/models/CellState";
import type GridState from "@/models/GridState";
import { Socket } from "socket.io-client";
import { ref, watch, type Ref } from "vue";

const rows: Ref<number> = ref(-1);
const cols: Ref<number> = ref(-1);
const cells: Ref<Cell[]> = ref([]);

const props = defineProps({
  socket: { type: Socket, required: true },
  roomToken: { type: String, required: true }
});

function applyState(gridState: GridState) {
  rows.value = gridState.rows;
  cols.value = gridState.cols;

  // Received cells are plain objects, convert then to Cell objects
  const newCells: Cell[] = [];
  gridState.cells.forEach((cellState, idx) => {
    const cell = new Cell(idx);
    cell.setState(cellState);
    newCells.push(cell);
  });
  cells.value = newCells;

  // Grid is now ready, calculate light levels
  cells.value.forEach(cell => {
    // Initialise light levels
    if (cell.hasBulb) {
      updateLight(cell, true);
    }
    // Watch light bulbs get added/removed from Cells, and update light levels
    watch(() => cell.hasBulb, (wasBulbAdded) => updateLight(cell, wasBulbAdded));
  });
}

function onCellClicked(cell: Cell) {
  if (cell.toggleLightBulb()) {
    props.socket.emit('grid:updateCell', { token: props.roomToken, idx: cell.idx, value: cell.state });
  }
}

function onCellRightClicked(cell: Cell) {
  if (cell.toggleNote()) {
    props.socket.emit('grid:updateCell', { token: props.roomToken, idx: cell.idx, value: cell.state });
  }
}

function getRowCol(idx: number): [number, number] {
  const row = Math.floor(idx / cols.value);
  const col = idx % cols.value;
  return [row, col];
}

function getIdx(row: number, col: number) {
  return row * cols.value + col;
}

function getCell(idx: number) {
  const cell = cells.value[idx];
  if (typeof cell === "undefined") {
    throw new Error(`Cell is undefined (idx = ${idx})`);
  }
  return cell;
}

function updateLight(modifiedCell: Cell, wasBulbAdded: boolean) {
  // Light itself up
  modifiedCell.changeLightLevel(wasBulbAdded);

  const [startRow, startCol] = getRowCol(modifiedCell.idx);
  const steps: [number, number][] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];

  for (const [dr, dc] of steps) {
    // Scan in one direction
    let row = startRow + dr;
    let col = startCol + dc;
    while (row >= 0 && row < rows.value && col >= 0 && col < cols.value) {
      const idx = getIdx(row, col);
      const cell = getCell(idx);
      if (cell.isBlack) {
        break;
      }
      cell.changeLightLevel(wasBulbAdded);
      row += dr;
      col += dc;
    }
  }
}

props.socket.on('grid:state', (data: GridState) => {
  applyState(data);
});

props.socket.on('grid:cellUpdated', (data: { idx: number, value: CellState; }) => {
  const cell = getCell(data.idx);
  cell.setState(data.value);
});
</script>

<style scoped>
.grid-wrapper {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 12px;
}

.grid {
  display: grid;
}
</style>
