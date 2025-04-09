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
  if (!name.value || !email.value) {
    error.value = 'Please enter both your name and email to continue';
    return;
  }

  if (!email.value.includes('@')) {
    error.value = 'Please enter a valid email address';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/register-user`,
      {
        name: name.value,
        email: email.value,
      }
    );

    userStore.setUser({
      userId: data.userId,
      name: data.name,
    });

    router.push('/user-chats');
  } catch (err) {
    error.value = 'We encountered an issue. Please try again in a moment.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-900 text-white px-4">
    <div class="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md space-y-4">
      <img :src="logo" alt="logo" class="mx-auto w-24 h-24" />
      <h1 class="text-2xl font-semibold text-center">
        Welcome to Smart Talk
      </h1>
      <p class="text-gray-400 text-center">
        Your intelligent chat assistant
      </p>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Your Name</label>
          <input 
            type="text" 
            class="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter your name" 
            v-model="name" 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Your Email</label>
          <input 
            type="email" 
            class="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter your email" 
            v-model="email" 
          />
        </div>

        <button 
          @click="createUser" 
          class="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center justify-center"
          :disabled="loading"
        >
          <span v-if="!loading">Start Chatting</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>

        <p v-if="error" class="text-red-400 text-center text-sm mt-2">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>