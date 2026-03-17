const OPENROUTER_API_KEY = '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';
const DEEPSEEK_API_KEY = 'sk-b31e54ad38b84aef9f25fac4af45e832';

async function testOpenRouter() {
  console.log('Testing OpenRouter API...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ OpenRouter: SUCCESS');
      console.log('Response:', data.choices?.[0]?.message?.content);
    } else {
      const error = await response.text();
      console.log('❌ OpenRouter: FAILED');
      console.log('Status:', response.status);
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('❌ OpenRouter: ERROR');
    console.log(error.message);
  }
}

async function testDeepSeek() {
  console.log('\nTesting DeepSeek API...');
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Create a title for: I feel stressed about exams' }],
        max_tokens: 10,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ DeepSeek: SUCCESS');
      console.log('Response:', data.choices?.[0]?.message?.content);
    } else {
      const error = await response.text();
      console.log('❌ DeepSeek: FAILED');
      console.log('Status:', response.status);
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('❌ DeepSeek: ERROR');
    console.log(error.message);
  }
}

async function main() {
  await testOpenRouter();
  await testDeepSeek();
}

main();