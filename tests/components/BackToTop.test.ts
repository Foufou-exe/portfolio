import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BackToTop from '../../app/components/common/BackToTop.vue'

describe('BackToTop', () => {
  const originalScrollTo = window.scrollTo

  beforeEach(() => {
    // Use spies instead of stubbing the entire window
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.scrollTo = originalScrollTo
  })

  it('is hidden when scroll position is below threshold', async () => {
    const wrapper = await mountSuspended(BackToTop)
    const button = wrapper.find('button')
    // v-show sets display:none, but in Transition wrapper happy-dom
    // may handle visibility differently — check the style attribute
    const style = button.attributes('style') || ''
    expect(style).toContain('display: none')
  })

  it('becomes visible when scroll exceeds threshold', async () => {
    const wrapper = await mountSuspended(BackToTop)

    // Simulate scroll past 400px threshold
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const button = wrapper.find('button')
    expect(button.isVisible()).toBe(true)
  })

  it('calls scrollTo top on click', async () => {
    const wrapper = await mountSuspended(BackToTop)

    // Make button visible first
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('has correct aria-label', async () => {
    const wrapper = await mountSuspended(BackToTop)
    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBeTruthy()
  })

  it('renders ArrowUp icon', async () => {
    const wrapper = await mountSuspended(BackToTop)
    // lucide-vue-next renders an SVG
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
  })
})
