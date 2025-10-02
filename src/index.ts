import { foundationExperiment } from './1-foundation.js';
import { analyzeImage } from './2-analyze-image.js';
import { audioTranscription } from './3-audio-transcription.js';
import { textToSpeech } from './4-text-to-speech.js';
import { embeddings } from './5-embeddings.js';
import { multiAgentLangchain } from './6-langchain-multi-agent.js';
import { langchainGraph } from './7-langchain-graph.js';
import { runMcpFromScratch } from './8-mcp-from-scratch.js';
import { runBatchEvaluationAndObservability } from './9-evaluation-and-observability.js';
import { startMetricsServer } from './tools/prometheus-server.js';
import { getUserInput } from './utils/utils.js';

async function selectFunction() {
  console.log('🚀 Available AI Functions:');
  console.log('1. Foundation Experiment (Temperature & Top_P testing)');
  console.log('2. Analyze Image (GPT-4 Vision)');
  console.log('3. Audio Transcription');
  console.log('4. Text to Speech');
  console.log('5. Embeddings (Clothing Category Search)');
  console.log('6. Multi Agent Langchain');
  console.log('7. Langchain Graph');
  console.log('8. MCP from Scratch');
  console.log('9. Batch Evaluation and Observability');
  console.log('');

  const choice = await getUserInput('Select function to run (1-9): ');

  const selectedIndex = parseInt(choice.trim());

  if (selectedIndex === 1) {
    return { name: 'Foundation Experiment', func: foundationExperiment };
  } else if (selectedIndex === 2) {
    return { name: 'Analyze Image', func: analyzeImage };
  } else if (selectedIndex === 3) {
    return { name: 'Audio Transcription', func: audioTranscription };
  } else if (selectedIndex === 4) {
    return { name: 'Text to Speech', func: textToSpeech };
  } else if (selectedIndex === 5) {
    return { name: 'Embeddings', func: embeddings };
  } else if (selectedIndex === 6) {
    return { name: 'Multi Agent Langchain', func: multiAgentLangchain };
  } else if (selectedIndex === 7) {
    return { name: 'Langchain Graph', func: langchainGraph };
  } else if (selectedIndex === 8) {
    return { name: 'MCP from Scratch', func: runMcpFromScratch };
  } else if (selectedIndex === 9) {
    await startMetricsServer();
    return {
      name: 'Batch Evaluation and Observability',
      func: runBatchEvaluationAndObservability,
    };
  } else {
    console.log(
      '❌ Invalid selection. Please run the program again and choose 1-9.'
    );
    process.exit(1);
  }
}

const main = async () => {
  try {
    console.log('🤖 AI Experiments Menu\n');

    const selectedFunction = await selectFunction();

    console.log(`\n✅ Selected: ${selectedFunction.name}`);

    const confirm = await getUserInput('\nProceed? (y/n): ');
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }

    console.log(`\n🚀 Starting ${selectedFunction.name}...\n`);
    console.log('Test function...');
    await selectedFunction.func();
  } catch (error) {
    console.error('Error in main:', error);
  }
};

main();
