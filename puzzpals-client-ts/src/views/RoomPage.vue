<template>
  <div v-if="!gridData">Joining room...</div>
  <div v-else>
    <h2>Room {{ token }}</h2>
    <button @click="leave">Leave</button>
    <AkariGrid 
      :grid-data="gridData" 
      @left-click="onCellClicked"
      @right-click="onCellRightClicked" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';
import { useRouter } from 'vue-router';

import api from '@/services/api';
import { socket } from '@/socket';

import AkariGrid from '@/components/AkariGrid.vue';

import Cell from '@/models/Cell';
import Grid from '@/models/Grid';
import type GridState from '@/models/GridState';
import type CellState from '@/models/CellState';

const router = useRouter();

const room: Ref<{ token: string; } | null> = ref(null);
const gridData: Ref<Grid | null> = ref(null);

function cloneCellState(state: CellState): CellState {
  return JSON.parse(JSON.stringify(state));
}

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

function onCellClicked(cell: Cell) {
  const newCell = new Cell(cell.idx);
  newCell.setState(cell.state);
  if (newCell.toggleLightBulb()) {
    const [idx, state] = [cell.idx, cloneCellState(newCell.state)];
    notifyServerCellUpdated(idx, state);
  }
}

function onCellRightClicked(cell: Cell) {
  const newCell = new Cell(cell.idx);
  newCell.setState(cell.state);
  if (newCell.toggleNote()) {
    const [idx, state] = [cell.idx, cloneCellState(newCell.state)];
    notifyServerCellUpdated(idx, state);
  }
}

function updateCellState(idx: number, value: CellState) {
  if (!gridData.value) return;
  gridData.value.setCellState(idx, value);
}

function notifyServerCellUpdated(idx: number, value: CellState) {
  socket.emit('grid:updateCell', { token: props.token, idx, value });
}

function initiateSocket() {
  if (!socket.connected) {
    socket.connect();
  }

  socket.on('grid:state', (data: GridState) => {
    gridData.value = new Grid(data.rows, data.cols, data.cells);
  });

  socket.on('grid:cellUpdated', (data: { idx: number, value: CellState; }) => {
    const { idx, value } = data;
    updateCellState(idx, value);
  });
}


onMounted(async () => {
  initiateSocket();
  
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
