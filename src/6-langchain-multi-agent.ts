import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { DynamicTool } from 'langchain/tools';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const docs = [
  { id: 1, text: 'JavaScript is dynamically typed.' },
  { id: 2, text: 'TypeScript adds type safety to JavaScript.' },
  { id: 3, text: 'Node.js allows running JS on the server.' },
  { id: 4, text: 'RAG combines embeddings and LLMs.' },
];

export const multiAgentLangchain = async () => {
  // Embedding model
  const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' });

  // Store docs in vector DB (in-memory for demo)
  const vectorStore = await MemoryVectorStore.fromTexts(
    docs.map(d => d.text),
    docs.map(d => ({ id: d.id })),
    embeddings
  );

  // Retriever tool (RAG worker)
  const retrieverTool = new DynamicTool({
    name: 'knowledge_base',
    description: 'Answer only with the information from the knowledge base.',
    func: async (query: string) => {
      const results = await vectorStore.similaritySearch(query, 2);
      return results.map(r => r.pageContent).join('\n');
    },
  });

  // Creative writer tool
  const creativeTool = new DynamicTool({
    name: 'poet',
    description: 'Writes poems, creative text, and metaphors.',
    func: async (topic: string) => {
      return `Poem about ${topic}: 
TypeScript guards the code so strong,
Keeping bugs from staying long.`;
    },
  });

  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.2,
  });

  // Create prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a helpful assistant with access to tools.'],
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ]);

  // Create agent and executor
  const agent = await createToolCallingAgent({
    llm: model,
    tools: [retrieverTool, creativeTool],
    prompt,
  });

  const executor = new AgentExecutor({
    agent,
    tools: [retrieverTool, creativeTool],
    verbose: true,
  });

  const result = await executor.invoke({
    input: 'Explain TypeScript, then write me a short poem about it.',
  });
  console.log(result);
};
