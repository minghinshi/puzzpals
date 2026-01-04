<template>
  <div v-if="!gridState">Joining room...</div>
  <div v-else>
    <h2>Room {{ token }}</h2>
    <button @click="leave">Leave</button>
    <AkariGrid :grid-state="gridState" @update-cell="onCellUpdated" ref="gridComponent" />
    <Chat :chat-state="chatState" :userID="userID" @newMessage="onChatSubmit" ref="chatComponent" />  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type Ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

import api from '@/services/api';
import { socket } from '@/socket';

import AkariGrid from '@/components/AkariGrid.vue';
import Chat from '@/components/Chat.vue';
import type GridState from '@/models/GridState';
import type CellState from '@/models/CellState';
import type ChatState from '@/models/ChatState';
import type { ChatMessage } from '@/models/ChatState';

const router = useRouter();

const room: Ref<{ token: string; } | null> = ref(null);
const gridState: Ref<GridState | null> = ref(null);
const gridComponent = useTemplateRef("gridComponent");

const chatState: Ref<ChatState> = ref({messages: []});
const chatComponent = useTemplateRef("chatComponent");

const userID = ref<string | null>(null);
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

function onChatSubmit(message: ChatMessage) {
  if (userID.value) {
    message.user = userID.value;
  }
  socket.emit('chat:newMessage', { token: props.token, message: message });
}


function initiateSocket() {
  if (!socket.connected) {
    socket.connect();
  }

  socket.on('user:id', (id: string) => {
    userID.value = id;
  });

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

  socket.on('chat:records', (history) => {
    if (chatComponent.value === null) {
      throw new Error("Chat Block is missing");
    }
    chatState.value.messages.splice(0, chatState.value.messages.length, ...history);
    chatComponent.value.scrollToBottom();
  });

  socket.on('chat:messageNew', (msgBlock) => {
    if (chatComponent.value === null) {
      throw new Error("Chat Block is missing");
    }
    chatState.value.messages.push(msgBlock);
    chatComponent.value.scrollToBottom();
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
  socket.off('chat:records');
  socket.off('chat:messageNew');
});
</script>
