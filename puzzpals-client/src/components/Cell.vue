<template>
  <div class="cell" :class="{ colored: cell }" role="button" :aria-pressed="String(cell)" tabindex="0" @click="onClick"
    @keydown.enter.prevent="onClick" @keydown.space.prevent="onClick"> </div>
</template>

<script setup>
const props = defineProps({
  idx: Number,
  cell: Boolean // Can be a complex Cell object later
});

const emit = defineEmits(['cellClicked'])

function onClick() {
  emit('cellClicked', props.idx)
}
</script>

<style scoped>
.cell {
  aspect-ratio: 1 / 1;
  background: #f0f0f0;
  border: 1px solid #d0d0d0;
  cursor: pointer;
}

.cell.colored {
  background: #ffeb66;
}
</style>