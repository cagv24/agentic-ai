import { END, START, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({ modelName: 'gpt-4o-mini' });

// Define the state interface
interface GraphState {
  code: string;
  summary?: string;
  bugs?: string;
  finalResult?: string;
}

export const langchainGraph = async () => {
  // Define nodes that work with state objects
  async function summarizerNode(
    state: GraphState
  ): Promise<Partial<GraphState>> {
    const response = await model.invoke(`Summarize this code:\n${state.code}`);
    return { summary: response.content as string };
  }

  async function bugCheckerNode(
    state: GraphState
  ): Promise<Partial<GraphState>> {
    const response = await model.invoke(
      `Find possible bugs in this code:\n${state.code}`
    );
    return { bugs: response.content as string };
  }

  async function evaluatorNode(
    state: GraphState
  ): Promise<Partial<GraphState>> {
    const response = await model.invoke(
      `Combine:\nSummary: ${state.summary}\nBugs: ${state.bugs}\nReturn a final explanation.`
    );
    return { finalResult: response.content as string };
  }

  // Build and compile the graph
  const workflow = new StateGraph<GraphState>({
    channels: {
      code: null,
      summary: null,
      bugs: null,
      finalResult: null,
    },
  })
    .addNode('summarizer', summarizerNode)
    .addNode('bugChecker', bugCheckerNode)
    .addNode('evaluator', evaluatorNode)
    .addEdge(START, 'summarizer')
    .addEdge(START, 'bugChecker')
    .addEdge('summarizer', 'evaluator')
    .addEdge('bugChecker', 'evaluator')
    .addEdge('evaluator', END);

  const graph = workflow.compile();

  // Execute the graph
  const code = `function add(a, b) { return a + b }`;
  const result = await graph.invoke({ code });

  console.log('✅ Code Analysis Complete:');
  console.log('📝 Summary:', result.summary);
  console.log('🐛 Potential Bugs:', result.bugs);
  console.log('📊 Final Analysis:', result.finalResult);

  return result;
};
