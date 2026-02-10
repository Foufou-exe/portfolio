import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useNavLinks } from '../../app/composables/useNavLinks'

// Wrapper component to test composable in a Vue setup context
const TestWrapper = defineComponent({
  setup() {
    const { translatedNavLinks } = useNavLinks()
    return { translatedNavLinks }
  },
  render() {
    return h('div', {
      'data-links': JSON.stringify(this.translatedNavLinks),
    })
  },
})

describe('useNavLinks', () => {
  it('returns translatedNavLinks as a computed ref', async () => {
    const wrapper = await mountSuspended(TestWrapper)
    const links = JSON.parse(wrapper.find('div').attributes('data-links') || '[]')
    expect(links).toBeInstanceOf(Array)
  })

  it('returns 6 navigation links', async () => {
    const wrapper = await mountSuspended(TestWrapper)
    const links = JSON.parse(wrapper.find('div').attributes('data-links') || '[]')
    expect(links).toHaveLength(6)
  })

  it('each link has name and href properties', async () => {
    const wrapper = await mountSuspended(TestWrapper)
    const links = JSON.parse(wrapper.find('div').attributes('data-links') || '[]')
    links.forEach((link: { name: string, href: string }) => {
      expect(link).toHaveProperty('name')
      expect(link).toHaveProperty('href')
      expect(link.href).toMatch(/^#/)
    })
  })

  it('contains expected section hrefs', async () => {
    const wrapper = await mountSuspended(TestWrapper)
    const links = JSON.parse(wrapper.find('div').attributes('data-links') || '[]')
    const hrefs = links.map((l: { href: string }) => l.href)
    expect(hrefs).toContain('#about')
    expect(hrefs).toContain('#skills')
    expect(hrefs).toContain('#projects')
    expect(hrefs).toContain('#experience')
    expect(hrefs).toContain('#education')
    expect(hrefs).toContain('#contact')
  })
})
