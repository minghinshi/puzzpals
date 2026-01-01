<template>
  <button @click="create">Create Room</button>
</template>

<script setup lang="ts">
import api from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();

async function create() {
  const res = await api.post('/rooms/create');
  router.push(`/room/${res.data.token}`);
}
</script>
