import fs from 'fs';
import OpenAI from 'openai';
import { getUserInput } from './utils/utils.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const textToSpeech = async () => {
  console.log('🎙️ Text-to-Speech Configuration\n');

  const text = await getUserInput('Enter text to convert to speech: ');
  if (!text) {
    console.log('❌ No text provided. Exiting...');
    return;
  }

  console.log('\n🔊 Available Voices:');
  console.log('1. alloy (neutral, balanced)');
  console.log('2. echo (male, clear)');
  console.log('3. fable (British, warm)');
  console.log('4. onyx (deep, authoritative)');
  console.log('5. nova (youthful, energetic)');
  console.log('6. shimmer (soft, gentle)');

  const voiceChoice = await getUserInput('\nSelect voice (1-6, default: 1): ');
  const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
  const selectedVoice = voices[parseInt(voiceChoice) - 1] || 'alloy';

  try {
    const speech = await client.audio.speech.create({
      model: 'tts-1',
      voice: selectedVoice as any,
      input: text,
    });

    // Create assets directory if it doesn't exist
    if (!fs.existsSync('./assets')) {
      fs.mkdirSync('./assets');
    }

    const filename = `./assets/speech.mp3`;
    fs.writeFileSync(filename, Buffer.from(await speech.arrayBuffer()));

    console.log(`✅ Speech generated successfully!`);
    console.log(`📁 Saved to: ${filename}`);
    console.log(`📊 Text length: ${text.length} characters`);
  } catch (error) {
    console.error('❌ Error generating speech:', error);
  }
};
