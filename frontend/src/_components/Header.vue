<script setup lang="ts">
import { useUserStore } from '../stores/users';
import { useRouter } from 'vue-router';
import logo from '../assets/logo.png';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<template>
  <header class="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img :src="logo" alt="Smart Talk" class="w-15 h-15">
        <h1 class="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Smart Talk
        </h1>
      </div>
      
      <div class="flex items-center space-x-5">
        <span class="text-gray-300 hidden sm:inline">
          Hi, {{ userStore.name || 'User' }}
        </span>
        <button 
          @click="logout"
          class="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg text-sm font-medium transition-colors border border-red-500/30 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </header>
</template>