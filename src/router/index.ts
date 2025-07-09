import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import TipsView from '../views/TipsView.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Tips',
        component: TipsView
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router;