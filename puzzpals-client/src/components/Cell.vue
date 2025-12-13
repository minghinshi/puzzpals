<template>
  <div class="cell" role="button" :aria-pressed="String(cell)" tabindex="0" @click="onLeftClick"
    @keydown.enter.prevent="onLeftClick" @keydown.space.prevent="onLeftClick" @contextmenu.prevent="onRightClick">
    {{ cell.symbol }}
  </div>
</template>

<script setup>
import Cell from '@/models/Cell';

const props = defineProps({
  idx: Number,
  cell: Cell
});

const emit = defineEmits(['leftClick', 'rightClick']);

function onLeftClick() {
  emit('leftClick', props.idx);
}

function onRightClick() {
  emit('rightClick', props.idx);
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