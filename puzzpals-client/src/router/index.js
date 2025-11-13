import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import RoomPage from '@/views/RoomPage.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/room/:token', component: RoomPage }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
