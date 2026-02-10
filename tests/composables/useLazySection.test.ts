import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLazySection, forceLazySectionRender, isLazySectionPending } from '../../app/composables/useLazySection'

// Mock @vueuse/core useIntersectionObserver
const mockStop = vi.fn()
vi.mock('@vueuse/core', () => ({
  useIntersectionObserver: vi.fn((_target, callback, _options) => {
    // Store callback for manual triggering in tests
    ;(globalThis as Record<string, unknown>).__intersectionCallback = callback
    return { stop: mockStop }
  }),
}))

describe('useLazySection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clean the global registry between tests by forcing render on any remaining entries
    // We need to access the internal map — we do this by testing the public API
  })

  it('returns sentinelRef and shouldRender', () => {
    const { sentinelRef, shouldRender } = useLazySection('test-section-1')
    expect(sentinelRef).toBeDefined()
    expect(shouldRender).toBeDefined()
    expect(shouldRender.value).toBe(false)
    // Cleanup
    forceLazySectionRender('test-section-1')
  })

  it('initially does not render the section', () => {
    const { shouldRender } = useLazySection('test-section-2')
    expect(shouldRender.value).toBe(false)
    forceLazySectionRender('test-section-2')
  })

  it('registers section as pending in the registry', () => {
    useLazySection('test-section-3')
    expect(isLazySectionPending('test-section-3')).toBe(true)
    forceLazySectionRender('test-section-3')
  })

  it('activates when intersection observer triggers', () => {
    const { shouldRender } = useLazySection('test-section-4')
    expect(shouldRender.value).toBe(false)

    // Simulate intersection
    const callback = (globalThis as Record<string, unknown>).__intersectionCallback as (entries: Array<{ isIntersecting: boolean }>) => void
    callback([{ isIntersecting: true }])

    expect(shouldRender.value).toBe(true)
    expect(isLazySectionPending('test-section-4')).toBe(false)
  })

  it('does not activate on non-intersecting entry', () => {
    const { shouldRender } = useLazySection('test-section-5')

    const callback = (globalThis as Record<string, unknown>).__intersectionCallback as (entries: Array<{ isIntersecting: boolean }>) => void
    callback([{ isIntersecting: false }])

    expect(shouldRender.value).toBe(false)
    expect(isLazySectionPending('test-section-5')).toBe(true)
    forceLazySectionRender('test-section-5')
  })

  it('stops observer after activation', () => {
    useLazySection('test-section-6')

    const callback = (globalThis as Record<string, unknown>).__intersectionCallback as (entries: Array<{ isIntersecting: boolean }>) => void
    callback([{ isIntersecting: true }])

    expect(mockStop).toHaveBeenCalled()
  })

  it('removes section from registry after activation', () => {
    useLazySection('test-section-7')
    expect(isLazySectionPending('test-section-7')).toBe(true)

    const callback = (globalThis as Record<string, unknown>).__intersectionCallback as (entries: Array<{ isIntersecting: boolean }>) => void
    callback([{ isIntersecting: true }])

    expect(isLazySectionPending('test-section-7')).toBe(false)
  })

  it('forceLazySectionRender activates the section', () => {
    const { shouldRender } = useLazySection('test-section-8')
    expect(shouldRender.value).toBe(false)

    forceLazySectionRender('test-section-8')
    expect(shouldRender.value).toBe(true)
    expect(isLazySectionPending('test-section-8')).toBe(false)
  })

  it('forceLazySectionRender does nothing for unknown section', () => {
    // Should not throw
    expect(() => forceLazySectionRender('nonexistent')).not.toThrow()
  })

  it('isLazySectionPending returns false for unknown section', () => {
    expect(isLazySectionPending('nonexistent-section')).toBe(false)
  })
})
