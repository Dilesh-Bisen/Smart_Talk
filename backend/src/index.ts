import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamChat } from 'stream-chat';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from './config/db_connection.js';
import { chats, users } from './models/schema.js';
import { eq } from 'drizzle-orm';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const chatClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!,
    { timeout: 10000 }
);

async function queryUsersWithRetry(query: any, retries = 3, delay = 1000): Promise<any> {
    try {
        return await chatClient.queryUsers(query);
    } catch (error) {
        if (retries <= 0) throw error;
        await new Promise(res => setTimeout(res, delay));
        return queryUsersWithRetry(query, retries - 1, delay * 2);
    }
}

app.get('/users', async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await queryUsersWithRetry({});
        res.status(200).json({ users: result.users });
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        res.status(500).json({
            error: 'Failed to fetch users',
            details: err.message
        });
    }
});

app.post('/register-user', async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Please send data in JSON format' });
        }

        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                error: 'Both name and email are required to register',
                received: req.body
            });
        }

        const userId = email.replace(/[^0-9a-zA-Z_-]/g, '_');

        try {
            const userResponse = await queryUsersWithRetry({ id: { $eq: userId } });

            if (!userResponse.users.length) {
                try {
                    await chatClient.upsertUser({
                        id: userId,
                        name: name,
                        email: email,
                        role: 'user',
                    });
                } catch (streamError) {
                    console.warn('Stream Chat user creation warning:', streamError);
                }
            }

            const user_exist = await db
                .select()
                .from(users)
                .where(eq(users.userId, userId));

            if (!user_exist.length) {
                console.log(`Registering new user: ${userId}`);
                await db.insert(users).values({ userId, name, email });
            }

            return res.status(200).json({
                userId,
                name,
                email,
                message: 'Registration successful'
            });

        } catch (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({
                error: 'Account created but database update failed',
                details: 'You can still chat, but history may not be saved'
            });
        }

    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Registration error:', err);
        return res.status(500).json({
            error: 'Registration service unavailable',
            details: 'Please try again later or contact support'
        });
    }
});

app.post('/user-chats', async (req: Request, res: Response): Promise<any> => {
    const { message, userId } = req.body;

    if (!message || !userId) {
        return res.status(400).json({ error: 'Message and user ID are required' });
    }

    try {
        const userResponse = await queryUsersWithRetry({ id: userId });
        if (!userResponse.users.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user_exist = await db
            .select()
            .from(users)
            .where(eq(users.userId, userId));
        if (!user_exist.length) {
            return res.status(404).json({ error: `User ${userId} not found. Please register first.` });
        }

        const chatHistory = await db
            .select()
            .from(chats)
            .where(eq(chats.userId, userId))
            .orderBy(chats.createdAt)
            .limit(5);

        const conversation = chatHistory.flatMap(chat => [
            { role: "user", parts: [{ text: chat.message }] },
            { role: "model", parts: [{ text: chat.reply }] }
        ]);

        conversation.push({ role: "user", parts: [{ text: message }] });

        const result = await model.generateContent({
            contents: conversation,
            generationConfig: {
                maxOutputTokens: 2000,
                temperature: 0.9,
                topP: 0.1,
            }
        });

        const response = await result.response.text();
        console.log("\nmessage : ", message);
        console.log("\nreply : ", response);

        await db.insert(chats).values({ userId, message, reply: response });

        const botUserId = 'gemini_bot';
        const botUserResponse = await queryUsersWithRetry({ id: botUserId });

        if (!botUserResponse.users.length) {
            await chatClient.upsertUser({
                id: botUserId,
                name: 'Gemini Bot',
                role: 'user',
            });
        }

        const channel = chatClient.channel('messaging', `chat-${userId}`, {
            name: 'Gemini Chat',
            created_by_id: botUserId,
        });

        await channel.create();
        await channel.sendMessage({ text: response, user_id: botUserId });

        return res.status(200).json({
            response,
            message: 'Message processed successfully'
        });

    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Chat error:', err);
        return res.status(500).json({
            error: 'Failed to process message',
            details: err.message
        });
    }
});


app.post('/chat-history', async (req: Request, res: Response): Promise<any> => {

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'Please provide a user ID.' });
    }

    try {
        const chatHistory = await db
            .select()
            .from(chats)
            .where(eq(chats.userId, userId));

        res.status(200).json({ messages: chatHistory });

    } catch (error) {
        console.log('Failed to fetch chat history:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\nServer running on ${PORT}`));