import { describe, it, expect } from 'vitest'
import { cn } from '../../app/lib/utils'

describe('cn (class merge utility)', () => {
  it('merges simple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes with clsx', () => {
    const isHidden = false
    expect(cn('base', isHidden && 'hidden', 'visible')).toBe('base visible')
  })

  it('merges conflicting Tailwind classes using tailwind-merge', () => {
    // tailwind-merge should keep only the last conflicting class
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
  })

  it('handles undefined and null inputs', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('handles array inputs', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('handles object inputs', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500')
  })
})
