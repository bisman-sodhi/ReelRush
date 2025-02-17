export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch('http://localhost:3000/api/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      console.error('Embedding API error:', await response.text());
      return new Array(768).fill(0);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return new Array(768).fill(0);
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, a_i, i) => sum + a_i * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, a_i) => sum + a_i * a_i, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, b_i) => sum + b_i * b_i, 0));
  return dotProduct / (magnitudeA * magnitudeB);
} 