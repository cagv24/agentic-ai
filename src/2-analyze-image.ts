import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeImage() {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that can analyze images.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract the text from the image.',
          },
          {
            type: 'image_url',
            image_url: {
              url: 'https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2021/02/19/ML-1955-2.jpg',
            },
          },
        ],
      },
    ],
  });

  console.log('🖼️ Image Analysis Result:');
  console.log('='.repeat(50));
  console.log(response.choices[0].message.content);
  console.log('='.repeat(50));
}
