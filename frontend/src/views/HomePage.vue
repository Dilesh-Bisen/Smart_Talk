<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import logo from '../assets/logo.png';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/users';

const router = useRouter();
const userStore = useUserStore();

const name = ref('');
const email = ref('');
const loading = ref(false);
const error = ref('');

const createUser = async () => {
  error.value = '';

  if (!name.value.trim() || !email.value.trim()) {
    error.value = 'Please enter both your name and email';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Please enter a valid email address';
    return;
  }

  loading.value = true;

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/register-user`,
      { name: name.value.trim(), email: email.value.trim() }
    );

    if (data.userId) {
      userStore.setUser({
        userId: data.userId,
        name: data.name,
      });
      router.push('/user-chats');
    } else {
      error.value = data.error || 'Registration incomplete - you can still try chatting';
      if (data.userId) {
        userStore.setUser({
          userId: data.userId,
          name: name.value.trim(),
        });
        router.push('/user-chats');
      }
    }
  } catch (err: any) {
    if (err.response?.data?.userId) {
      userStore.setUser({
        userId: err.response.data.userId,
        name: name.value.trim(),
      });
      router.push('/user-chats');
    } else {
      error.value = err.response?.data?.error ||
        'Service temporarily unavailable. Please try again shortly.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center p-4">
    <div
      class="w-full max-w-md bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
      <div class="p-8 text-center">
        <img :src="logo" alt="Smart Talk" class="mx-auto w-20 h-20 mb-6">
        <h1 class="text-3xl font-bold text-white mb-2">Smart Talk</h1>
        <p class="text-gray-300 mb-8">Your AI-powered conversation partner</p>

        <div class="space-y-4">
          <div>
            <input v-model="name" type="text" placeholder="Your Name"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
          </div>

          <div>
            <input v-model="email" type="email" placeholder="Your Email"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
          </div>

          <button @click="createUser" :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center"
            :class="{ 'opacity-70': loading }">
            <span v-if="!loading">Begin Chatting</span>
            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </button>

          <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 text-sm">
            {{ error }}
          </div>
        </div>
      </div>

      <div class="bg-gray-900/50 p-4 text-center text-gray-400 text-xs">
        By continuing, you agree to our Terms of Service
      </div>
    </div>
  </div>
</template>
