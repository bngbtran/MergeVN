import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'convert',
                    component: () => import('@/views/pages/AddressConverter.vue')
                },
                {
                    path: '/contact',
                    component: () => import('@/views/pages/Contact.vue')
                }
            ]
        }
    ]
});

export default router;
