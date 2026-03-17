# Campus AI Buddy - Setup Guide

Campus AI Buddy is a mental health support chatbot app built with Next.js and React, designed specifically for **Tunisian university students**. This guide will help you set up and deploy the application.

## About Campus AI Buddy

**Problem:** Tunisian university students face escalating levels of academic stress, anxiety, and burnout, yet campuses lack accessible, stigma-free mental health support. Cultural barriers and the absence of on-campus counseling services leave students without timely help.

**Solution:** Campus AI Buddy provides immediate, culturally-sensitive mental wellness support 24/7, with multi-language support (English, French, Arabic) and localized crisis resources.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to http://localhost:3000

## Features

✅ **User Authentication** - Sign up and login with email/password
✅ **AI Chat Support** - Talk to Campus AI Buddy for mental wellness support
✅ **Mood Tracking** - Log your mood with intensity levels and notes
✅ **Crisis Detection** - Automatic detection of concerning keywords with resources
✅ **Conversation History** - All conversations saved for continuity
✅ **Mobile First Design** - Fully responsive on mobile, tablet, and desktop
✅ **Dark Mode** - Built-in theme switching

## Configuration

### Required: API Keys Setup

The app uses real AI integration via OpenRouter and DeepSeek. You must configure API keys:

1. **OpenRouter API Key** (for AI chat responses):
   - Sign up at https://openrouter.ai
   - Get your free API key
   - Add to `.env.local`:
   ```
   OPENROUTER_API_KEY=your_key_here
   ```

2. **DeepSeek API Key** (for conversation titles):
   - Get API key from DeepSeek
   - Add to `.env.local`:
   ```
   DEEPSEEK_API_KEY=your_key_here
   ```

### Optional Configuration
```
OPENROUTER_MODEL=openrouter/auto  # Default auto-routing
OPENROUTER_MAX_TOKENS=2048        # Response length limit
OPENROUTER_MAX_MESSAGES=25        # Context window
OPENROUTER_MAX_WORDS=100          # Word limit per response
```

> **Note**: Without API keys, the app will show error messages instead of AI responses.

## Project Structure

```
campus-ai-buddy/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirects to auth or chat)
│   ├── auth/
│   │   └── page.tsx             # Authentication page
│   └── chat/
│       ├── page.tsx             # Main chat interface
│       └── settings/
│           └── page.tsx         # User settings page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── auth/
│   │   ├── LoginForm.tsx        # Login form component
│   │   └── SignupForm.tsx       # Sign up form component
│   └── chat/
│       ├── ChatInterface.tsx    # Main chat UI
│       ├── MessageBubble.tsx    # Individual message component
│       ├── ConversationSidebar.tsx  # Sidebar for conversations
│       ├── MoodTracker.tsx      # Mood logging modal
│       ├── MoodHistory.tsx      # Mood history display
│       └── CrisisAlert.tsx      # Crisis warning modal
├── lib/
│   ├── auth.ts                  # Authentication utilities
│   ├── db.ts                    # Database/storage utilities
│   ├── types.ts                 # TypeScript type definitions
│   ├── ai.ts                    # AI integration service
│   └── utils.ts                 # Utility functions
└── public/                       # Static assets
```

## Data Storage

Currently, the app uses localStorage for data persistence (mock database). This is perfect for testing and development.

### To integrate with real database (Supabase/Neon):

1. **Set up your database:**
   - Create a Supabase or Neon account
   - Create necessary tables as defined in the schema

2. **Update storage layer:**
   - Modify `lib/db.ts` to use database queries instead of localStorage
   - Replace authentication with real Supabase Auth or custom auth

3. **Add environment variables:**
   ```
   DATABASE_URL=your_database_url
   DATABASE_API_KEY=your_api_key
   ```

## Crisis Resources

**Campus AI Buddy is designed for Tunisian university students.** If you or someone you know is struggling:

### Tunisia Emergency Services
- **SAMU (Medical Emergency):** 15 — Emergency medical and ambulance services
- **Police Emergency:** 197 — Contact police for emergency situations
- **General Emergency:** 911

### Mental Health Support (Tunisia)
- **Tunisia Mental Health Association:** https://www.unison.org.tn/ — Mental health resources and support services

### International Resources
- **International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/ — Worldwide crisis resources directory
- **Befrienders:** https://www.befrienders.org/ — International emotional support network

### Multi-Language Support
The app is available in:
- **English (EN)**
- **French (FR)**
- **Arabic (AR)**

You can change your language preference in Settings → Language.

## Development

### Build for production:
```bash
npm run build
npm start
```

### Run tests (if added):
```bash
npm test
```

### Code formatting:
```bash
npm run format
```

## Features in Development

- [ ] Real-time notifications
- [ ] Mood analytics dashboard
- [ ] Integration with professional therapy resources
- [ ] Voice chat support
- [ ] Multi-language support
- [ ] Social features (peer support groups)

## Security Notes

⚠️ **Important:** This app is designed for support and education purposes. It should not replace professional mental health care.

- User data is currently stored in localStorage (browser storage)
- Passwords are hashed with SHA-256 (for development only - use bcrypt in production)
- When deploying to production, implement:
  - HTTPS encryption
  - Secure server-side session management
  - Database encryption
  - Rate limiting
  - Input validation and sanitization

## Support & Contributing

For issues or suggestions, please:
1. Check existing documentation
2. Review the code comments
3. Test the feature in different browsers/devices

## License

This project is open source and available for educational purposes.

## Disclaimer

Campus AI Buddy is a support tool designed to complement, not replace, professional mental health care. If you are experiencing a mental health crisis, please reach out to emergency services or a mental health professional immediately.
