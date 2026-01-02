<template>
  <div class="grid-wrapper">
    <div class="grid" :style="{
      gridTemplateColumns: `repeat(${gridState.cols}, 1fr)`,
      gridTemplateRows: `repeat(${gridState.rows}, 1fr)`
    }">
      <AkariCell v-for="(cell, idx) in cells" :key="idx" :idx="idx" :cell="cell" @left-click="onCellClicked"
        @right-click="onCellRightClicked" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch, type Ref } from "vue";

import AkariCell from "@/components/AkariCell.vue";
import Cell from "@/models/Cell";
import type CellState from "@/models/CellState";
import type GridState from "@/models/GridState";

const props = defineProps<{
  gridState: GridState;
}>();

const emit = defineEmits(['updateCell']);

const cells: Ref<Cell[]> = ref([]);

const rows = props.gridState.rows;
const cols = props.gridState.cols;
let hasWon = false;

function onCellClicked(cell: Cell) {
  if (cell.toggleLightBulb()) {
    emit('updateCell', cell.idx, cell.state);
  }
}

function onCellRightClicked(cell: Cell) {
  if (cell.toggleNote()) {
    emit('updateCell', cell.idx, cell.state);
  }
}

function onCellUpdated(idx: number, cellState: CellState) {
  const cell = getCell(idx);
  cell.setState(cellState);
}

function getRowCol(idx: number): [number, number] {
  const row = Math.floor(idx / cols);
  const col = idx % cols;
  return [row, col];
}

function getIdx(row: number, col: number) {
  return row * cols + col;
}

function getCell(idx: number) {
  const cell = cells.value[idx];
  if (typeof cell === "undefined") {
    throw new Error(`Cell is undefined (idx = ${idx})`);
  }
  return cell;
}

function onBulbChanged(modifiedCell: Cell) {
  // Light itself up
  modifiedCell.changeLightLevel(modifiedCell.hasBulb);

  const [startRow, startCol] = getRowCol(modifiedCell.idx);
  const steps: [number, number][] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];

  for (const [dr, dc] of steps) {
    let row = startRow + dr;
    let col = startCol + dc;

    // Update number of adjacent bulbs
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      const idx = getIdx(row, col);
      const cell = getCell(idx);
      cell.changeAdjacentBulbCount(modifiedCell.hasBulb);
    }

    // Update light levels
    while (row >= 0 && row < rows && col >= 0 && col < cols) {
      const idx = getIdx(row, col);
      const cell = getCell(idx);
      if (cell.isBlack) {
        break;
      }
      cell.changeLightLevel(modifiedCell.hasBulb);
      row += dr;
      col += dc;
    }
  }

  // Check victory
  if (!hasWon && cells.value.every(cell => cell.isRuleSatisfied)) {
    alert("Congratulations! You have solved the puzzle.");
    hasWon = true;
  }
}

defineExpose({ onCellUpdated });

onBeforeMount(() => {
  // Convert CellStates to Cell objects
  props.gridState.cells.forEach((cellState, idx) => {
    const cell = new Cell(idx);
    cell.setState(cellState);
    cells.value.push(cell);
  });

  // Calculate light levels
  cells.value.forEach(cell => {
    // Initialise light levels
    if (cell.hasBulb) {
      onBulbChanged(cell);
    }
    // Watch light bulbs get added/removed from Cells, and update light levels
    watch(() => cell.hasBulb, () => onBulbChanged(cell));
  });
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
