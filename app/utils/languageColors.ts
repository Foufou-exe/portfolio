// Mapping des couleurs par langage (GitHub style)
// Source unique de verite pour les couleurs de langages
export const languageColors: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f7df1e',
  'Python': '#3776ab',
  'Vue': '#42b883',
  'Go': '#00add8',
  'Rust': '#dea584',
  'Java': '#007396',
  'C#': '#512bd4',
  'C++': '#00599c',
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
  'Makefile': '#427819',
  'HCL': '#844fba',
}

export const getLanguageColor = (lang: string): string => {
  return languageColors[lang] || '#6b7280'
}
