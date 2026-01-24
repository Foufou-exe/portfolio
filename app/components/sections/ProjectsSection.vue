<template>
  <section id="projects" class="overflow-hidden py-20 min-h-screen">
    <div 
      ref="elementRef"
      class="container mx-auto px-4 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <SectionTitle 
        :title="$t('projects.title')" 
        :subtitle="$t('projects.subtitle')"
      />

      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" ></div>
          <p class="text-muted-foreground">{{ $t('projects.loading') }}</p>
        </div>
      </div>

      <!-- Error State with Fallback -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-muted-foreground mb-4">{{ $t('projects.errorLoading') }}</p>
        <Button variant="outline" @click="refresh()">
          <RefreshCw class="mr-2 h-4 w-4" />
          {{ $t('projects.retry') }}
        </Button>
      </div>

      <!-- Bento Grid Layout -->
      <div v-else class="bento-grid mx-auto max-w-6xl">
        <GitHubProjectCard 
          v-for="(repo, index) in displayedRepos" 
          :key="repo.id" 
          :repo="repo"
          :size="getCardSize(index)"
          :index="index"
          :is-visible="isVisible"
        />
      </div>

      <!-- Stats GitHub -->
      <div v-if="!pending && !error && displayedRepos.length > 0" class="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-8 sm:gap-12">
        <div class="text-center">
          <div class="text-3xl font-bold text-primary">{{ totalStars }}</div>
          <div class="text-sm text-muted-foreground">{{ $t('projects.totalStars') }}</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-primary">{{ displayedRepos.length }}</div>
          <div class="text-sm text-muted-foreground">{{ $t('projects.recentProjects') }}</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-primary">{{ uniqueLanguages }}</div>
          <div class="text-sm text-muted-foreground">{{ $t('projects.languages') }}</div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12 text-center">
        <p class="mb-4 text-muted-foreground">
          {{ $t('projects.viewMore') }}
        </p>
        <Button
          variant="outline"
          as="a"
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer">
          <Github class="mr-2 h-4 w-4" />
          {{ $t('projects.viewGithub') }}
        </Button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Github, RefreshCw } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import SectionTitle from '~/components/common/SectionTitle.vue'
import GitHubProjectCard from '~/components/common/GitHubProjectCard.vue'
import { socialLinks } from '~/data/portfolio'
import type { GitHubRepo } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { elementRef, isVisible } = useElementAnimation()

// Fetch GitHub repos depuis notre API
const { data, pending, error, refresh } = await useFetch<{
  success: boolean
  data: GitHubRepo[]
  meta: { username: string, fetchedAt: string, count: number }
}>('/api/github/repos', {
  // Cache côté client pendant 5 minutes
  getCachedData(key, nuxtApp) {
    const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    if (cached) return cached
    return null
  },
})

// Repos à afficher
const displayedRepos = computed(() => data.value?.data || [])

// Stats calculées
const totalStars = computed(() => 
  displayedRepos.value.reduce((sum, repo) => sum + repo.stars, 0),
)

const uniqueLanguages = computed(() => {
  const languages = new Set(displayedRepos.value.map(r => r.language).filter(Boolean))
  return languages.size
})

// Taille des cartes pour le Bento Grid
const getCardSize = (index: number): 'large' | 'medium' | 'small' => {
  // Premier projet = large (le plus récent / mis en avant)
  if (index === 0) return 'large'
  // Le 4ème projet = large aussi pour équilibrer
  if (index === 3) return 'large'
  // Autres = medium ou small
  return 'medium'
}

const githubUrl = computed(() => 
  socialLinks.find(l => l.icon === 'github')?.url || 'https://github.com/foufou-exe',
)
</script>

<style scoped>
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}
</style>
