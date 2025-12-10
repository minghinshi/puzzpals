<template>
  <div class="grid-wrapper">
    <div class="grid" :style="{
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`
    }">
      <CellComponent v-for="(cell, idx) in cells" :key="idx" :idx="idx" :cell="cell" @cell-clicked="onCellClicked" />
    </div>
  </div>
</template>

<script setup>
import CellComponent from "@/components/Cell.vue";
import Cell from "@/models/Cell";
import { Socket } from "socket.io-client";
import { ref } from "vue";

const rows = ref(-1);
const cols = ref(-1);
const cells = ref([]);

const props = defineProps({
  socket: Socket,
  roomToken: String
});

function applyState(grid) {
  rows.value = grid.rows;
  cols.value = grid.cols;

  // Received cells are plain objects, convert then to Cell objects
  const newCells = [];
  grid.cells.forEach(cell => {
    const newCell = new Cell();
    newCell.setData(cell);
    newCells.push(newCell);
  });
  cells.value = newCells;
}

function onCellClicked(idx) {
  if (cells.value[idx].toggleLightBulb()) {
    // Send the updated cell
    console.log(cells.value[idx]);
    
    props.socket.emit('grid:updateCell', { token: props.roomToken, idx, value: cells.value[idx] })
  }
}

props.socket.on('grid:state', grid => {
  applyState(grid);
});

props.socket.on('grid:cellUpdated', data => {
  const { idx, value } = data;
  cells.value[idx].setData(value);
})
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
