<template>
  <div class="cell" role="button" :aria-pressed="String(cell)" tabindex="0" @click="onLeftClick"
    @keydown.enter.prevent="onLeftClick" @keydown.space.prevent="onLeftClick" @contextmenu.prevent="onRightClick">
    {{ text }}
  </div>
</template>

<script setup>
import Cell, { BULB, DOT, NO_INPUT } from '@/models/Cell';
import { computed } from 'vue';

const bulbText = '💡';
const dotText = '·';

const props = defineProps({
  idx: Number,
  cell: Cell
});

const emit = defineEmits(['leftClick', 'rightClick']);

const text = computed(() => {
  if (props.cell.isBlack) {
    if (props.cell.number === null) {
      return '';
    } else {
      return props.cell.number.toString();
    }
  } else {
    switch (props.cell.input) {
      case BULB:
        return bulbText;
      case DOT:
        return dotText;
      case NO_INPUT:
        return '';
      default:
        throw new Error("Cell has invalid input");
    }
  }
});

const backgroundColor = computed(() => {
  return props.cell.isBlack ? "#000000" : "#ffffff";
});

const textColor = computed(() => {
  return props.cell.isBlack ? "#ffffff" : "#000000";
});

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
  background: v-bind('backgroundColor');
  color: v-bind('textColor');

  cursor: pointer;
}
</style>