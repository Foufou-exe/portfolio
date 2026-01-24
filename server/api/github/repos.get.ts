import { defineEventHandler, createError } from 'h3'

// Types pour l'API GitHub
interface GitHubRepoResponse {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  pushed_at: string
  created_at: string
  updated_at: string
  fork: boolean
  archived: boolean
  visibility: string
  default_branch: string
  owner: {
    login: string
  }
}

// Interface pour les détails du repo (incluant social preview)
interface GitHubRepoDetails {
  open_graph_image_url?: string
}

export interface GitHubRepo {
  id: number
  name: string
  fullName: string
  description: string
  url: string
  homepage: string | null
  stars: number
  forks: number
  language: string | null
  topics: string[]
  pushedAt: string
  createdAt: string
  isRecent: boolean // Push dans les 30 derniers jours
  imageUrl: string | null // Social preview ou image README
  isPinned: boolean // Repo épinglé sur le profil
}

// Mapping des couleurs par langage (GitHub style)
export const languageColors: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f7df1e',
  'Python': '#3776ab',
  'Vue': '#42b883',
  'Go': '#00add8',
  'Rust': '#dea584',
  'Java': '#007396',
  'C#': '#512bd4',
  'PHP': '#777bb4',
  'Ruby': '#cc342d',
  'Swift': '#fa7343',
  'Kotlin': '#a97bff',
  'Dart': '#0175c2',
  'HTML': '#e34f26',
  'CSS': '#563d7c',
  'Shell': '#89e051',
  'Dockerfile': '#384d54',
  'SCSS': '#c6538c',
}

// Cache simple en mémoire pour éviter les appels répétés
interface CacheEntry {
  data: GitHubRepo[]
  timestamp: number
}

let cache: CacheEntry | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default defineEventHandler(async (_event) => {
  const config = useRuntimeConfig()
  const { githubToken } = config
  const username = config.githubUsername

  // Vérifier le cache
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return {
      success: true,
      data: cache.data,
      meta: {
        username,
        fetchedAt: new Date(cache.timestamp).toISOString(),
        count: cache.data.length,
        cached: true,
      },
    }
  }

  try {
    // Headers pour l'API GitHub
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App',
    }

    // Ajouter le token si disponible (augmente le rate limit)
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`
      headers['X-GitHub-Api-Version'] = '2022-11-28'
    }

    // Récupérer les repos épinglés via l'API GraphQL si token disponible
    let pinnedRepoNames: string[] = []
    if (githubToken) {
      try {
        const graphqlResponse = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                user(login: "${username}") {
                  pinnedItems(first: 6, types: REPOSITORY) {
                    nodes {
                      ... on Repository {
                        name
                      }
                    }
                  }
                }
              }
            `,
          }),
        })
        const graphqlData = await graphqlResponse.json()
        pinnedRepoNames = graphqlData?.data?.user?.pinnedItems?.nodes?.map((n: { name: string }) => n.name) || []
      }
      catch (e) {
        console.warn('Failed to fetch pinned repos:', e)
      }
    }

    // Appel à l'API GitHub pour les repos
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=30`,
      { headers },
    )

    if (!response.ok) {
      console.error('GitHub API Error:', response.status, response.statusText)
      throw createError({
        statusCode: response.status,
        statusMessage: `GitHub API error: ${response.statusText}`,
      })
    }

    const repos: GitHubRepoResponse[] = await response.json()

    // Filtrer : exclure les forks, repos archivés
    const filteredRepos = repos
      .filter(repo =>
        !repo.fork
        && !repo.archived
        && repo.visibility === 'public',
      )

    // Transformer en format adapté
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Récupérer les images social preview pour chaque repo (si token disponible)
    const transformedRepos: GitHubRepo[] = await Promise.all(
      filteredRepos.slice(0, 10).map(async (repo) => {
        let imageUrl: string | null = null

        // Essayer de récupérer l'image social preview via l'API
        if (githubToken) {
          try {
            const detailsResponse = await fetch(
              `https://api.github.com/repos/${repo.full_name}`,
              {
                headers: {
                  ...headers,
                  Accept: 'application/vnd.github.v3+json',
                },
              },
            )
            if (detailsResponse.ok) {
              const details: GitHubRepoDetails = await detailsResponse.json()
              imageUrl = details.open_graph_image_url || null
            }
          }
          catch (e) {
            console.warn(`Failed to fetch social preview for ${repo.name}:`, e)
          }
        }

        // Fallback: utiliser l'URL OpenGraph standard de GitHub
        if (!imageUrl) {
          imageUrl = `https://opengraph.githubassets.com/1/${repo.full_name}`
        }

        return {
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || 'Aucune description disponible',
          url: repo.html_url,
          homepage: repo.homepage || null,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          topics: repo.topics || [],
          pushedAt: repo.pushed_at,
          createdAt: repo.created_at,
          isRecent: new Date(repo.pushed_at) > thirtyDaysAgo,
          imageUrl,
          isPinned: pinnedRepoNames.includes(repo.name),
        }
      }),
    )

    // Trier: épinglés d'abord, puis par date de push
    const sortedRepos = transformedRepos.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
    })

    // Mettre en cache
    cache = {
      data: sortedRepos,
      timestamp: Date.now(),
    }

    return {
      success: true,
      data: sortedRepos,
      meta: {
        username,
        fetchedAt: new Date().toISOString(),
        count: sortedRepos.length,
        cached: false,
      },
    }
  }
  catch (error: unknown) {
    console.error('GitHub API Error:', error)

    // Retourner une erreur propre
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch GitHub repositories',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
})
