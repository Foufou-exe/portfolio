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
}

// Mapping des couleurs par langage (GitHub style)
export const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Vue: '#42b883',
  Go: '#00add8',
  Rust: '#dea584',
  Java: '#007396',
  'C#': '#512bd4',
  PHP: '#777bb4',
  Ruby: '#cc342d',
  Swift: '#fa7343',
  Kotlin: '#a97bff',
  Dart: '#0175c2',
  HTML: '#e34f26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  SCSS: '#c6538c',
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const githubToken = config.githubToken
  const username = config.githubUsername

  // Repos à exclure (nom du repo en lowercase)
  const excludedRepos = [
    username.toLowerCase(), // Exclure le repo de profil GitHub (même nom que l'utilisateur)
    'octocat', // Repo de stats GitHub
    '.github', // Repo de config organisation
  ]

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

    // Appel à l'API GitHub
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=20`,
      { headers }
    )

    if (!response.ok) {
      console.error('GitHub API Error:', response.status, response.statusText)
      throw createError({
        statusCode: response.status,
        statusMessage: `GitHub API error: ${response.statusText}`,
      })
    }

    const repos: GitHubRepoResponse[] = await response.json()

    // Filtrer : exclure les forks, repos archivés, et repos exclus
    const filteredRepos = repos
      .filter(repo => 
        !repo.fork && 
        !repo.archived && 
        repo.visibility === 'public' &&
        !excludedRepos.includes(repo.name.toLowerCase())
      )
      .slice(0, 5) // Limiter à 5 repos

    // Transformer en format adapté
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const transformedRepos: GitHubRepo[] = filteredRepos.map(repo => ({
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
    }))

    return {
      success: true,
      data: transformedRepos,
      meta: {
        username,
        fetchedAt: new Date().toISOString(),
        count: transformedRepos.length,
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
