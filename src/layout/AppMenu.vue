<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Trang chủ',
        items: [
            {
                label: 'Chuyển đổi địa chỉ',
                icon: 'pi pi-fw pi-home',
                to: '/'
            }
        ]
    },
    {
        label: 'Thông tin chung',
        path: '/start',
        items: [
            {
                label: 'Đề xuất chỉnh sửa',
                icon: 'pi pi-file-edit',
                to: '/suggest'
            },
            {
                label: 'Liên hệ',
                icon: 'pi pi-at',
                to: '/contact'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
