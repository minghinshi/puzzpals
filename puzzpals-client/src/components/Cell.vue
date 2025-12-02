<template>
  <div class="cell" role="button" :aria-pressed="String(cell)" tabindex="0" @click="onClick"
    @keydown.enter.prevent="onClick" @keydown.space.prevent="onClick">
    {{ cell.symbol }}
  </div>
</template>

<script setup>
import Cell from '@/models/Cell';

const props = defineProps({
  idx: Number,
  cell: Cell
});

const emit = defineEmits(['cellClicked'])

function onClick() {
  emit('cellClicked', props.idx)
}
</script>

<style scoped>
.cell {
  aspect-ratio: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #ddd;
  background: v-bind('cell.backgroundColor');
  color: v-bind('cell.textColor');

  cursor: pointer;
}
</style>