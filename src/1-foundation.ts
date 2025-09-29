import OpenAI from 'openai';
import * as readline from 'readline';

const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ExperimentResult {
  temp: number;
  topP: number;
  run: number;
  response: string;
}

async function experiment(
  temp: number,
  topP: number,
  run: number
): Promise<ExperimentResult> {
  const response = await openAIClient.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: temp,
    top_p: topP,
    messages: [
      { role: 'system', content: 'You are a creative storyteller.' },
      {
        role: 'user',
        content: 'Write a one-sentence story about a robot who finds a flower.',
      },
    ],
  });

  return {
    temp,
    topP,
    run,
    response: response.choices[0].message.content || 'No response',
  };
}

function printResultsTable(results: ExperimentResult[]) {
  console.log('\n📊 EXPERIMENT RESULTS TABLE');
  console.log('='.repeat(120));
  console.log('| Temp | Top_P | Run | Response');
  console.log('-'.repeat(120));

  results.forEach(result => {
    const tempStr = result.temp.toFixed(1).padEnd(4);
    const topPStr = result.topP.toFixed(1).padEnd(5);
    const runStr = result.run.toString().padEnd(3);
    const response = result.response;

    console.log(`| ${tempStr} | ${topPStr} | ${runStr} | ${response}`);
  });

  console.log('-'.repeat(120));
}

function analyzeVariability(results: ExperimentResult[]) {
  console.log('\n🔍 VARIABILITY ANALYSIS');
  console.log('='.repeat(60));

  const groups = results.reduce(
    (acc, result) => {
      const key = `${result.temp}-${result.topP}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result.response);
      return acc;
    },
    {} as Record<string, string[]>
  );

  Object.entries(groups).forEach(([key, responses]) => {
    const [temp, topP] = key.split('-');
    console.log(`\n📈 Temp=${temp}, Top_P=${topP}:`);

    // Check if all responses are identical
    const unique = [...new Set(responses)];
    const variability =
      unique.length === 1
        ? 'IDENTICAL'
        : unique.length === responses.length
          ? 'ALL DIFFERENT'
          : 'SOME VARIATION';

    console.log(
      `   Variability: ${variability} (${unique.length}/${responses.length} unique)`
    );

    responses.forEach((response, idx) => {
      console.log(`   Run ${idx + 1}: ${response}`);
    });
  });
}

function getUserInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function selectExperiment() {
  console.log('🔬 Available Experiments:');
  console.log('1. Deterministic (temp=0.0, top_p=1.0)');
  console.log('2. Creative (temp=1.0, top_p=1.0)');
  console.log('3. Narrowed Pool (temp=1.0, top_p=0.3)');
  console.log('4. Balanced (temp=0.7, top_p=0.7)');
  console.log('');

  const choice = await getUserInput('Select experiment to run (1-4): ');

  const deterministic = { temp: 0.0, topP: 1.0, label: 'deterministic' };
  const creative = { temp: 1.0, topP: 1.0, label: 'creative' };
  const narrowedPool = { temp: 1.0, topP: 0.3, label: 'narrowed pool' };
  const balanced = { temp: 0.7, topP: 0.7, label: 'balanced' };

  const experiments = [deterministic, creative, narrowedPool, balanced];

  const selectedIndex = parseInt(choice.trim());

  if (selectedIndex >= 1 && selectedIndex <= 4) {
    return experiments[selectedIndex - 1];
  }

  console.log(
    '❌ Invalid selection. Please run the program again and choose 1-4.'
  );
  process.exit(1);
}

export async function foundationExperiment() {
  console.log('🚀 Starting Temperature & Top_P Experiments...\n');

  const selectedExperiment = await selectExperiment();

  console.log(`\n✅ Selected experiment:`);
  console.log(
    `   ${selectedExperiment.label} (temp=${selectedExperiment.temp}, top_p=${selectedExperiment.topP})`
  );

  const confirm = await getUserInput('\nProceed with experiment? (y/n): ');
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('❌ Experiment cancelled.');
    return;
  }

  console.log('\n🚀 Starting experiment...\n');

  const results: ExperimentResult[] = [];
  const exp = selectedExperiment;

  console.log(`Running ${exp.label} (temp=${exp.temp}, top_p=${exp.topP})...`);

  for (let run = 1; run <= 3; run++) {
    try {
      const result = await experiment(exp.temp, exp.topP, run);
      results.push(result);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error in run ${run}:`, error);
    }
  }

  // Display results
  printResultsTable(results);
  analyzeVariability(results);

  console.log('\n✅ Experiment completed!');
}
