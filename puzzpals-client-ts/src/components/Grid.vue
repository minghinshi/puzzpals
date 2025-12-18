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
import { ref, type Ref } from "vue";

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

props.socket.on('grid:state', (data: GridState) => {
  applyState(data);
});

props.socket.on('grid:cellUpdated', (data: {idx: number, value: CellState}) => {
  const cell = cells.value[data.idx];
  if (typeof cell === "undefined") {
    throw new Error(`Cell is undefined (idx = ${data.idx})`);
  }
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
