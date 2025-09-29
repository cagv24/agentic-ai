import express from 'express';
import client from 'prom-client';

// Registry for Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics
export const latencyHistogram = new client.Histogram({
  name: 'ai_query_latency_ms',
  help: 'Latency of AI queries in milliseconds',
  buckets: [100, 300, 1000, 3000, 5000],
  labelNames: ['query'],
});

export const tokenGauge = new client.Gauge({
  name: 'ai_query_tokens',
  help: 'Tokens used per AI query',
  labelNames: ['query'],
});

export const costCounter = new client.Counter({
  name: 'ai_query_cost_usd',
  help: 'Estimated cost per query in USD',
  labelNames: ['query'],
});

export const verdictCounter = new client.Counter({
  name: 'ai_query_verdicts',
  help: 'Pass/Fail verdicts of AI queries',
  labelNames: ['query', 'verdict'],
});

// Register all metrics
register.registerMetric(latencyHistogram);
register.registerMetric(tokenGauge);
register.registerMetric(costCounter);
register.registerMetric(verdictCounter);

export const startMetricsServer = async () => {
  const app = express();

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  app.listen(3001, () => {
    console.log('🚀 Metrics server running on http://localhost:3001/metrics');
  });
};
