import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock useRuntimeConfig — resolved from #app/nuxt in Nuxt test environment
const mockUseRuntimeConfig = vi.fn()
vi.mock('#app/nuxt', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useRuntimeConfig: (...args: unknown[]) => mockUseRuntimeConfig(...args),
  }
})

// Mock h3 — repos.get.ts imports { defineEventHandler, createError } from 'h3'
const mockCreateError = vi.fn((opts: { statusCode: number, statusMessage: string, data?: unknown }) => {
  const err = new Error(opts.statusMessage) as Error & { statusCode: number, data?: unknown }
  err.statusCode = opts.statusCode
  err.data = opts.data
  return err
})

vi.mock('h3', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    defineEventHandler: (handler: Function) => handler,
    createError: (opts: { statusCode: number, statusMessage: string, data?: unknown }) =>
      mockCreateError(opts),
  }
})

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Sample mock data
const mockRepoResponse = [
  {
    id: 1,
    name: 'my-repo',
    full_name: 'foufou-exe/my-repo',
    description: 'A cool project',
    html_url: 'https://github.com/foufou-exe/my-repo',
    homepage: 'https://myrepo.dev',
    stargazers_count: 10,
    forks_count: 2,
    language: 'TypeScript',
    topics: ['vue', 'nuxt'],
    pushed_at: new Date().toISOString(),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    fork: false,
    archived: false,
    visibility: 'public',
    default_branch: 'main',
    owner: { login: 'foufou-exe' },
  },
  {
    id: 2,
    name: 'forked-repo',
    full_name: 'foufou-exe/forked-repo',
    description: 'A fork',
    html_url: 'https://github.com/foufou-exe/forked-repo',
    homepage: null,
    stargazers_count: 0,
    forks_count: 0,
    language: 'JavaScript',
    topics: [],
    pushed_at: '2024-06-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    fork: true,
    archived: false,
    visibility: 'public',
    default_branch: 'main',
    owner: { login: 'foufou-exe' },
  },
  {
    id: 3,
    name: 'archived-repo',
    full_name: 'foufou-exe/archived-repo',
    description: 'Old stuff',
    html_url: 'https://github.com/foufou-exe/archived-repo',
    homepage: null,
    stargazers_count: 5,
    forks_count: 1,
    language: 'Python',
    topics: [],
    pushed_at: '2023-01-01T00:00:00Z',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    fork: false,
    archived: true,
    visibility: 'public',
    default_branch: 'main',
    owner: { login: 'foufou-exe' },
  },
]

describe('repos.get API', () => {
  let handler: (event: unknown) => Promise<unknown>

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Re-apply mocks after resetModules
    vi.doMock('#app/nuxt', async (importOriginal) => {
      const original = await importOriginal<Record<string, unknown>>()
      return {
        ...original,
        useRuntimeConfig: (...args: unknown[]) => mockUseRuntimeConfig(...args),
      }
    })

    vi.doMock('h3', async (importOriginal) => {
      const original = await importOriginal<Record<string, unknown>>()
      return {
        ...original,
        defineEventHandler: (handler: Function) => handler,
        createError: (opts: { statusCode: number, statusMessage: string, data?: unknown }) =>
          mockCreateError(opts),
      }
    })

    vi.stubGlobal('fetch', mockFetch)

    const mod = await import('../../../server/api/github/repos.get')
    handler = mod.default as (event: unknown) => Promise<unknown>
  })

  it('fetches repos and filters out forks and archived', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      githubToken: 'test-token',
      githubUsername: 'foufou-exe',
    })

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          data: { user: { pinnedItems: { nodes: [{ name: 'my-repo' }] } } },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRepoResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ open_graph_image_url: 'https://custom-image.com/preview.png' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { login: 'foufou-exe', avatar_url: 'https://avatar.com/1', type: 'User' },
          { login: 'dependabot[bot]', avatar_url: 'https://avatar.com/2', type: 'Bot' },
        ]),
      })

    const result = await handler({}) as { success: boolean, data: { name: string, isPinned: boolean, hasCustomImage: boolean, contributors: unknown[] }[], meta: { cached: boolean } }

    expect(result.success).toBe(true)
    expect(result.data.length).toBe(1)
    expect(result.data[0].name).toBe('my-repo')
    expect(result.data[0].isPinned).toBe(true)
    expect(result.data[0].hasCustomImage).toBe(true)
    expect(result.data[0].contributors.length).toBe(1)
    expect(result.meta.cached).toBe(false)
  })

  it('returns cached data on second call', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      githubToken: 'test-token',
      githubUsername: 'foufou-exe',
    })

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          data: { user: { pinnedItems: { nodes: [] } } },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockRepoResponse[0]]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ open_graph_image_url: null }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

    const result1 = await handler({}) as { meta: { cached: boolean } }
    expect(result1.meta.cached).toBe(false)

    const result2 = await handler({}) as { meta: { cached: boolean } }
    expect(result2.meta.cached).toBe(true)
  })

  it('throws error when GitHub API returns non-ok', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      githubToken: 'test-token',
      githubUsername: 'foufou-exe',
    })

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ data: { user: { pinnedItems: { nodes: [] } } } }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      })

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(handler({})).rejects.toThrow()
    errorSpy.mockRestore()
  })

  it('works without GitHub token (no pinned repos or details)', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      githubToken: '',
      githubUsername: 'foufou-exe',
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockRepoResponse[0]]),
    })

    const result = await handler({}) as { success: boolean, data: { name: string, hasCustomImage: boolean, isPinned: boolean }[] }

    expect(result.success).toBe(true)
    expect(result.data.length).toBe(1)
    expect(result.data[0].hasCustomImage).toBe(false)
    expect(result.data[0].isPinned).toBe(false)
  })

  it('handles GraphQL pinned repos failure gracefully', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      githubToken: 'test-token',
      githubUsername: 'foufou-exe',
    })

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mockFetch
      .mockRejectedValueOnce(new Error('GraphQL error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockRepoResponse[0]]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ open_graph_image_url: null }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

    const result = await handler({}) as { success: boolean, data: { isPinned: boolean }[] }

    expect(result.success).toBe(true)
    expect(result.data[0].isPinned).toBe(false)

    warnSpy.mockRestore()
  })

  it('uses fallback OpenGraph URL when no custom image', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      githubToken: 'test-token',
      githubUsername: 'foufou-exe',
    })

    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ data: { user: { pinnedItems: { nodes: [] } } } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockRepoResponse[0]]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          open_graph_image_url: 'https://opengraph.githubassets.com/abc/foufou-exe/my-repo',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

    const result = await handler({}) as { data: { imageUrl: string, hasCustomImage: boolean }[] }

    expect(result.data[0].hasCustomImage).toBe(false)
    expect(result.data[0].imageUrl).toContain('opengraph.githubassets.com')
  })

  it('provides default description for repos without one', async () => {
    const repoNoDesc = { ...mockRepoResponse[0], description: null }
    mockUseRuntimeConfig.mockReturnValue({
      githubToken: '',
      githubUsername: 'foufou-exe',
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([repoNoDesc]),
    })

    const result = await handler({}) as { data: { description: string }[] }

    expect(result.data[0].description).toBe('Aucune description disponible')
  })
})
