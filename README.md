# AI Experiments & Training Examples

A comprehensive collection of AI experiments and training examples built with TypeScript, OpenAI API, and LangChain. This project demonstrates various AI capabilities through hands-on experiments ranging from foundation model testing to multi-agent systems.

## 🚀 Features

This project includes 9 different AI experiments:

1. **Foundation Experiment** - Temperature & Top_P parameter testing
2. **Analyze Image** - GPT-4 Vision capabilities for image analysis
3. **Audio Transcription** - Speech-to-text conversion
4. **Text to Speech** - AI-powered voice synthesis
5. **Embeddings** - Clothing category search using vector embeddings
6. **Multi Agent Langchain** - Orchestrated AI agent workflows
7. **Langchain Graph** - Graph-based AI processing
8. **MCP from Scratch** - Model Context Protocol implementation
9. **Batch Evaluation and Observability** - Performance monitoring and metrics

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **AI Models**: OpenAI GPT-4, GPT-4 Vision, Embeddings
- **Framework**: LangChain for AI orchestration
- **Monitoring**: Prometheus & Grafana for observability
- **Development**: ESLint, Prettier, TSX for hot reloading

## 📋 Prerequisites

- Node.js (v18 or higher)
- OpenAI API Key
- Docker & Docker Compose (for monitoring stack)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/cagv24/agentic-ai.git
   cd ai-experiments
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Usage

### Interactive Menu

Run the main application to access all experiments through an interactive menu:

```bash
npm start
# or for development with hot reload:
npm run dev
```

Select from the available options (1-9) to run specific experiments.

### Individual Scripts

You can also run individual experiments by importing and calling their functions directly.

### Monitoring & Observability

For experiment #9 (Batch Evaluation and Observability), start the monitoring stack:

```bash
# Start Prometheus and Grafana
docker-compose up -d

# Access Grafana at http://localhost:3000
# Access Prometheus at http://localhost:9090
```

## 📊 Experiment Details

### 1. Foundation Experiment

Tests different temperature and top_p values to understand how these parameters affect model creativity and consistency. Generates creative stories about robots and flowers with various parameter combinations.

### 2. Analyze Image

Demonstrates GPT-4 Vision capabilities by analyzing images and extracting text or describing visual content.

### 3. Audio Transcription

Converts audio files to text using OpenAI's Whisper model, supporting various audio formats.

### 4. Text to Speech

Generates natural-sounding speech from text input using OpenAI's TTS models.

### 5. Embeddings

Implements semantic search over clothing categories using text embeddings. Allows searching through clothing items using natural language queries.

### 6. Multi Agent Langchain

Showcases multi-agent systems where different AI agents collaborate to solve complex tasks.

### 7. Langchain Graph

Demonstrates graph-based AI workflows using LangChain's graph capabilities.

### 8. MCP from Scratch

A from-scratch implementation of Model Context Protocol for advanced AI interactions.

### 9. Evaluation and Observability

Comprehensive monitoring system using Prometheus metrics and Grafana dashboards to track AI model performance and system health.

## 🔍 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Project Structure

```
src/
├── 1-foundation.ts           # Foundation model experiments
├── 2-analyze-image.ts        # Image analysis with GPT-4V
├── 3-audio-transcription.ts  # Audio to text conversion
├── 4-text-to-speech.ts      # Text to speech synthesis
├── 5-embeddings.ts           # Vector embeddings & search
├── 6-langchain-multi-agent.ts # Multi-agent systems
├── 7-langchain-graph.ts      # Graph-based AI workflows
├── 8-mcp-from-scratch.ts     # Model Context Protocol
├── 9-evaluation-and-observability.ts # Monitoring & metrics
├── index.ts                  # Main application entry
├── assets/                   # Static assets (audio, embeddings)
├── tools/                    # Utility tools (Prometheus server)
└── utils/                    # Helper utilities
```

## 🐳 Docker Support

The project includes Docker Compose configuration for the monitoring stack:

- **Prometheus**: Metrics collection at `localhost:9090`
- **Grafana**: Visualization dashboards at `localhost:3000`

## 📝 Configuration

### TypeScript Configuration

The project uses modern TypeScript with ES2022 features and Node.js module resolution.

### Monitoring Configuration

Prometheus is configured to scrape metrics from the application running on port 3001. Custom metrics can be added through the Prometheus client.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing code style
4. Run tests and linting
5. Submit a pull request

## 📄 License

ISC License

## 👤 Author

**Camilo Gutierrez**

## 🎯 Learning Objectives

This project serves as a comprehensive learning resource for:

- Understanding AI model parameters and their effects
- Working with multimodal AI (text, image, audio)
- Implementing vector embeddings and semantic search
- Building multi-agent AI systems
- Monitoring and observability in AI applications
- Modern TypeScript development practices

## 🔗 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [LangChain Documentation](https://langchain.readthedocs.io/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

---

_This project demonstrates practical AI implementation patterns and serves as a foundation for building more complex AI-powered applications._
