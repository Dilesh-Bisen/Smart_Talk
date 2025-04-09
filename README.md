# Smart Talk 💬✨

[Live Demo](https://smart-talk.vercel.app/)

Smart Talk is an AI-powered conversational application that provides intelligent chat capabilities with context awareness. Built with Vue, TypeScript, and cutting-edge AI technologies.

## Key Features

- **Context-Aware AI** 🧠 - Maintains conversation history for coherent discussions
- **Real-Time Chat** ⚡ - Stream-powered instant messaging interface
- **User Profiles** 👤 - Personalized experience with registration
- **Chat History** 📚 - Stores all conversations for future reference
- **Modern UI** 🎨 - Sleek dark theme with gradient accents

## Technology Stack

**Frontend**  
Vue 3 · TypeScript · Pinia · Tailwind CSS  

**Backend**  
Node.js · Express · TypeScript  

**AI & Services**  
Google Gemini AI · Stream Chat API  

**Database**  
PostgreSQL (Neon) · Drizzle ORM  

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- PostgreSQL database

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/smart-talk.git
   cd smart-talk
   ```

2.Install dependencies:

  ```sh
  # Frontend
  npx create-vite frontend   
  cd frontend
  npm install            
  npm i vue-router pinia pinia-plugin-persistedstate axios
  npm i -D tailwindcss @tailwindcss/vite
  ```

  ```sh
  # Backend
  mkdir backend
  cd backend 
  npm init -y
  npm install express cors dotenv stream-chat openai
  npm install -D typescript tsx @types/node @types/express @types/cors
  npx tsc --init
  ```

3. Set up environment variables:

  ```sh
  # Frontend (.env)
  VITE_API_URL=http://localhost:3000
  ```

  ```sh
  # Backend (.env)
  GEMINI_API_KEY=your_key
  STREAM_API_KEY=your_key
  STREAM_API_SECRET=your_secret
  DATABASE_URL=your_db_url
  ```

4. Run the development servers:

  ```sh
  # Backend
  cd backend
  npm run dev
  ```

  ```sh
  # Frontend (in separate terminal)
  cd frontend
  npm run dev
  ```

Usage
1. Register with your name and email
2. Start chatting with the AI assistant
3. Continue conversations - The AI remembers context
4. View history - All chats are saved in your profile

Project Structure
  ```sh
  smart-talk/
  ├── backend/         # Node.js API server
  │   ├── src/         # TypeScript source
  │   └── ...          # Config files
  ├── frontend/        # Vue 3 application
  │   ├── src/         # Components, stores, etc.
  │   └── ...          # Config files
  └── README.md        # This file
  ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any questions or issues, please open an issue on the GitHub repository or contact the project maintainer at [2dileshbisen@gmail.com].

## Acknowledgments

This project was designed and developed by Dilesh Bisen.
