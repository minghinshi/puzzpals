<template>
  <div v-if="!room">Joining room...</div>
  <div v-else>
    <h2>Room {{ room.token }}</h2>
    <button @click="leave">Leave</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { io } from 'socket.io-client';

const route = useRoute();
const router = useRouter();
const token = route.params.token;
const room = ref(null);
const socket = io(import.meta.env.VITE_API_WS);

async function fetchRoom() {
  try {
    const res = await api.get(`/rooms/${token}`);
    room.value = res.data.room;
  } catch (err) {
    console.error(err);
    router.push('/');
  }
}

async function join() {
  const res = await api.post(`/rooms/${token}/join`);
  room.value = res.data.room;
  socket.emit('join-room-socket', { token });
}

async function leave() {
  await api.post(`/rooms/${token}/leave`);
  socket.emit('leave-room-socket', { token });
  router.push('/');
}

onMounted(async () => {
  await fetchRoom();
  await join();
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>
