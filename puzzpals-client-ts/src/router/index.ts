import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue';
import RoomPage from '@/views/RoomPage.vue';
import config from '@/config';

const router = createRouter({
  history: createWebHistory(config.baseUrl),
  routes: [
    { path: '/', component: Home },
    { path: '/room/:token', component: RoomPage, props: true }
  ]
});

export default router;
