import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnimatedLogoSVG from '../../app/components/common/AnimatedLogoSVG.vue'

// Mock animejs
vi.mock('animejs', () => ({
  animate: vi.fn(),
}))

// Mock fetch for SVG loading
const mockSvgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle id="eye-left" cx="35" cy="40" r="5"/><circle id="eye-right" cx="65" cy="40" r="5"/><path d="M20,60 Q50,80 80,60"/></svg>'

describe('AnimatedLogoSVG', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => Promise.resolve(mockSvgContent),
    } as Response)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders an SVG element', async () => {
    const wrapper = await mountSuspended(AnimatedLogoSVG)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('uses default size of 45', async () => {
    const wrapper = await mountSuspended(AnimatedLogoSVG)
    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('45')
    expect(svg.attributes('height')).toBe('45')
  })

  it('accepts custom size prop', async () => {
    const wrapper = await mountSuspended(AnimatedLogoSVG, {
      props: { size: 60 },
    })
    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('60')
    expect(svg.attributes('height')).toBe('60')
  })

  it('has correct viewBox', async () => {
    const wrapper = await mountSuspended(AnimatedLogoSVG)
    const svg = wrapper.find('svg')
    // happy-dom may lowercase the attribute name
    const viewBox = svg.attributes('viewBox') || svg.attributes('viewbox')
    expect(viewBox).toBe('0 0 100 100')
  })

  it('fetches SVG content on mount', async () => {
    await mountSuspended(AnimatedLogoSVG)
    expect(globalThis.fetch).toHaveBeenCalledWith('/images/logo/logo.svg')
  })

  it('exposes animations via defineExpose', async () => {
    const wrapper = await mountSuspended(AnimatedLogoSVG)
    // defineExpose exposes animations
    expect(wrapper.vm).toHaveProperty('animations')
  })

  it('renders container with correct class', async () => {
    const wrapper = await mountSuspended(AnimatedLogoSVG)
    expect(wrapper.find('.animated-logo-svg').exists()).toBe(true)
  })

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    const wrapper = await mountSuspended(AnimatedLogoSVG)
    // Should not throw and still render
    expect(wrapper.find('svg').exists()).toBe(true)
    consoleSpy.mockRestore()
  })
})
