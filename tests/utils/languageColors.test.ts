import { describe, it, expect } from 'vitest'
import { languageColors, getLanguageColor } from '../../app/utils/languageColors'

describe('languageColors', () => {
  describe('languageColors map', () => {
    it('contains common languages', () => {
      expect(languageColors['TypeScript']).toBe('#3178c6')
      expect(languageColors['JavaScript']).toBe('#f7df1e')
      expect(languageColors['Python']).toBe('#3776ab')
      expect(languageColors['Vue']).toBe('#42b883')
    })

    it('has entries for all defined languages', () => {
      const expectedLanguages = [
        'TypeScript', 'JavaScript', 'Python', 'Vue', 'Go', 'Rust',
        'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart',
        'HTML', 'CSS', 'Shell', 'Dockerfile', 'SCSS', 'Makefile', 'HCL',
      ]
      expectedLanguages.forEach((lang) => {
        expect(languageColors[lang]).toBeDefined()
      })
    })
  })

  describe('getLanguageColor', () => {
    it('returns correct color for known language', () => {
      expect(getLanguageColor('TypeScript')).toBe('#3178c6')
    })

    it('returns correct color for another known language', () => {
      expect(getLanguageColor('Python')).toBe('#3776ab')
    })

    it('returns fallback gray for unknown language', () => {
      expect(getLanguageColor('UnknownLang')).toBe('#6b7280')
    })

    it('returns fallback gray for empty string', () => {
      expect(getLanguageColor('')).toBe('#6b7280')
    })
  })
})
