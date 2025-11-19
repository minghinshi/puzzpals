<template>
  <div class="grid-wrapper">
    <div class="grid" :style="{
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`
    }">
      <Cell v-for="(cell, idx) in cells" :key="idx" :idx="idx" :cell="cell" @cell-clicked="onCellClicked" />
    </div>
  </div>
</template>

<script setup>
import Cell from "@/components/Cell.vue";
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
  cells.value = grid.cells;
}

function onCellClicked(idx) {
  cells.value[idx] = !cells.value[idx];
  const row = Math.floor(idx / cols.value);
  const col = idx % cols.value;
  props.socket.emit('grid:updateCell', { token: props.roomToken, row, col, value: cells.value[idx] })
}

props.socket.on('grid:state', grid => {
  applyState(grid);
});

props.socket.on('grid:cellUpdated', data => {
  const { row, col, value } = data;
  const idx = row * cols.value + col;
  cells.value[idx] = value;
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
