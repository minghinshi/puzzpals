<template>
  <div class="cell" role="button" tabindex="0" @click="onLeftClick" @keydown.enter.prevent="onLeftClick"
    @keydown.space.prevent="onLeftClick" @contextmenu.prevent="onRightClick">
    {{ cell.text }}
  </div>
</template>

<script setup lang="ts">
import Cell from '@/models/Cell';

const props = defineProps({
  cell: { type: Cell, required: true }
});

const emit = defineEmits(['leftClick', 'rightClick']);

function onLeftClick() {
  emit('leftClick', props.cell);
}

function onRightClick() {
  emit('rightClick', props.cell);
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