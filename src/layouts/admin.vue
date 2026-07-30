<template>
  <div class="min-vh-full flex bg-gray-100">
    <AdminSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
    <div class="flex flex-1 flex-col overflow-hidden">
      <AdminNavbar @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
      <main class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminSidebar from './admin/components/sidebar.vue';
import AdminNavbar from './admin/components/navbar.vue';

defineOptions({ name: 'LayoutAdmin' });

const sidebarCollapsed = ref(false);
</script>
