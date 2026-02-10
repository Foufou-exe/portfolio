import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatRepoName, formatFullDate, formatRelativeDate } from '../../app/utils/formatters'

describe('formatters', () => {
  describe('formatRepoName', () => {
    it('replaces hyphens with spaces and capitalizes words', () => {
      expect(formatRepoName('my-cool-repo')).toBe('My Cool Repo')
    })

    it('replaces underscores with spaces and capitalizes words', () => {
      expect(formatRepoName('my_cool_repo')).toBe('My Cool Repo')
    })

    it('handles mixed hyphens and underscores', () => {
      expect(formatRepoName('my-cool_repo')).toBe('My Cool Repo')
    })

    it('handles single word', () => {
      expect(formatRepoName('portfolio')).toBe('Portfolio')
    })

    it('handles already capitalized input', () => {
      expect(formatRepoName('My-Repo')).toBe('My Repo')
    })

    it('handles empty string', () => {
      expect(formatRepoName('')).toBe('')
    })
  })

  describe('formatFullDate', () => {
    it('formats date in French by default', () => {
      const result = formatFullDate('2024-06-15T12:00:00Z')
      expect(result).toContain('2024')
      expect(result).toContain('15')
      // French locale should contain month name in French
      expect(result).toContain('juin')
    })

    it('formats date in French when locale is fr', () => {
      const result = formatFullDate('2024-01-20T12:00:00Z', 'fr')
      expect(result).toContain('janvier')
      expect(result).toContain('2024')
    })

    it('formats date in English when locale is en', () => {
      const result = formatFullDate('2024-06-15T12:00:00Z', 'en')
      expect(result).toContain('June')
      expect(result).toContain('2024')
    })

    it('treats non-fr locale as English', () => {
      const result = formatFullDate('2024-06-15T12:00:00Z', 'de')
      // Non-fr falls back to en-US
      expect(result).toContain('June')
    })
  })

  describe('formatRelativeDate', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      // Set current time to 2024-06-15T12:00:00Z
      vi.setSystemTime(new Date('2024-06-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns "Aujourd\'hui" for today in French', () => {
      // Same timestamp as system time — diffDays will be 0 after ceil
      const result = formatRelativeDate('2024-06-15T12:00:00Z', 'fr')
      expect(result).toBe('Aujourd\'hui')
    })

    it('returns "Today" for today in English', () => {
      const result = formatRelativeDate('2024-06-15T12:00:00Z', 'en')
      expect(result).toBe('Today')
    })

    it('returns "Hier" for yesterday in French', () => {
      const result = formatRelativeDate('2024-06-14T12:00:00Z', 'fr')
      expect(result).toBe('Hier')
    })

    it('returns "Yesterday" for yesterday in English', () => {
      const result = formatRelativeDate('2024-06-14T12:00:00Z', 'en')
      expect(result).toBe('Yesterday')
    })

    it('returns days ago for 2-6 days', () => {
      const result = formatRelativeDate('2024-06-12T12:00:00Z', 'fr')
      expect(result).toMatch(/Il y a \d+ jours/)
    })

    it('returns days ago in English', () => {
      const result = formatRelativeDate('2024-06-12T12:00:00Z', 'en')
      expect(result).toMatch(/\d+ days ago/)
    })

    it('returns weeks ago for 7-29 days', () => {
      const result = formatRelativeDate('2024-06-01T12:00:00Z', 'fr')
      expect(result).toMatch(/Il y a \d+ semaine/)
    })

    it('returns weeks ago in English with plural', () => {
      const result = formatRelativeDate('2024-05-25T12:00:00Z', 'en')
      expect(result).toMatch(/\d+ weeks ago/)
    })

    it('returns 1 week ago without plural in English', () => {
      const result = formatRelativeDate('2024-06-08T12:00:00Z', 'en')
      expect(result).toBe('1 week ago')
    })

    it('returns months ago for 30-364 days', () => {
      const result = formatRelativeDate('2024-03-15T12:00:00Z', 'fr')
      expect(result).toMatch(/Il y a \d+ mois/)
    })

    it('returns months ago in English with plural', () => {
      const result = formatRelativeDate('2024-02-15T12:00:00Z', 'en')
      expect(result).toMatch(/\d+ months ago/)
    })

    it('returns 1 month ago without plural in English', () => {
      const result = formatRelativeDate('2024-05-15T12:00:00Z', 'en')
      expect(result).toBe('1 month ago')
    })

    it('returns years ago for 365+ days', () => {
      const result = formatRelativeDate('2022-06-15T12:00:00Z', 'fr')
      expect(result).toMatch(/Il y a \d+ ans?/)
    })

    it('returns years ago in English with plural', () => {
      const result = formatRelativeDate('2021-06-15T12:00:00Z', 'en')
      expect(result).toMatch(/\d+ years ago/)
    })

    it('returns 1 year ago without plural in English', () => {
      const result = formatRelativeDate('2023-06-15T12:00:00Z', 'en')
      expect(result).toBe('1 year ago')
    })

    it('defaults to French locale', () => {
      const result = formatRelativeDate('2024-06-14T12:00:00Z')
      expect(result).toBe('Hier')
    })
  })
})
