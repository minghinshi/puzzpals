<template>
  <div class="grid-wrapper">
    <div v-if="gridData" class="grid" 
      :style="{
      gridTemplateColumns: `repeat(${gridData.cols}, 1fr)`,
      gridTemplateRows: `repeat(${gridData.rows}, 1fr)`
    }">
      <AkariCell 
        v-for="(cell, idx) in gridData.cells" 
        :key="idx" 
        :idx="idx" 
        :cell="cell" 
        :display-status="cellDisplayStatuses[idx] ?? null"
        @left-click="onCellClicked"
        @right-click="onCellRightClicked" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, type Ref, computed } from "vue";

import AkariCell from "@/components/AkariCell.vue";
import Cell from "@/models/Cell";
import Grid from "@/models/Grid";
import { type CellStatus } from "@/models/CellStatus";


const props = defineProps<{
  gridData?: Grid;
}>();

let hasWon = false;

const emit = defineEmits(['left-click', 'right-click']);

const rows = computed(() => props.gridData?.rows ?? 0);
const cols = computed(() => props.gridData?.cols ?? 0);
const cellDisplayStatuses: Ref<CellStatus[]> = computed(() => {
  if (!props.gridData) return [];
  return props.gridData.cells.map(cell => computeDisplayStatus(cell, props.gridData));
})

function onCellClicked(cell: Cell) {
  emit('left-click', cell);
}

function onCellRightClicked(cell: Cell) {
  emit('right-click', cell);
}

function getRowCol(idx: number): [number, number] {
  const row = Math.floor(idx / cols.value);
  const col = idx % cols.value;
  return [row, col];
}

function getIdx(row: number, col: number) {
  return row * cols.value + col;
}

function computeDisplayStatus(cell: Cell, grid: Grid | undefined): CellStatus {
  const directions: [number, number][] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];

  if (grid === undefined) {
    return {
      isLit: false,
      isNumberError: false,
      isBulbError: false,
      isRuleSatisfied: false
    };
  }

  if (cell.isBlack) {
    // If black cell, check number constraint
    const [row, col] = getRowCol(cell.idx);
    const number = cell.state.number;
    if (number === null) {
      return {
        isLit: false,
        isNumberError: false,
        isBulbError: false,
        isRuleSatisfied: true
      };
    }

    // Check adjacent bulbs
    let adjacentBulbCount = 0;
    const bulbsCount = 0
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < rows.value && newCol >= 0 && newCol < cols.value) {
        const neighborIdx = getIdx(newRow, newCol);
        const neighborCell = grid.cells[neighborIdx];
        if (neighborCell === undefined) {
          throw new Error("Neighbor cell is undefined");
        }
        if (neighborCell.hasBulb) {
          adjacentBulbCount++;
        }
      }
    }
    return {
      isLit: false,
      isNumberError: adjacentBulbCount > number,
      isBulbError: false,
      isRuleSatisfied: adjacentBulbCount === number
    };
  }
  
  // If white cell, check lighting and bulb errors
  let isLit = cell.hasBulb, hasBulbError = false;
  const isBulb = cell.hasBulb;

  for (const [dr, dc] of directions) {
    let row = Math.floor(cell.idx / cols.value) + dr;
    let col = (cell.idx % cols.value) + dc;

    while (row >= 0 && row < rows.value && col >= 0 && col < cols.value) {
      const idx = getIdx(row, col);
      const currentCell = grid.cells[idx];

      if (currentCell === undefined) {
        throw new Error("Current cell is undefined");
      }

      // Stop ray propagation at black cells
      if (currentCell.isBlack) {
        break;
      }

      if (currentCell.hasBulb) {
        if (isBulb) {
          hasBulbError = true; // More than one bulb lighting this cell
        }
        isLit = true;
      }
      row += dr;
      col += dc;
    }
  }

  return {
    isLit: isLit,
    isNumberError: false,
    isBulbError: hasBulbError,
    isRuleSatisfied: isLit && !hasBulbError
  };
}

watch(() => cellDisplayStatuses.value, (newStatuses) => {
  if (newStatuses.length === 0 || props.gridData === undefined) {
    return;
  }
  if (!hasWon && newStatuses.every((status) => status.isRuleSatisfied)) {
    alert("Congratulations! You have solved the puzzle.");
    hasWon = true;
  }
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
