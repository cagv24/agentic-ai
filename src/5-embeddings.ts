import fsSync from 'fs';
import fs from 'fs/promises';
import OpenAI from 'openai';
import { getUserInput } from './utils/utils.js';

// Configuration constants
const CONFIG = {
  EMBEDDING_MODEL: 'text-embedding-3-small' as const,
  EMBEDDINGS_FILE: './assets/clothing-embeddings.json',
  ASSETS_DIR: './assets',
  TOP_RESULTS_COUNT: 5,
} as const;

const CLOTHING_CATEGORIES = [
  'beachwear',
  'formal wear',
  'casual wear',
  'shoes',
] as const;

// Types
interface SimilarityResult {
  category: string;
  similarity: number;
}

interface EmbeddingsData {
  [category: string]: number[];
}

// Initialize OpenAI client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Calculate cosine similarity between two vectors
 */
function calculateCosineSimilarity(
  vectorA: number[],
  vectorB: number[]
): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }

  const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(
    vectorA.reduce((sum, val) => sum + val * val, 0)
  );
  const magnitudeB = Math.sqrt(
    vectorB.reduce((sum, val) => sum + val * val, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Ensure assets directory exists
 */
async function ensureAssetsDirectory(): Promise<void> {
  try {
    await fs.mkdir(CONFIG.ASSETS_DIR, { recursive: true });
  } catch (error) {
    console.error(`Failed to create ${CONFIG.ASSETS_DIR} directory:`, error);
    throw error;
  }
}

/**
 * Load existing embeddings from file
 */
async function loadExistingEmbeddings(): Promise<Map<string, number[]> | null> {
  try {
    if (!fsSync.existsSync(CONFIG.EMBEDDINGS_FILE)) {
      return null;
    }

    console.log('📁 Loading existing embeddings from file...');
    const fileContent = await fs.readFile(CONFIG.EMBEDDINGS_FILE, 'utf8');
    const embeddingsData: EmbeddingsData = JSON.parse(fileContent);

    const embeddingsMap = new Map<string, number[]>();
    for (const [category, embedding] of Object.entries(embeddingsData)) {
      if (
        Array.isArray(embedding) &&
        embedding.every(val => typeof val === 'number')
      ) {
        embeddingsMap.set(category, embedding);
      }
    }

    console.log(`✅ Loaded ${embeddingsMap.size} existing embeddings`);
    return embeddingsMap;
  } catch (error) {
    console.error('Failed to load existing embeddings:', error);
    return null;
  }
}

/**
 * Generate embeddings for all categories
 */
async function generateCategoryEmbeddings(): Promise<Map<string, number[]>> {
  console.log('\n🔄 Generating embeddings for each category...');
  const embeddingsMap = new Map<string, number[]>();

  for (const category of CLOTHING_CATEGORIES) {
    try {
      const response = await client.embeddings.create({
        model: CONFIG.EMBEDDING_MODEL,
        input: category,
      });

      const embedding = response.data[0]?.embedding;
      if (!embedding) {
        throw new Error(`No embedding returned for category: ${category}`);
      }

      embeddingsMap.set(category, embedding);
      console.log(`✅ Generated embedding for: ${category}`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to generate embedding for ${category}:`, error);
      throw error;
    }
  }

  return embeddingsMap;
}

/**
 * Save embeddings to file
 */
async function saveEmbeddings(
  embeddingsMap: Map<string, number[]>
): Promise<void> {
  try {
    console.log('\n💾 Saving embeddings to file...');

    const embeddingsObject: EmbeddingsData = {};
    for (const [category, embedding] of embeddingsMap) {
      embeddingsObject[category] = embedding;
    }

    await ensureAssetsDirectory();
    await fs.writeFile(
      CONFIG.EMBEDDINGS_FILE,
      JSON.stringify(embeddingsObject, null, 2)
    );

    console.log(`✅ Embeddings saved to: ${CONFIG.EMBEDDINGS_FILE}`);
  } catch (error) {
    console.error('Failed to save embeddings:', error);
    throw error;
  }
}

/**
 * Get or create category embeddings
 */
async function getOrCreateEmbeddings(): Promise<Map<string, number[]>> {
  const existingEmbeddings = await loadExistingEmbeddings();

  if (
    existingEmbeddings &&
    existingEmbeddings.size === CLOTHING_CATEGORIES.length
  ) {
    return existingEmbeddings;
  }

  const newEmbeddings = await generateCategoryEmbeddings();
  await saveEmbeddings(newEmbeddings);
  return newEmbeddings;
}

/**
 * Generate embedding for user input
 */
async function generateUserEmbedding(userInput: string): Promise<number[]> {
  try {
    console.log(`\n🔍 Analyzing "${userInput}"...`);
    const response = await client.embeddings.create({
      model: CONFIG.EMBEDDING_MODEL,
      input: userInput,
    });

    const embedding = response.data[0]?.embedding;
    if (!embedding) {
      throw new Error('No embedding returned for user input');
    }

    return embedding;
  } catch (error) {
    console.error('Failed to generate user embedding:', error);
    throw error;
  }
}

/**
 * Calculate similarities and find best matches
 */
function calculateSimilarities(
  userEmbedding: number[],
  categoryEmbeddings: Map<string, number[]>
): SimilarityResult[] {
  const similarities: SimilarityResult[] = [];

  for (const [category, embedding] of categoryEmbeddings) {
    try {
      const similarity = calculateCosineSimilarity(userEmbedding, embedding);
      similarities.push({ category, similarity });
    } catch (error) {
      console.error(`Failed to calculate similarity for ${category}:`, error);
    }
  }

  return similarities.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Display results in a formatted way
 */
function displayResults(
  userInput: string,
  similarities: SimilarityResult[]
): void {
  if (similarities.length === 0) {
    console.log('❌ No similarities could be calculated');
    return;
  }

  const bestMatch = similarities[0];
  console.log(`\n🎯 Best match for "${userInput}": ${bestMatch.category}`);
  console.log(
    `📊 Similarity score: ${(bestMatch.similarity * 100).toFixed(2)}%`
  );

  console.log(`\n📈 Top ${CONFIG.TOP_RESULTS_COUNT} similarity scores:`);
  similarities.slice(0, CONFIG.TOP_RESULTS_COUNT).forEach((item, index) => {
    const percentage = (item.similarity * 100).toFixed(2);
    const indicator =
      index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
    console.log(`${indicator} ${item.category}: ${percentage}%`);
  });
}

/**
 * Display available categories
 */
function displayCategories(): void {
  console.log('📝 Clothing categories to embed:');
  CLOTHING_CATEGORIES.forEach((category, index) => {
    console.log(`${index + 1}. ${category}`);
  });
  console.log('');
}

/**
 * Main embeddings function
 */
export const embeddings = async (): Promise<void> => {
  try {
    console.log('👕 Clothing Category Embeddings\n');
    displayCategories();

    // Get or create embeddings
    const categoryEmbeddings = await getOrCreateEmbeddings();

    // Get user input
    const userInput = await getUserInput('\nEnter your search query: ');

    if (!userInput?.trim()) {
      console.log('❌ No input provided. Exiting...');
      return;
    }

    // Generate user embedding and calculate similarities
    const userEmbedding = await generateUserEmbedding(userInput.trim());
    const similarities = calculateSimilarities(
      userEmbedding,
      categoryEmbeddings
    );

    // Display results
    displayResults(userInput, similarities);
  } catch (error) {
    console.error('❌ Error in embeddings function:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
};
