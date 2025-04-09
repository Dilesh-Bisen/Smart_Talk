import { ref } from 'vue';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useUserStore } from './users';

interface ChatMessage {
    message: string;
    reply: string;
}

interface FormattedMessage {
    role: 'user' | 'ai';
    content: string;
}

export const useChatStore = defineStore('user-chats', () => {
    const messages = ref<{ role: string; content: string }[]>([]);
    const isLoading = ref(false);

    const userStore = useUserStore();

    const loadChatHistory = async () => {
        if (!userStore.userId) return;

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat-history`,
                {
                    userId: userStore.userId,
                }
            );

            messages.value = data.messages
                .flatMap((msg: ChatMessage): FormattedMessage[] => [
                    { role: 'user', content: msg.message },
                    { role: 'ai', content: msg.reply },
                ])
                .filter((msg: FormattedMessage) => msg.content);
        } catch (error) {
            console.error('Error loading chat history: ', error);
        }
    };

    const sendMessage = async (message: string) => {
        if (!message.trim() || !userStore.userId) return;

        messages.value.push({ role: 'user', content: message });

        isLoading.value = true;

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/user-chats`,
                {
                    message,
                    userId: userStore.userId,
                }
            );

            messages.value.push({ role: 'ai', content: data.response });
        } catch (error) {
            console.error('Error sending message: ', error);
            messages.value.push({
                role: 'ai',
                content: 'Error: unable to process request',
            });
        } finally {
            isLoading.value = false;
        }
    };


    return { messages, isLoading, loadChatHistory, sendMessage };
});