<script setup lang="ts">
import { onMounted, nextTick, watch } from 'vue';
import { useUserStore } from '../stores/users';
import { useChatStore } from '../stores/chats';
import { useRouter } from 'vue-router';
import Header from '../_components/Header.vue';
import ChatInput from '../_components/ChatInput.vue';

const userStore = useUserStore();
const chatStore = useChatStore();
const router = useRouter();

if (!userStore.userId) {
  router.push('/');
}

const formatMessage = (text: string) => {
  if (!text) return '';
  
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`{3}(.*?)`{3}/gs, '<pre class="bg-gray-700 p-2 rounded my-2 overflow-x-auto"><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 rounded">$1</code>')
    .replace(/(?:^|\n)- (.*?)(?:\n|$)/g, '<li class="ml-4">$1</li>')
    .replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, '<li class="ml-4">$1. $2</li>');
};

const scrollToBottom = () => {
  nextTick(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
};

watch(() => chatStore.messages, scrollToBottom, { deep: true });

onMounted(() => {
  chatStore.loadChatHistory().then(scrollToBottom);
});
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <Header />

    <div id="chat-container" class="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
      <div v-for="(msg, index) in chatStore.messages" :key="index" class="flex items-start"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <div v-html="formatMessage(msg.content)" class="max-w-xs px-4 py-2 rounded-lg md:max-w-md" :class="msg.role === 'user'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-white'
          "></div>
      </div>
      <div v-if="chatStore.isLoading" class="flex justify-start">
        <div class="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Thinking...
        </div>
      </div>
    </div>

    <ChatInput @send="chatStore.sendMessage" />
  </div>
</template>