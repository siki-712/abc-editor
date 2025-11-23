import { describe, it, expect } from 'vitest';
import { getSuggestionsForField, ABC_SUGGESTIONS } from './abcSuggestions';

describe('abcSuggestions', () => {
  describe('ABC_SUGGESTIONS', () => {
    it('should have suggestions for M: (meter)', () => {
      const suggestions = ABC_SUGGESTIONS['M:'];
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some((s) => s.value === '4/4')).toBe(true);
      expect(suggestions.some((s) => s.value === '3/4')).toBe(true);
      expect(suggestions.some((s) => s.value === '6/8')).toBe(true);
    });

    it('should have suggestions for K: (key)', () => {
      const suggestions = ABC_SUGGESTIONS['K:'];
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some((s) => s.value === 'C')).toBe(true);
      expect(suggestions.some((s) => s.value === 'G')).toBe(true);
      expect(suggestions.some((s) => s.value === 'Am')).toBe(true);
    });

    it('should have suggestions for Q: (tempo)', () => {
      const suggestions = ABC_SUGGESTIONS['Q:'];
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some((s) => s.value === '1/4=120')).toBe(true);
    });

    it('should have suggestions for L: (unit note length)', () => {
      const suggestions = ABC_SUGGESTIONS['L:'];
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some((s) => s.value === '1/4')).toBe(true);
      expect(suggestions.some((s) => s.value === '1/8')).toBe(true);
    });

    it('should have description for each suggestion', () => {
      const suggestions = ABC_SUGGESTIONS['M:'];
      suggestions.forEach((suggestion) => {
        expect(suggestion.value).toBeDefined();
        expect(suggestion.description).toBeDefined();
        expect(typeof suggestion.value).toBe('string');
        expect(typeof suggestion.description).toBe('string');
      });
    });
  });

  describe('getSuggestionsForField', () => {
    it('should return suggestions for M:', () => {
      const suggestions = getSuggestionsForField('M:');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('value');
      expect(suggestions[0]).toHaveProperty('description');
    });

    it('should return suggestions for K:', () => {
      const suggestions = getSuggestionsForField('K:');
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should return suggestions for A: (area)', () => {
      const suggestions = getSuggestionsForField('A:');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('value');
      expect(suggestions[0]).toHaveProperty('description');
    });
  });
});
