import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DefaultLayout from '../../app/layouts/default.vue'
import { profile, socialLinks, contactInfo } from '../../app/data/portfolio'

describe('default layout', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the layout with footer', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
      slots: {
        default: '<div>Page Content</div>',
      },
    })
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('renders the main content slot', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
    })
    expect(wrapper.find('main').exists()).toBe(true)
  })

  it('displays profile initials in footer', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    expect(wrapper.html()).toContain(profile.initials)
  })

  it('renders social links in footer', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    for (const social of socialLinks) {
      expect(wrapper.html()).toContain(social.name)
    }
  })

  it('renders contact email in footer', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    expect(wrapper.html()).toContain(contactInfo.email)
  })

  it('renders contact address in footer', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    expect(wrapper.html()).toContain(contactInfo.address)
  })

  it('renders copyright with current year', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    const currentYear = new Date().getFullYear().toString()
    expect(wrapper.html()).toContain(currentYear)
    expect(wrapper.html()).toContain(profile.name)
  })

  it('renders navigation links in footer', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    const footerLinks = wrapper.findAll('footer a[href^="#"]')
    expect(footerLinks.length).toBeGreaterThan(0)
  })
})
