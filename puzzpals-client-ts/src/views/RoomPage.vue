<template>
  <div v-if="!initGridState">Joining room...</div>
  <div v-else>
    <h2>Room {{ token }}</h2>
    <button @click="leave">Leave</button>
    <PuzzleArea 
      :init-grid-state="initGridState" 
      @update-cell="onCellUpdated" 
      ref="areaComponent"
    ></PuzzleArea>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref, type Ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

import api from '@/services/api';
import socket from '@/socket';
import PuzzleArea from '@/components/PuzzleArea.vue';

import type CellState from '@/models/CellState';
import type GridState from '@/models/GridState';

const router = useRouter();

const room: Ref<{ token: string; } | null> = ref(null);
const initGridState: Ref<GridState | null> = ref(null);
const areaComponent = useTemplateRef("areaComponent");

const props = defineProps({
  token: { type: String, required: true }
});

function is404(err: unknown) {
  return typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof err.response === 'object' &&
    err.response !== null &&
    'status' in err.response &&
    err.response.status === 404;
}

async function fetchRoom() {
  try {
    const res = await api.get(`/rooms/${props.token}`);
    room.value = res.data.room;
  } catch (err) {
    if (is404(err)) {
      router.push('/404');
    } else {
      console.error(err);
      router.push('/');
    }
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
  socket.on('grid:state', (data: GridState) => {
    initGridState.value = data;
  });

  socket.on('grid:cellUpdated', (data: { idx: number, value: CellState; }) => {
    const { idx, value } = data;
    if (areaComponent.value === null) return;
    areaComponent.value.onCellUpdated(idx, value);
  });
}

onBeforeMount(initiateSocket);

onMounted(async () => {
  await fetchRoom();
  console.log(`Joining room ${props.token}`);
  await join();
});

onBeforeUnmount(() => {
  socket.emit('room:leave', { token: props.token });
  socket.off("grid:state");
  socket.off("grid:cellUpdated");
});
</script>
