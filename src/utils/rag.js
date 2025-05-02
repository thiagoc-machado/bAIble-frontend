import { pipeline } from '@xenova/transformers';

let embedder = null;

export const loadEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
};

export const embedText = async (text) => {
  if (!embedder) await loadEmbedder();
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return output.data;
};

export const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

export const buscarVersiculosRelevantes = async (pergunta, versiculos, topN = 5) => {
  const perguntaEmb = await embedText(pergunta);
  const resultados = versiculos.map(v => ({
    ...v,
    score: cosineSimilarity(perguntaEmb, v.embedding)
  }));
  return resultados.sort((a, b) => b.score - a.score).slice(0, topN);
};
