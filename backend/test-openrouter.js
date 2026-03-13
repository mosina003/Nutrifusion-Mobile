require('dotenv').config();
const fetch = require('node-fetch');

const apikey= process.env.OPENROUTER_API_KEY;

if (!apikey) {
  console.error('❌ OPENROUTER_API_KEY not found in environment!');
  process.exit(1);
}

const prompt = 'Say hello!';

async function testOpenRouter() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    if (response.ok && data.choices && data.choices[0] && data.choices[0].message) {
      console.log('✅ OpenRouter response:', data.choices[0].message.content);
    } else {
      console.error('❌ OpenRouter error:', data);
    }
  } catch (error) {
    console.error('❌ OpenRouter request failed:', error);
  }
}

testOpenRouter();
