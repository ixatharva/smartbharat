import { describe, it, expect } from 'vitest';
import { getTranslation } from '../src/services/translate.js';

describe('getTranslation', () => {
  it('should return English translation by default', () => {
    const result = getTranslation('en', 'nav_dashboard');
    expect(result).toBe('Dashboard');
  });

  it('should return Hindi translation when requested', () => {
    const result = getTranslation('hi', 'nav_dashboard');
    expect(result).toBe('डैशबोर्ड');
  });

  it('should return Tamil translation when requested', () => {
    const result = getTranslation('ta', 'nav_dashboard');
    expect(result).toBe('டாஷ்போர்டு');
  });

  it('should fall back to English if key is missing in selected language', () => {
    const result = getTranslation('fr', 'nav_dashboard');
    expect(result).toBe('Dashboard');
  });

  it('should return the key itself if key is missing in all dictionaries', () => {
    const result = getTranslation('en', 'non_existent_key_abc_123');
    expect(result).toBe('non_existent_key_abc_123');
  });
});
