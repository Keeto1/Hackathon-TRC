import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function GET() {
  return NextResponse.json(
    { error: 'Deepseek endpoint requires a POST request with a JSON body containing { prompt }.' },
    { status: 405 }
  );
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing DEEPSEEK_API_KEY environment variable.' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt in request body.' }, { status: 400 });
  }

  const endpoint = process.env.DEEPSEEK_API_URL || DEFAULT_DEEPSEEK_URL;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `Create a concise chat title (5-8 words) describing this user problem: "${prompt}"`,
          },
        ],
        max_tokens: 20,
        temperature: 0.5,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json({ error: data?.error || 'Deepseek API error' }, { status: response.status });
    }

    const title = typeof data?.choices?.[0]?.message?.content === 'string' ? data.choices[0].message.content.trim() : '';
    if (!title) {
      return NextResponse.json({ error: 'Deepseek returned an unexpected response.' }, { status: 500 });
    }

    return NextResponse.json({ title });
  } catch (error) {
    console.error('Deepseek API route error', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
