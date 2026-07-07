import { describe, it, expect } from 'vitest';
import { routeQuery } from '../src/services/router.js';

describe('routeQuery', () => {
  it('should detect ticket ID patterns and classify as tracking', () => {
    const result = routeQuery('Check status of SB-12345');
    expect(result.intent).toBe('tracking');
    expect(result.extractedId).toBe('SB-12345');
  });

  it('should classify queries with general tracking keywords as tracking', () => {
    const result = routeQuery('Track my grievance');
    expect(result.intent).toBe('tracking');
    expect(result.extractedId).toBeNull();
  });

  it('should expand Hindi keywords correctly', () => {
    const result = routeQuery('आधार कार्ड कैसे बदलें');
    expect(result.intent).toBe('schemes');
    expect(result.expandedQuery).toContain('Aadhaar');
  });

  it('should expand Tamil keywords correctly', () => {
    const result = routeQuery('முகவரி மாற்றம் செய்');
    expect(result.intent).toBe('schemes');
    expect(result.expandedQuery).toContain('Address update online');
  });

  it('should return schemes intent for general queries', () => {
    const result = routeQuery('How to apply for PM-Kisan scheme');
    expect(result.intent).toBe('schemes');
    expect(result.extractedId).toBeNull();
  });
});
