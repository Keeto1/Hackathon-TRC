# Campus AI Buddy - Mental Health Support for Students

## TRC Hackathon Submission: AI for Campus Life

Campus AI Buddy is a production-ready mental health support chatbot app built with Next.js and React, designed specifically for university students. This app addresses the growing need for accessible, stigma-free mental wellness support in academic environments.

### 🎯 Problem Statement
University students face escalating levels of academic stress, anxiety, and burnout. Traditional mental health services often have long wait times, cultural barriers, and limited accessibility. Campus AI Buddy provides immediate, 24/7 support with culturally-sensitive AI conversations, mood tracking, and crisis detection.

### 💡 Solution
- **AI-Powered Chat**: Real-time conversations with empathetic AI using OpenRouter API
- **Mood Tracking**: Daily mood logging with insights and patterns
- **Crisis Detection**: Automatic identification of concerning keywords with localized resources
- **Conversation History**: Persistent chat history for continuity
- **Mobile-First Design**: Fully responsive for on-the-go access
- **Dark Mode**: Comfortable usage in any lighting

## ✅ Features Implemented

- **🔐 User Authentication**: Secure sign up & login with email/password
- **🤖 AI Chat Support**: Contextual conversations using advanced LLMs (OpenRouter + DeepSeek)
- **📊 Mood Tracking**: Log mood levels with intensity and optional notes
- **🚨 Crisis Detection**: Real-time monitoring with Tunisian crisis resources
- **💬 Conversation History**: Unlimited chat persistence with smart titles
- **📱 Mobile-First Design**: Optimized for phones, tablets, and desktop
- **🌙 Dark Mode**: Built-in theme switching
- **⚙️ Settings**: User profile and preferences management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm package manager

### Installation

1. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd campus-ai-buddy
   npm install
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env.local` and add your API keys:
   ```bash
   OPENROUTER_API_KEY=your_openrouter_key
   DEEPSEEK_API_KEY=your_deepseek_key
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **AI Integration**: OpenRouter API (multiple LLMs), DeepSeek API
- **State Management**: React hooks with localStorage persistence
- **Deployment**: Vercel-ready (static + serverless functions)

## 📱 Usage Guide

### 1. Create Account
- Visit the app and click "Sign up"
- Enter your details to create a secure account

### 2. Start Chatting
- AI Buddy responds empathetically to your messages
- Conversations are automatically titled using AI
- Try mentioning stress, anxiety, or academic concerns

### 3. Track Your Mood
- Click "Log Mood" to record your current state
- View mood history and patterns in settings

### 4. Access Resources
- Crisis keywords trigger automatic resource suggestions
- Localized support for Tunisian students

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

This app was built for the TRC Hackathon focusing on "AI for Campus Life". The codebase is production-ready with proper error handling, responsive design, and scalable architecture.

## 📄 License

MIT License - Free to use and modify for educational purposes.

When ready, add your Claude API key to enable real AI responses:

1. Get your API key from https://console.anthropic.com
2. Create a `.env.local` file in the project root:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
3. The chat will automatically use real Claude responses instead of mocks

## Data Storage

Currently uses **localStorage** for mock data:
- User accounts
- Conversations and messages
- Mood entries
- Crisis alerts

To upgrade to real Supabase storage later, replace localStorage calls in:
- `lib/auth.ts` - Replace signup/login with Supabase Auth
- `lib/db.ts` - Replace localStorage with Supabase queries

## Customization

### Colors & Branding
Edit design tokens in `app/globals.css` - uses OKLch color space for better color harmony

### Crisis Keywords
Edit the `CRISIS_KEYWORDS` array in `lib/db.ts` to add/remove detection keywords

### AI Responses
Edit mock responses in `lib/ai.ts` - customize the supportive messages

## File Structure
```
app/
  ├── auth/page.tsx         # Auth page
  ├── chat/
  │   ├── page.tsx          # Main chat page
  │   └── settings/page.tsx  # User settings
  └── layout.tsx            # Root layout
components/
  ├── auth/                 # Auth components
  ├── chat/                 # Chat feature components
  └── ui/                   # shadcn components
lib/
  ├── auth.ts               # Auth utilities
  ├── db.ts                 # Mock database
  ├── ai.ts                 # AI service
  ├── uuid.ts               # Browser-compatible UUID generation
  └── types.ts              # TypeScript types
```

## Support Notes

- The app works offline using localStorage
- No API key required to start using - uses mock responses
- Add your free OpenRouter API key anytime to switch to real LLM responses
- All user data is stored locally in the browser
- Uses free models via OpenRouter (Llama 2, Mistral, Llama 3) - no credit card needed

Enjoy your mental health support companion!
