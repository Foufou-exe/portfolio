<template>
  <div
    :class="[
      'bento-card group relative overflow-hidden rounded-xl transition-all duration-500 cursor-pointer',
      sizeClasses,
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    ]"
    :style="{ animationDelay: `${index * 0.1}s` }"
    @click="$emit('openDetails', repo)"
  >
    <!-- Gradient Border Effect -->
    <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

    <!-- Card Content -->
    <div class="relative h-full rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/5">
      <!-- Project Image / Fallback Banner -->
      <div
        :class="[
          'relative overflow-hidden rounded-t-xl',
          size === 'large' ? 'h-36' : 'h-24',
        ]"
      >
        <!-- Custom social preview image -->
        <NuxtImg
          v-if="repo.hasCustomImage && repo.imageUrl"
          :src="repo.imageUrl"
          :alt="repo.name"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <!-- Gradient fallback banner -->
        <div
          v-else
          class="flex h-full w-full items-center justify-center"
          :style="{
            background: `linear-gradient(135deg, ${languageColor}33 0%, ${languageColor}11 50%, ${languageColor}22 100%)`,
          }"
        >
          <div class="flex items-center gap-3 px-4">
            <span
              class="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold"
              :style="{ backgroundColor: languageColor, color: '#fff' }"
            >
              {{ repo.language ? repo.language.charAt(0) : '#' }}
            </span>
            <span class="text-sm font-semibold text-foreground/70 truncate max-w-[200px]">
              {{ formatRepoName(repo.name) }}
            </span>
          </div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent"></div>

        <!-- Badges overlay -->
        <div class="absolute bottom-2 left-4 right-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Badge v-if="repo.isPinned" variant="secondary" class="bg-primary/90 text-primary-foreground text-xs">
              <Pin class="mr-1 h-3 w-3" />
              {{ $t('projects.pinnedBadge') }}
            </Badge>
            <Badge v-else-if="repo.isRecent" variant="default" class="bg-green-500/90 text-xs">
              <Zap class="mr-1 h-3 w-3" />
              {{ $t('projects.recentBadge') }}
            </Badge>
          </div>
          <span v-if="repo.language" class="flex items-center gap-1.5 rounded-full bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
            <span
              class="h-2 w-2 rounded-full"
              :style="{ backgroundColor: languageColor }"
            ></span>
            {{ repo.language }}
          </span>
        </div>
      </div>

      <div :class="['flex flex-col p-5', size === 'large' ? 'h-[calc(100%-144px)]' : 'h-[calc(100%-96px)]']">
        <!-- Top Row: Title + Badges -->
        <div class="mb-3 flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h3 class="truncate text-lg font-bold transition-colors group-hover:text-primary">
              {{ formatRepoName(repo.name) }}
            </h3>
            <div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{{ formatDate(repo.pushedAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p
          :class="[
            'text-sm text-muted-foreground transition-colors group-hover:text-foreground/80',
            size === 'large' ? 'line-clamp-3' : 'line-clamp-2',
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

        <!-- Footer: Stats + Contributors + Actions -->
        <div class="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
          <!-- Stats + Contributors -->
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

            <!-- Contributors Avatars -->
            <div v-if="repo.contributors && repo.contributors.length > 0" class="flex items-center -space-x-2">
              <TooltipProvider v-for="contributor in repo.contributors.slice(0, 4)" :key="contributor.login">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <img
                      :src="`${contributor.avatarUrl}&s=32`"
                      :alt="contributor.login"
                      class="h-6 w-6 rounded-full border-2 border-card ring-0 transition-transform hover:z-10 hover:scale-110"
                      loading="lazy"
                    />
                  </TooltipTrigger>
                  <TooltipContent>{{ contributor.login }}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span
                v-if="repo.contributors.length > 4"
                class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium"
              >
                +{{ repo.contributors.length - 4 }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0 transition-colors hover:text-primary"
                    @click.stop="$emit('openDetails', repo)"
                  >
                    <Eye class="h-4 w-4" />
                    <span class="sr-only">{{ $t('projects.details') }}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ $t('projects.details') }}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    v-if="repo.homepage"
                    variant="ghost"
                    size="sm"
                    as="a"
                    :href="repo.homepage"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="h-8 w-8 p-0 transition-colors hover:text-primary"
                    @click.stop
                  >
                    <ExternalLink class="h-4 w-4" />
                    <span class="sr-only">{{ $t('projects.viewDemo', { title: repo.name }) }}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ $t('projects.viewDemo', { title: repo.name }) }}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    variant="ghost"
                    size="sm"
                    as="a"
                    :href="repo.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="h-8 w-8 p-0 transition-colors hover:text-primary"
                    @click.stop
                  >
                    <Github class="h-4 w-4" />
                    <span class="sr-only">{{ $t('projects.viewSourceCode', { title: repo.name }) }}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ $t('projects.viewSourceCode', { title: repo.name }) }}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <!-- Hover Glow Effect -->
      <div class="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Star, GitFork, Github, ExternalLink, Zap, Pin, Eye } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import type { GitHubRepo } from '~/data/portfolio'
import { getLanguageColor } from '~/utils/languageColors'
import { formatRepoName, formatRelativeDate } from '~/utils/formatters'

const props = defineProps<{
  repo: GitHubRepo
  size: 'large' | 'medium' | 'small'
  index: number
  isVisible: boolean
}>()

defineEmits<{
  openDetails: [repo: GitHubRepo]
}>()

const languageColor = computed(() =>
  props.repo.language ? getLanguageColor(props.repo.language) : '#6b7280',
)

// Classes de taille pour le Bento Grid
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'large':
      return 'md:col-span-2 md:row-span-1'
    case 'medium':
    case 'small':
      return 'col-span-1 row-span-1'
    default:
      return 'col-span-1'
  }
})

// Nombre de topics a afficher selon la taille
const maxTopics = computed(() => props.size === 'large' ? 6 : 3)

const displayedTopics = computed(() =>
  props.repo.topics.slice(0, maxTopics.value),
)

// Formatter la date relative avec i18n
const { locale } = useI18n()

const formatDate = (dateString: string): string => {
  return formatRelativeDate(dateString, locale.value)
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
