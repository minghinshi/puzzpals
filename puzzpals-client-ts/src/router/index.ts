import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue';
import RoomPage from '@/views/RoomPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/room/:token', component: RoomPage }
  ]
});

export default router;
