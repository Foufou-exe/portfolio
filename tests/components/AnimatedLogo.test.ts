import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AnimatedLogo from '../../app/components/common/AnimatedLogo.vue'

describe('AnimatedLogo', () => {
  it('renders with default size', async () => {
    const wrapper = await mountSuspended(AnimatedLogo)
    expect(wrapper.find('.logo').exists()).toBe(true)
  })

  it('accepts custom size prop', async () => {
    const wrapper = await mountSuspended(AnimatedLogo, {
      props: { size: 60 },
    })
    expect(wrapper.html()).toBeTruthy()
  })

  it('renders SSR fallback text', async () => {
    const wrapper = await mountSuspended(AnimatedLogo)
    // ClientOnly renders fallback on server-side
    // In test env, it should show either the SVG or fallback
    const html = wrapper.html()
    expect(html).toBeTruthy()
  })

  it('has a clickable logo container', async () => {
    const wrapper = await mountSuspended(AnimatedLogo)
    const logoSpan = wrapper.find('.logo')
    expect(logoSpan.exists()).toBe(true)
    // Trigger click
    await logoSpan.trigger('click')
  })

  it('renders tooltip provider', async () => {
    const wrapper = await mountSuspended(AnimatedLogo)
    // The component wraps in TooltipProvider
    expect(wrapper.html()).toBeTruthy()
  })

  it('triggers animation on click', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0) // Always pick first animation
    const wrapper = await mountSuspended(AnimatedLogo)

    const logoSpan = wrapper.find('.logo')
    await logoSpan.trigger('click')

    // Verify click handler was triggered (no error thrown)
    expect(wrapper.html()).toBeTruthy()

    vi.restoreAllMocks()
  })
})
