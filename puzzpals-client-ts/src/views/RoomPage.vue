<template>
  <div v-if="!room">Joining room...</div>
  <div v-else>
    <h2>Room {{ room.token }}</h2>
    <button @click="leave">Leave</button>
    <Grid :socket="socket" :room-token="token"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { io } from 'socket.io-client';
import Grid from '@/components/Grid.vue';

const route = useRoute();
const router = useRouter();
const token = getTokenFromRoute();
const room: Ref<{token: string} | null> = ref(null);
const socket = io(import.meta.env.VITE_API_WS);

function getTokenFromRoute() {
  const token = route.params.token;
  if (typeof token !== "string") {
    throw new Error(`Token is parsed incorrectly (expected string, got ${typeof token})`);
  }
  return token;
}

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
  socket.emit('room:join', { token });
}

async function leave() {
  await api.post(`/rooms/${token}/leave`);
  socket.emit('room:leave', { token });
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
