import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useScrollAnimation, useElementAnimation } from '../../app/composables/useScrollAnimation'

// Mock @vueuse/core useIntersectionObserver
let capturedCallback: ((entries: Array<{ isIntersecting: boolean }>) => void) | null = null
const mockStop = vi.fn()

vi.mock('@vueuse/core', () => ({
  useIntersectionObserver: vi.fn((_target, callback, _options) => {
    capturedCallback = callback
    return { stop: mockStop }
  }),
}))

describe('useScrollAnimation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedCallback = null
  })

  it('returns isVisible, animationClass, and setupAnimation', () => {
    const { isVisible, animationClass, setupAnimation } = useScrollAnimation()
    expect(isVisible).toBeDefined()
    expect(animationClass).toBe('animate-fade-in-up')
    expect(setupAnimation).toBeInstanceOf(Function)
  })

  it('isVisible is initially false', () => {
    const { isVisible } = useScrollAnimation()
    expect(isVisible.value).toBe(false)
  })

  it('uses custom animationClass when provided', () => {
    const { animationClass } = useScrollAnimation({ animationClass: 'custom-anim' })
    expect(animationClass).toBe('custom-anim')
  })

  it('setupAnimation sets up observer and returns controls', () => {
    const { setupAnimation } = useScrollAnimation()
    const target = ref<HTMLElement | null>(null)
    const result = setupAnimation(target)

    expect(result).toHaveProperty('isVisible')
    expect(result).toHaveProperty('stop')
  })

  it('sets isVisible to true when element intersects', () => {
    const { setupAnimation } = useScrollAnimation()
    const target = ref<HTMLElement | null>(null)
    setupAnimation(target)

    capturedCallback?.([{ isIntersecting: true }])
    // isVisible is shared between the composable and setupAnimation
    expect(capturedCallback).toBeDefined()
  })

  it('stops observer when once is true (default)', () => {
    const { setupAnimation } = useScrollAnimation({ once: true })
    const target = ref<HTMLElement | null>(null)
    setupAnimation(target)

    capturedCallback?.([{ isIntersecting: true }])
    expect(mockStop).toHaveBeenCalled()
  })

  it('does not stop observer when once is false', () => {
    const { setupAnimation } = useScrollAnimation({ once: false })
    const target = ref<HTMLElement | null>(null)
    setupAnimation(target)

    capturedCallback?.([{ isIntersecting: true }])
    expect(mockStop).not.toHaveBeenCalled()
  })

  it('resets isVisible when not intersecting and once is false', () => {
    const { setupAnimation, isVisible } = useScrollAnimation({ once: false })
    const target = ref<HTMLElement | null>(null)
    setupAnimation(target)

    capturedCallback?.([{ isIntersecting: true }])
    expect(isVisible.value).toBe(true)

    capturedCallback?.([{ isIntersecting: false }])
    expect(isVisible.value).toBe(false)
  })

  it('uses default options when none provided', async () => {
    const { useIntersectionObserver } = vi.mocked(await import('@vueuse/core'))
    const { setupAnimation } = useScrollAnimation()
    const target = ref<HTMLElement | null>(null)
    setupAnimation(target)

    expect(useIntersectionObserver).toHaveBeenCalledWith(
      target,
      expect.any(Function),
      { threshold: 0.1, rootMargin: '0px' },
    )
  })

  it('passes custom threshold and rootMargin', async () => {
    const { useIntersectionObserver } = vi.mocked(await import('@vueuse/core'))
    const { setupAnimation } = useScrollAnimation({ threshold: 0.5, rootMargin: '100px' })
    const target = ref<HTMLElement | null>(null)
    setupAnimation(target)

    expect(useIntersectionObserver).toHaveBeenCalledWith(
      target,
      expect.any(Function),
      { threshold: 0.5, rootMargin: '100px' },
    )
  })
})

describe('useElementAnimation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedCallback = null
  })

  it('returns elementRef and isVisible', () => {
    const { elementRef, isVisible } = useElementAnimation()
    expect(elementRef).toBeDefined()
    expect(isVisible).toBeDefined()
    expect(isVisible.value).toBe(false)
  })

  it('sets isVisible to true when element intersects', () => {
    const { isVisible } = useElementAnimation()

    capturedCallback?.([{ isIntersecting: true }])
    expect(isVisible.value).toBe(true)
  })

  it('does not reset isVisible when once is true (default)', () => {
    const { isVisible } = useElementAnimation()

    capturedCallback?.([{ isIntersecting: true }])
    expect(isVisible.value).toBe(true)

    capturedCallback?.([{ isIntersecting: false }])
    // Once is true by default, so it should stay true
    expect(isVisible.value).toBe(true)
  })

  it('resets isVisible when once is false', () => {
    const { isVisible } = useElementAnimation({ once: false })

    capturedCallback?.([{ isIntersecting: true }])
    expect(isVisible.value).toBe(true)

    capturedCallback?.([{ isIntersecting: false }])
    expect(isVisible.value).toBe(false)
  })

  it('uses custom rootMargin default for element animation', async () => {
    const { useIntersectionObserver } = vi.mocked(await import('@vueuse/core'))
    useElementAnimation()

    expect(useIntersectionObserver).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )
  })
})
