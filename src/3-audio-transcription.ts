import fs from 'fs';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const audioTranscription = async () => {
  const transcription = await client.audio.transcriptions.create({
    file: fs.createReadStream('./src/assets/speech.mp3'),
    model: 'whisper-1',
  });

  console.log(transcription.text);
};
