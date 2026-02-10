import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useScrollToSection } from '../../app/composables/useScrollToSection'

// Mock the lazy section functions
vi.mock('~/composables/useLazySection', () => ({
  forceLazySectionRender: vi.fn(),
  isLazySectionPending: vi.fn(() => false),
}))

describe('useScrollToSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock DOM
    vi.stubGlobal('window', {
      scrollY: 100,
      scrollTo: vi.fn(),
    })

    vi.stubGlobal('document', {
      querySelector: vi.fn((selector: string) => {
        if (selector === '#about') {
          return {
            getBoundingClientRect: () => ({ top: 500 }),
          }
        }
        return null
      }),
    })
  })

  it('returns scrollToSection and scrollToTop functions', () => {
    const { scrollToSection, scrollToTop } = useScrollToSection()
    expect(scrollToSection).toBeInstanceOf(Function)
    expect(scrollToTop).toBeInstanceOf(Function)
  })

  it('scrollToSection scrolls to the correct position', async () => {
    const { scrollToSection } = useScrollToSection()
    await scrollToSection('#about')

    expect(document.querySelector).toHaveBeenCalledWith('#about')
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    })
  })

  it('scrollToSection accounts for header offset of 80px', async () => {
    const { scrollToSection } = useScrollToSection()
    await scrollToSection('#about')

    // elementPosition (500) + scrollY (100) - HEADER_OFFSET (80) = 520
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 520,
      behavior: 'smooth',
    })
  })

  it('scrollToSection does nothing when element is not found', async () => {
    const { scrollToSection } = useScrollToSection()
    await scrollToSection('#nonexistent')

    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('scrollToSection force-renders lazy section when pending', async () => {
    const { isLazySectionPending, forceLazySectionRender } = await import('~/composables/useLazySection')
    vi.mocked(isLazySectionPending).mockReturnValue(true)

    const { scrollToSection } = useScrollToSection()
    await scrollToSection('#about')

    expect(forceLazySectionRender).toHaveBeenCalledWith('about')
  })

  it('scrollToTop scrolls to the top of the page', () => {
    const { scrollToTop } = useScrollToSection()
    scrollToTop()

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })
})
