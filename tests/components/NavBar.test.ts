import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NavBar from '../../app/components/common/NavBar.vue'

describe('NavBar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the navigation header', async () => {
    const wrapper = await mountSuspended(NavBar, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  it('renders desktop navigation buttons', async () => {
    const wrapper = await mountSuspended(NavBar, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
  })

  it('renders language toggle button', async () => {
    const wrapper = await mountSuspended(NavBar, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    const buttons = wrapper.findAll('button')
    const langButton = buttons.find(b => b.text() === 'EN' || b.text() === 'FR')
    expect(langButton).toBeTruthy()
  })

  it('has transparent background when not scrolled', async () => {
    const wrapper = await mountSuspended(NavBar, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    const header = wrapper.find('header')
    expect(header.classes()).toContain('bg-transparent')
  })

  it('adds backdrop blur when scrolled', async () => {
    const wrapper = await mountSuspended(NavBar, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const header = wrapper.find('header')
    expect(header.classes()).toContain('bg-background/80')
  })

  it('renders the logo link', async () => {
    const wrapper = await mountSuspended(NavBar, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    const logoLink = wrapper.find('a[href="#"]')
    expect(logoLink.exists()).toBe(true)
  })

  it('renders navigation links', async () => {
    const wrapper = await mountSuspended(NavBar, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    const navLinks = wrapper.findAll('a[href^="#"]')
    expect(navLinks.length).toBeGreaterThan(0)
  })

  it('renders mobile menu button', async () => {
    const wrapper = await mountSuspended(NavBar, {
      global: {
        stubs: {
          ClientOnly: {
            template: '<slot name="fallback" />',
          },
        },
      },
    })
    const srOnly = wrapper.find('.sr-only')
    expect(srOnly.exists()).toBe(true)
  })
})
