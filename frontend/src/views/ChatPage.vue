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
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`{3}([\s\S]*?)`{3}/g, '<pre class="bg-gray-800 rounded p-3 my-2 overflow-x-auto"><code>$1</code></pre>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n/g, '<br>');
};

const scrollToBottom = () => {
  nextTick(() => {
    const container = document.getElementById('chat-container');
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
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
  <div class="flex flex-col h-screen bg-gray-900 text-gray-100">
    <Header />
    
    <div id="chat-container" class="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
      <div v-for="(msg, index) in chatStore.messages" :key="index" 
           class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <div :class="msg.role === 'user' 
          ? 'bg-indigo-600 text-white rounded-br-none'
          : 'bg-gray-700 rounded-bl-none'
          " class="max-w-[85%] lg:max-w-[65%] px-4 py-3 rounded-lg relative">
          
          <div v-if="msg.role === 'ai'" class="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <div v-html="formatMessage(msg.content)" class="prose prose-invert max-w-none"></div>
        </div>
      </div>
      
      <div v-if="chatStore.isLoading" class="flex justify-start">
        <div class="bg-gray-800 px-4 py-3 rounded-lg flex items-center space-x-2">
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
          <span class="ml-2">Thinking...</span>
        </div>
      </div>
    </div>
    
    <ChatInput @send="chatStore.sendMessage" />
  </div>
</template>