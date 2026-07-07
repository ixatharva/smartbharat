import { KNOWLEDGE_BASE } from './kb.js';

// English stop words list
const STOP_WORDS = new Set([
  'is', 'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'else', 'for', 'to', 'in', 'on', 'at', 
  'by', 'of', 'from', 'with', 'about', 'how', 'what', 'where', 'who', 'why', 'can', 'do', 'does', 
  'i', 'you', 'he', 'she', 'they', 'we', 'your', 'my', 'their', 'our', 'this', 'that', 'these', 'those',
  'how', 'many', 'much', 'please', 'give', 'show', 'tell', 'need', 'want', 'require', 'needed'
]);

// Text Tokenizer (lowercases, splits words, filters stop words)
function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token && !STOP_WORDS.has(token));
}

// Compute IDF (Inverse Document Frequency) vocabulary
const corpus = KNOWLEDGE_BASE.map(doc => tokenize(doc.title + " " + doc.text));
const N = corpus.length;

const DF = {};
corpus.forEach(tokens => {
  const uniqueTokens = new Set(tokens);
  uniqueTokens.forEach(t => {
    DF[t] = (DF[t] || 0) + 1;
  });
});

const IDF = {};
for (const token in DF) {
  IDF[token] = Math.log(1 + N / DF[token]);
}

// Pre-compute Document TF-IDF vectors
const DOC_VECTORS = KNOWLEDGE_BASE.map((doc, idx) => {
  const tokens = corpus[idx];
  const TF = {};
  tokens.forEach(t => {
    TF[t] = (TF[t] || 0) + 1;
  });
  
  const tfidf = {};
  const len = tokens.length;
  for (const t in TF) {
    tfidf[t] = (TF[t] / len) * (IDF[t] || 0);
  }
  return tfidf;
});

/**
 * Main Context Retriever.
 * Tokenizes the citizen's query, computes real-time TF-IDF term weights,
 * and calculates Cosine Similarity scores against pre-processed manual document chunks.
 * 
 * @param {string} query - Expanded query text to search for.
 * @param {number} limit - Maximum number of matched passages to return (defaults to 2).
 * @returns {Array<Object>} List of top-scoring matching document segments.
 */
export function retrieveContext(query, limit = 2) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];
  
  const queryTF = {};
  queryTokens.forEach(t => {
    queryTF[t] = (queryTF[t] || 0) + 1;
  });
  
  const queryVector = {};
  const qLen = queryTokens.length;
  for (const t in queryTF) {
    queryVector[t] = (queryTF[t] / qLen) * (IDF[t] || 0);
  }
  
  // Calculate similarity score for each document
  const scores = KNOWLEDGE_BASE.map((doc, idx) => {
    const docVec = DOC_VECTORS[idx];
    let dotProduct = 0;
    let queryNorm = 0;
    let docNorm = 0;
    
    for (const t in queryVector) {
      if (docVec[t]) {
        dotProduct += queryVector[t] * docVec[t];
      }
      queryNorm += queryVector[t] ** 2;
    }
    
    for (const t in docVec) {
      docNorm += docVec[t] ** 2;
    }
    
    const similarity = (queryNorm === 0 || docNorm === 0) ? 0 : dotProduct / (Math.sqrt(queryNorm) * Math.sqrt(docNorm));
    return { doc, score: similarity };
  });
  
  // Sort documents by similarity score in descending order
  return scores
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.doc);
}
