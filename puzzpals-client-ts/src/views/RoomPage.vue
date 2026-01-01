<template>
  <div v-if="!gridState">Joining room...</div>
  <div v-else>
    <h2>Room {{ token }}</h2>
    <button @click="leave">Leave</button>
    <AkariGrid :grid-state="gridState" @update-cell="onCellUpdated" ref="gridComponent" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type Ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

import api from '@/services/api';
import { socket } from '@/socket';

import AkariGrid from '@/components/AkariGrid.vue';
import type GridState from '@/models/GridState';
import type CellState from '@/models/CellState';

const router = useRouter();

const room: Ref<{ token: string; } | null> = ref(null);
const gridState: Ref<GridState | null> = ref(null);
const gridComponent = useTemplateRef("gridComponent");

const props = defineProps({
  token: { type: String, required: true }
});

async function fetchRoom() {
  try {
    const res = await api.get(`/rooms/${props.token}`);
    room.value = res.data.room;
  } catch (err) {
    console.error(err);
    router.push('/');
  }
}

async function join() {
  const res = await api.post(`/rooms/${props.token}/join`);
  room.value = res.data.room;
  socket.emit('room:join', { token: props.token });
}

async function leave() {
  await api.post(`/rooms/${props.token}/leave`);
  socket.emit('room:leave', { token: props.token });
  router.push('/');
}

function onCellUpdated(idx: number, value: CellState) {
  socket.emit('grid:updateCell', { token: props.token, idx, value });
}

function initiateSocket() {
  if (!socket.connected) {
    socket.connect();
  }

  socket.on('grid:state', (data: GridState) => {
    gridState.value = data;
  });

  socket.on('grid:cellUpdated', (data: { idx: number, value: CellState; }) => {
    if (gridComponent.value === null) {
      throw new Error("Grid is missing");
    }
    const { idx, value } = data;
    gridComponent.value.onCellUpdated(idx, value);
  });
}

onMounted(async () => {
  initiateSocket();

  await fetchRoom();
  console.log(`Joining room ${props.token}`);
  await join();
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>
