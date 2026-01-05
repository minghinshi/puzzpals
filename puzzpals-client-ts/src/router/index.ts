import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';
import RoomPage from '@/views/RoomPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/404', component: NotFound },
    { path: '/room/:token', component: RoomPage, props: true }
  ]
});

export default router;
