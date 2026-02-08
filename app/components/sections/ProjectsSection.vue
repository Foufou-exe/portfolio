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

      <!-- Filtres -->
      <div v-if="!pending && !error && displayedRepos.length > 0" class="mb-8">
        <!-- Mobile: Filtres scrollables horizontalement -->
        <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <!-- Filtre par langage - scrollable sur mobile -->
          <div class="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 sm:pb-0">
            <Button
              v-for="lang in availableLanguages"
              :key="lang"
              :variant="lang === 'all' ? (!selectedLanguage ? 'default' : 'outline') : (selectedLanguage === lang ? 'default' : 'outline')"
              size="sm"
              class="shrink-0 transition-all"
              @click="selectedLanguage = lang === 'all' ? null : (selectedLanguage === lang ? null : lang)"
            >
              <span
                v-if="lang !== 'all'"
                class="mr-1.5 h-2 w-2 rounded-full"
                :style="{ backgroundColor: getLanguageColor(lang) }"
              ></span>
              {{ lang === 'all' ? $t('projects.filters.all') : lang }}
            </Button>
          </div>

          <!-- Tri - aligné à droite sur desktop -->
          <div class="flex items-center justify-center gap-2 sm:border-l sm:border-border/50 sm:pl-3">
            <Button
              :variant="sortBy === 'date' ? 'default' : 'ghost'"
              size="sm"
              @click="sortBy = 'date'"
            >
              <Calendar class="mr-1.5 h-3.5 w-3.5" />
              <span class="hidden xs:inline">{{ $t('projects.sortByDate') }}</span>
            </Button>
            <Button
              :variant="sortBy === 'stars' ? 'default' : 'ghost'"
              size="sm"
              @click="sortBy = 'stars'"
            >
              <Star class="mr-1.5 h-3.5 w-3.5" />
              <span class="hidden xs:inline">{{ $t('projects.sortByStars') }}</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Loading State - Skeletons -->
      <div v-if="pending" class="bento-grid mx-auto max-w-6xl">
        <ProjectCardSkeleton
          v-for="i in 5"
          :key="i"
          :size="getCardSize(i - 1)"
        />
      </div>

      <!-- Error State with Fallback -->
      <div v-else-if="error" class="mx-auto max-w-md">
        <Alert variant="destructive" class="mb-6">
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>{{ $t('projects.errorTitle') }}</AlertTitle>
          <AlertDescription>
            {{ $t('projects.errorLoading') }}
          </AlertDescription>
        </Alert>
        <div class="text-center">
          <Button variant="outline" @click="refresh()">
            <RefreshCw class="mr-2 h-4 w-4" />
            {{ $t('projects.retry') }}
          </Button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredRepos.length === 0 && displayedRepos.length > 0" class="py-12 text-center">
        <Filter class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p class="text-muted-foreground">
          {{ $t('projects.noResults') }}
        </p>
        <Button variant="ghost" class="mt-4" @click="resetFilters">
          {{ $t('projects.resetFilters') }}
        </Button>
      </div>

      <!-- Bento Grid Layout -->
      <div v-else class="bento-grid mx-auto max-w-6xl">
        <GitHubProjectCard
          v-for="(repo, index) in filteredRepos"
          :key="repo.id"
          :repo="repo"
          :size="getCardSize(index)"
          :index="index"
          :is-visible="isVisible"
          @open-details="openProjectModal"
        />
      </div>

      <!-- Stats GitHub -->
      <div v-if="!pending && !error && displayedRepos.length > 0" class="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-8 md:gap-12">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary sm:text-3xl">
            {{ totalStars }}
          </div>
          <div class="text-xs text-muted-foreground sm:text-sm">
            {{ $t('projects.totalStars') }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary sm:text-3xl">
            {{ displayedRepos.length }}
          </div>
          <div class="text-xs text-muted-foreground sm:text-sm">
            {{ $t('projects.recentProjects') }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary sm:text-3xl">
            {{ uniqueLanguages }}
          </div>
          <div class="text-xs text-muted-foreground sm:text-sm">
            {{ $t('projects.languages') }}
          </div>
        </div>
        <div v-if="pinnedCount > 0" class="text-center">
          <div class="text-2xl font-bold text-primary sm:text-3xl">
            {{ pinnedCount }}
          </div>
          <div class="text-xs text-muted-foreground sm:text-sm">
            {{ $t('projects.pinnedProjects') }}
          </div>
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
          rel="noopener noreferrer"
        >
          <Github class="mr-2 h-4 w-4" />
          {{ $t('projects.viewGithub') }}
        </Button>
      </div>
    </div>

    <!-- Project Detail Modal -->
    <Dialog v-model:open="isModalOpen">
      <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-3">
            <span
              class="h-3 w-3 rounded-full"
              :style="{ backgroundColor: selectedProject?.language ? getLanguageColor(selectedProject.language) : '#6b7280' }"
            ></span>
            {{ selectedProject ? formatRepoName(selectedProject.name) : '' }}
            <Badge v-if="selectedProject?.isPinned" variant="secondary" class="ml-2">
              <Pin class="mr-1 h-3 w-3" />
              {{ $t('projects.pinnedBadge') }}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {{ selectedProject?.description }}
          </DialogDescription>
        </DialogHeader>

        <!-- Project Image -->
        <div v-if="selectedProject?.imageUrl" class="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <NuxtImg
            :src="selectedProject.imageUrl"
            :alt="selectedProject.name"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- Project Details -->
        <div class="space-y-4">
          <!-- Stats -->
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2 text-sm">
              <Star class="h-4 w-4 text-yellow-500" />
              <span>{{ selectedProject?.stars }} {{ $t('projects.stars') }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <GitFork class="h-4 w-4 text-primary" />
              <span>{{ selectedProject?.forks }} {{ $t('projects.forks') }}</span>
            </div>
            <div v-if="selectedProject?.language" class="flex items-center gap-2 text-sm">
              <Code class="h-4 w-4" />
              <span>{{ selectedProject.language }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar class="h-4 w-4" />
              <span>{{ selectedProject ? formatFullDate(selectedProject.pushedAt, locale) : '' }}</span>
            </div>
          </div>

          <!-- Topics -->
          <div v-if="selectedProject?.topics && selectedProject.topics.length > 0">
            <h4 class="mb-2 text-sm font-medium">
              {{ $t('projects.technologies') }}
            </h4>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="topic in selectedProject.topics"
                :key="topic"
                variant="outline"
              >
                {{ topic }}
              </Badge>
            </div>
          </div>

          <!-- Contributors -->
          <div v-if="selectedProject?.contributors && selectedProject.contributors.length > 0">
            <h4 class="mb-2 text-sm font-medium">
              {{ $t('projects.contributors') }}
            </h4>
            <div class="flex flex-wrap gap-3">
              <a
                v-for="contributor in selectedProject.contributors"
                :key="contributor.login"
                :href="`https://github.com/${contributor.login}`"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 rounded-full border border-border/50 px-3 py-1.5 text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <img
                  :src="`${contributor.avatarUrl}&s=32`"
                  :alt="contributor.login"
                  class="h-5 w-5 rounded-full"
                  loading="lazy"
                />
                {{ contributor.login }}
              </a>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-3 pt-4">
            <Button
              as="a"
              :href="selectedProject?.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github class="mr-2 h-4 w-4" />
              {{ $t('projects.viewSource') }}
            </Button>
            <Button
              v-if="selectedProject?.homepage"
              variant="outline"
              as="a"
              :href="selectedProject.homepage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink class="mr-2 h-4 w-4" />
              {{ $t('projects.viewDemo') }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </section>
</template>

<script lang="ts" setup>
import { Github, RefreshCw, Star, GitFork, ExternalLink, Calendar, AlertCircle, Filter, Pin, Code } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import SectionTitle from '~/components/common/SectionTitle.vue'
import GitHubProjectCard from '~/components/common/GitHubProjectCard.vue'
import ProjectCardSkeleton from '~/components/common/ProjectCardSkeleton.vue'
import { socialLinks } from '~/data/portfolio'
import type { GitHubRepo } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'
import { getLanguageColor } from '~/utils/languageColors'
import { formatRepoName, formatFullDate } from '~/utils/formatters'

const { t, locale } = useI18n()
const { elementRef, isVisible } = useElementAnimation()

// Fetch GitHub repos depuis notre API
const { data, pending, error, refresh } = useFetch<{
  success: boolean
  data: GitHubRepo[]
  meta: { username: string, fetchedAt: string, count: number, cached?: boolean }
}>('/api/github/repos')

// Filtres et tri
const selectedLanguage = ref<string | null>(null)
const sortBy = ref<'date' | 'stars'>('date')

// Modal
const isModalOpen = ref(false)
const selectedProject = ref<GitHubRepo | null>(null)

// Repos à afficher
const displayedRepos = computed(() => data.value?.data || [])

// Langages disponibles
const availableLanguages = computed(() => {
  const languages = new Set(displayedRepos.value.map(r => r.language).filter(Boolean) as string[])
  return ['all', ...Array.from(languages).sort()]
})

// Repos filtrés et triés
const filteredRepos = computed(() => {
  let repos = [...displayedRepos.value]

  // Filtrer par langage
  if (selectedLanguage.value && selectedLanguage.value !== 'all') {
    repos = repos.filter(r => r.language === selectedLanguage.value)
  }

  // Trier
  if (sortBy.value === 'stars') {
    repos.sort((a, b) => b.stars - a.stars)
  }
  else {
    // Trier par date, mais garder les épinglés en premier
    repos.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
    })
  }

  return repos.slice(0, 6) // Limiter à 6 projets affichés
})

// Stats calculées
const totalStars = computed(() =>
  displayedRepos.value.reduce((sum, repo) => sum + repo.stars, 0),
)

const uniqueLanguages = computed(() => {
  const languages = new Set(displayedRepos.value.map(r => r.language).filter(Boolean))
  return languages.size
})

const pinnedCount = computed(() =>
  displayedRepos.value.filter(r => r.isPinned).length,
)

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

// Actions
const resetFilters = () => {
  selectedLanguage.value = null
  sortBy.value = 'date'
}

const openProjectModal = (repo: GitHubRepo) => {
  selectedProject.value = repo
  isModalOpen.value = true
}
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
