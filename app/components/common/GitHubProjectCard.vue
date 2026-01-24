<template>
  <div 
    :class="[
      'bento-card group relative overflow-hidden rounded-xl transition-all duration-500',
      sizeClasses,
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    ]"
    :style="{ animationDelay: `${index * 0.1}s` }"
  >
    <!-- Gradient Border Effect -->
    <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" ></div>
    
    <!-- Card Content -->
    <div class="relative h-full rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/5">
      
      <!-- Header with Language Color Bar -->
      <div 
        class="h-1.5 rounded-t-xl transition-all duration-300 group-hover:h-2"
        :style="{ backgroundColor: languageColor }"
      ></div>

      <div class="flex h-[calc(100%-6px)] flex-col p-5">
        <!-- Top Row: Title + Badges -->
        <div class="mb-3 flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="truncate text-lg font-bold transition-colors group-hover:text-primary">
              {{ formatRepoName(repo.name) }}
            </h3>
            <div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span v-if="repo.language" class="flex items-center gap-1">
                <span 
                  class="h-2.5 w-2.5 rounded-full"
                  :style="{ backgroundColor: languageColor }"
                ></span>
                {{ repo.language }}
              </span>
              <span v-if="repo.language" class="text-border">|</span>
              <span>{{ formatDate(repo.pushedAt) }}</span>
            </div>
          </div>
          
          <!-- Badges -->
          <div class="flex flex-shrink-0 items-center gap-2">
            <Badge v-if="repo.isRecent" variant="default" class="bg-green-500/90 text-xs">
              <Zap class="mr-1 h-3 w-3" />
              {{ $t('projects.recentBadge') }}
            </Badge>
          </div>
        </div>

        <!-- Description -->
        <p 
          :class="[
            'text-sm text-muted-foreground transition-colors group-hover:text-foreground/80',
            size === 'large' ? 'line-clamp-4' : 'line-clamp-2'
          ]"
        >
          {{ repo.description }}
        </p>

        <!-- Topics/Tags -->
        <div v-if="repo.topics.length > 0" class="mt-auto pt-4">
          <div class="flex flex-wrap gap-1.5">
            <Badge 
              v-for="topic in displayedTopics" 
              :key="topic" 
              variant="outline"
              class="border-primary/20 text-xs transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              {{ topic }}
            </Badge>
            <Badge 
              v-if="repo.topics.length > maxTopics" 
              variant="outline"
              class="text-xs"
            >
              +{{ repo.topics.length - maxTopics }}
            </Badge>
          </div>
        </div>

        <!-- Footer: Stats + Actions -->
        <div class="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <span class="flex items-center gap-1 transition-colors hover:text-yellow-500">
                    <Star class="h-4 w-4" :class="{ 'fill-yellow-500 text-yellow-500': repo.stars > 0 }" />
                    {{ repo.stars }}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{{ $t('projects.stars') }}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <span class="flex items-center gap-1 transition-colors hover:text-primary">
                    <GitFork class="h-4 w-4" />
                    {{ repo.forks }}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{{ $t('projects.forks') }}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <Button
              v-if="repo.homepage"
              variant="ghost"
              size="sm"
              as="a"
              :href="repo.homepage"
              target="_blank"
              rel="noopener noreferrer"
              class="h-8 w-8 p-0 transition-colors hover:text-primary"
            >
              <ExternalLink class="h-4 w-4" />
              <span class="sr-only">{{ $t('projects.viewDemo', { title: repo.name }) }}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              as="a"
              :href="repo.url"
              target="_blank"
              rel="noopener noreferrer"
              class="h-8 w-8 p-0 transition-colors hover:text-primary"
            >
              <Github class="h-4 w-4" />
              <span class="sr-only">{{ $t('projects.viewSourceCode', { title: repo.name }) }}</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Hover Glow Effect -->
      <div class="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10" ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Star, GitFork, Github, ExternalLink, Zap } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import type { GitHubRepo } from '~/data/portfolio'

const props = defineProps<{
  repo: GitHubRepo
  size: 'large' | 'medium' | 'small'
  index: number
  isVisible: boolean
}>()

// Mapping des couleurs par langage (GitHub style)
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Vue: '#42b883',
  Go: '#00add8',
  Rust: '#dea584',
  Java: '#007396',
  'C#': '#512bd4',
  'C++': '#00599c',
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
  Makefile: '#427819',
  HCL: '#844fba',
}

const languageColor = computed(() => 
  props.repo.language ? (languageColors[props.repo.language] || '#6b7280') : '#6b7280',
)

// Classes de taille pour le Bento Grid
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'large':
      return 'md:col-span-2 md:row-span-1'
    case 'medium':
      return 'col-span-1 row-span-1'
    case 'small':
      return 'col-span-1 row-span-1'
    default:
      return 'col-span-1'
  }
})

// Nombre de topics à afficher selon la taille
const maxTopics = computed(() => props.size === 'large' ? 6 : 3)

const displayedTopics = computed(() => 
  props.repo.topics.slice(0, maxTopics.value),
)

// Formatter le nom du repo (remplacer - et _ par des espaces, capitaliser)
const formatRepoName = (name: string): string => {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

// Formatter la date relative
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 1) return 'Aujourd\'hui'
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return `Il y a ${Math.floor(diffDays / 365)} ans`
}
</script>

<style scoped>
.bento-card {
  animation: fade-slide-up 0.6s ease-out backwards;
}

@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
