import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getWeather(city: string): string {
  const data: Record<string, string> = {
    London: 'Rainy, 15°C',
    'New York': 'Sunny, 25°C',
    Tokyo: 'Cloudy, 20°C',
  };
  return data[city] || 'No weather data available';
}

// Mock currency conversion
function convertCurrency(amount: number, from: string, to: string): string {
  const rate = from === 'USD' && to === 'EUR' ? 0.92 : null;
  if (!rate) return 'Conversion not available';
  return `${amount} ${from} = ${(amount * rate).toFixed(2)} ${to}`;
}

// MCP-style shared registry
const toolRegistry = [
  {
    name: 'getWeather',
    description: 'Get the weather for a city',
    parameters: {
      type: 'object',
      properties: { city: { type: 'string' } },
      required: ['city'],
    },
  },
  {
    name: 'convertCurrency',
    description: 'Convert money between currencies',
    parameters: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        from: { type: 'string' },
        to: { type: 'string' },
      },
      required: ['amount', 'from', 'to'],
    },
  },
];

export const runMcpFromScratch = async () => {
  const messages: any[] = [
    {
      role: 'user',
      content: "What's the weather in London, and also convert 100 USD to EUR.",
    },
  ];

  let isTheAnswerReady = false;

  while (!isTheAnswerReady) {
    // Ask model with shared MCP tool registry
    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      functions: toolRegistry,
    });

    const message = response.choices[0].message;
    console.log('🤖 Model decision:', message);
    console.log('-'.repeat(50));

    if (!message.function_call) {
      isTheAnswerReady = true;
      console.log('💡 Final Answer:', message.content);
      break;
    }

    const { name, arguments: args } = message.function_call;
    let result;

    if (name === 'getWeather') {
      const { city } = JSON.parse(args as string);
      result = getWeather(city);
      console.log('🌦️ Tool Result:', result);
    }

    if (name === 'convertCurrency') {
      const { amount, from, to } = JSON.parse(args as string);
      result = convertCurrency(amount, from, to);
      console.log('💱 Tool Result:', result);
    }

    messages.push({
      role: 'function',
      name,
      content: result,
    });
  }
};
