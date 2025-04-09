<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');
const emit = defineEmits(['send']);

const sendMessage = () => {
  if (!message.value.trim()) return;
  emit('send', message.value);
  message.value = '';
};
</script>

<template>
  <div class="p-4 bg-gray-800 flex items-center border-t border-gray-700">
    <input 
      v-model="message" 
      @keyup.enter="sendMessage" 
      placeholder="Type your message..." 
      type="text"
      class="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
    <button 
      @click="sendMessage" 
      class="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center justify-center"
      :disabled="!message.trim()"
      :class="{'opacity-50 cursor-not-allowed': !message.trim()}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>