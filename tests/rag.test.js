import { describe, it, expect } from 'vitest';
import { retrieveContext } from '../src/services/rag.js';

describe('retrieveContext', () => {
  it('should return empty array for empty or stop-word only query', () => {
    const result = retrieveContext('is and the');
    expect(result).toEqual([]);
  });

  it('should retrieve relevant document chunks for matching terms', () => {
    const result = retrieveContext('Aadhaar correction rules');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].title.toLowerCase()).toContain('aadhaar');
  });

  it('should respect the limit parameter', () => {
    const result = retrieveContext('Aadhaar card details passport', 1);
    expect(result.length).toBe(1);
  });

  it('should rank documents based on cosine similarity scores', () => {
    const result = retrieveContext('Tatkaal fee passport booking');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].title.toLowerCase()).toContain('passport');
  });
});
