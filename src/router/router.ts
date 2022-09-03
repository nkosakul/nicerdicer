import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/WelcomeScreen.vue'),
  },
  {
    path: '/game/:gameId',
    name: 'game',
    component: () => import('@/views/TheGame.vue'),
  },
  {
    path: '/manual',
    name: 'manual',
    component: () => import('@/views/ManualScreen.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
