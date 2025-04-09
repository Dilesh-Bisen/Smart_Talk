import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ChatPage from '../views/ChatPage.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/user-chats', component: ChatPage },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});