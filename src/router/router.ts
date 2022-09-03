import { createRouter, createWebHistory } from 'vue-router';

const WelcomeScreen = () => import('@/views/WelcomeScreen.vue');
const GameScreen = () => import('@/views/GameScreen.vue');

const routes = [
  { path: '/', name: 'Welcome', component: WelcomeScreen },
  { path: '/game/:gameId', name: 'Gameboard', component: GameScreen },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
