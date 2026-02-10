import { describe, it, expect, vi } from 'vitest'

// Mock @vueuse/core
const mockProvideSSRWidth = vi.fn()
vi.mock('@vueuse/core', () => ({
  provideSSRWidth: mockProvideSSRWidth,
}))

describe('ssr-width plugin', () => {
  it('calls provideSSRWidth with 1024 and vueApp', async () => {
    const mockVueApp = { provide: vi.fn() }
    const mockNuxtApp = { vueApp: mockVueApp }

    // Import the plugin default export
    const { default: plugin } = await import('../../app/plugins/ssr-width')

    // Nuxt plugins export a function wrapped by defineNuxtPlugin
    // The actual plugin function is the setup function
    if (typeof plugin === 'function') {
      plugin(mockNuxtApp as never)
    }
    else if (plugin && typeof plugin === 'object' && 'setup' in plugin) {
      (plugin as { setup: (app: unknown) => void }).setup(mockNuxtApp)
    }

    expect(mockProvideSSRWidth).toHaveBeenCalledWith(1024, mockVueApp)
  })
})
