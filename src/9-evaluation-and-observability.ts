import { OpenAI } from 'openai';
import {
  costCounter,
  latencyHistogram,
  tokenGauge,
  verdictCounter,
} from './tools/prometheus-server.js';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ObsMetrics = {
  query: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUSD: number;
  verdict: string;
};

type TestCase = {
  query: string;
  references: string[];
};

const goldenDataset: TestCase[] = [
  {
    query: 'What does the divide function do?',
    references: [
      'It divides two numbers and throws an error if denominator is zero.',
      'Performs division and prevents divide by zero.',
    ],
  },
  {
    query: 'What does the add function do?',
    references: ['It adds two numbers.', 'Returns the sum of a and b.'],
  },
  {
    query: 'What does the multiply function do?',
    references: [
      'It multiplies two numbers.',
      'Returns the product of a and b.',
    ],
  },
];

function estimateCost(model: string, tokens: number): number {
  // Rough price mapping (as of 2025 — update for real use)
  const pricePer1K = model.includes('mini') ? 0.00015 : 0.0005;
  return (tokens / 1000) * pricePer1K;
}

async function systemUnderTest(
  query: string
): Promise<{ answer: string; tokens: number }> {
  const context = `
    function add(a, b) { return a + b; }
    function multiply(a, b) { return a * b; }
    function divide(a, b) { if (b === 0) throw Error("Divide by zero"); return a / b; }
  `;

  const start = Date.now();

  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Use context only.',
      },
      { role: 'user', content: `Context: ${context}\n\nQuestion: ${query}` },
    ],
  });

  const latency = Date.now() - start;
  console.log(`⏱️ System latency: ${latency}ms`);

  return {
    answer: response.choices[0].message.content || '',
    tokens: response.usage?.total_tokens || 0,
  };
}

async function judgeAnswer(
  query: string,
  answer: string,
  references: string[]
): Promise<{ verdict: string; tokens: number }> {
  const evalPrompt = `
  Question: ${query}
  System Answer: ${answer}
  Reference Answers: ${references.join('\n')}

  Rules:
  - PASS if answer semantically matches at least one reference.
  - FAIL if answer is incorrect or hallucinates.
  - Provide explanation.
  `;

  const start = Date.now();
  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'system', content: evalPrompt }],
  });

  const latency = Date.now() - start;

  console.log(`⏱️ Judge latency: ${latency}ms`);

  return {
    verdict: response.choices[0].message.content || '',
    tokens: response.usage?.total_tokens || 0,
  };
}

async function runBatchEvaluation(dataset: TestCase[]) {
  const results: ObsMetrics[] = [];

  for (const test of dataset) {
    console.log(`\n📝 Query: ${test.query}`);

    // System run
    const start = Date.now();
    const { answer, tokens: sysTokens } = await systemUnderTest(test.query);

    console.log('🤖 System Answer:', answer);

    // Judge run
    const { verdict, tokens: judgeTokens } = await judgeAnswer(
      test.query,
      answer,
      test.references
    );
    console.log('🔍 Verdict:', verdict);
    const latencyMs = Date.now() - start;

    const totalTokens = sysTokens + judgeTokens;
    const cost = estimateCost('gpt-4.1-mini', totalTokens);

    results.push({
      query: test.query,
      latencyMs,
      inputTokens: sysTokens,
      outputTokens: judgeTokens,
      totalTokens,
      estimatedCostUSD: cost,
      verdict,
    });

    latencyHistogram.labels(test.query).observe(latencyMs);
    tokenGauge.labels(test.query).set(totalTokens);
    costCounter.labels(test.query).inc(cost);
    verdictCounter
      .labels(test.query, verdict.startsWith('PASS') ? 'pass' : 'fail')
      .inc();
  }

  return results;
}

export const runBatchEvaluationAndObservability = async () => {
  const batchResults = await runBatchEvaluation(goldenDataset);
  console.log(
    '\n📊 Observability Report:',
    JSON.stringify(batchResults, null, 2)
  );
};
