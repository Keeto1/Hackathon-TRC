import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Campus AI Buddy, a compassionate mental health support companion. Your role is to:

1. Listen empathetically and validate the user's feelings
2. Ask thoughtful questions to help them explore their emotions
3. Provide supportive suggestions and coping strategies
4. Encourage professional help when needed
5. Never pretend to be a licensed therapist
6. Take crisis situations seriously and provide crisis resources
7. Maintain a warm, supportive, and non-judgmental tone

When you respond, keep your reply concise and under 100 words whenever possible.

Remember: You are here to support, listen, and encourage professional help when needed. Always prioritize user safety.`;

function truncateWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

const DEFAULT_MODEL = 'openrouter/auto';
const DEFAULT_MAX_TOKENS = 2048;
const DEFAULT_MAX_MESSAGES = 25;
const DEFAULT_MAX_WORDS = 100;

function safeNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENROUTER_API_KEY');
    return NextResponse.json(
      { error: 'AI service unavailable. Please check API configuration.' },
      { status: 500 }
    );
  }

  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const maxTokens = Math.min(safeNumber(process.env.OPENROUTER_MAX_TOKENS, DEFAULT_MAX_TOKENS), 4096);
  const maxMessages = Math.min(safeNumber(process.env.OPENROUTER_MAX_MESSAGES, DEFAULT_MAX_MESSAGES), 40);
  const maxWords = Math.min(safeNumber(process.env.OPENROUTER_MAX_WORDS, DEFAULT_MAX_WORDS), 500);
  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const rawMessages = body.messages as any[];
    const filtered = rawMessages
      .filter(
        (m) =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0
      )
      .slice(-maxMessages)
      .map((m) => ({ role: m.role, content: m.content.trim() }));

    if (filtered.length === 0) {
      return NextResponse.json({ error: 'No valid messages provided.' }, { status: 400 });
    }

    const maxRetries = 2;
    let lastError: { status: number; error?: any } | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...filtered],
          temperature: 0.7,
          max_tokens: maxTokens,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        const content = data?.choices?.[0]?.message?.content;
        if (!content) {
          console.error('OpenRouter returned unexpected response:', data);
          return NextResponse.json(
            { error: 'OpenRouter API returned an unexpected response.' },
            { status: 500 }
          );
        }

        const truncated = truncateWords(content, maxWords);
        return NextResponse.json({ content: truncated });
      }

      lastError = { status: response.status, error: data?.error || data };

      // Retry on rate limiting or transient server errors
      if (response.status === 429 || response.status === 503) {
        const delayMs = 500 * (attempt + 1) + Math.round(Math.random() * 250);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
    }

    return NextResponse.json(
      {
        error:
          lastError?.status === 429
            ? 'OpenRouter rate limit reached. Please wait a moment and try again.'
            : 'OpenRouter API error. Please try again later.',
      },
      { status: lastError?.status ?? 500 }
    );
  } catch (error) {
    console.error('AI API route error', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
