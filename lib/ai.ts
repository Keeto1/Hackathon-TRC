import { Message } from './types';



export interface AIResponse {
  content?: string;
  error?: string;
}

/**
 * Send a message to the server-side AI proxy route.
 * @param messages - The full conversation history (including the latest user message)
 */
export async function getAIResponse(messages: Message[]): Promise<AIResponse> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn('AI API error:', response.status, error);
      return { error: 'AI service unavailable. Please try again later.' };
    }

    const data = await response.json();
    if (data.error) {
      return { error: data.error };
    }

    if (!data.content) {
      return { error: 'AI returned an unexpected response.' };
    }

    return { content: data.content };
  } catch (error) {
    console.warn('AI Service Error:', error);
    return { error: 'AI service unavailable. Please try again later.' };
  }
}
