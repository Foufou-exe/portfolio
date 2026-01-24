<template>
  <div class="timeline-item group relative flex gap-6">
    <!-- Timeline line and dot -->
    <div class="relative flex flex-col items-center">
      <!-- Dot -->
      <div 
        class="relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-300"
        :class="isCurrent 
          ? 'border-primary bg-primary' 
          : 'border-muted-foreground/50 bg-background group-hover:border-primary'"
      >
        <span 
          v-if="isCurrent" 
          class="absolute h-6 w-6 animate-ping rounded-full bg-primary/30"
        ></span>
      </div>
      <!-- Line -->
      <div 
        v-if="!isLast"
        class="h-full w-0.5 bg-border"
      ></div>
    </div>

    <!-- Content -->
    <div class="flex-1 pb-8">
      <!-- Year badge -->
      <Badge variant="outline" class="mb-3">
        {{ year }}
      </Badge>

      <!-- Card -->
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Card 
            class="cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-md"
          >
            <CardContent class="p-4">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <!-- Icon + Title -->
                  <div class="flex items-center gap-2">
                    <div 
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      :class="iconBgClass"
                    >
                      <component :is="icon" class="h-4 w-4" :class="iconClass" />
                    </div>
                    <div>
                      <h3 class="font-semibold leading-tight">{{ title }}</h3>
                      <!-- Establishment with HoverCard -->
                      <HoverCard v-if="establishment">
                        <HoverCardTrigger as-child>
                          <button class="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors text-left">
                            {{ subtitle }}
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent class="w-80" align="start">
                          <div class="flex gap-4">
                            <!-- Logo -->
                            <div v-if="establishment.logo" class="shrink-0">
                              <img 
                                :src="establishment.logo" 
                                :alt="establishment.name"
                                width="48"
                                height="48"
                                loading="lazy"
                                decoding="async"
                                class="h-12 w-12 rounded-md object-cover"
                              />
                            </div>
                            <div v-else class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
                              <Building2 class="h-6 w-6 text-muted-foreground" />
                            </div>
                            <!-- Info -->
                            <div class="flex-1 space-y-1">
                              <h4 class="text-sm font-semibold">{{ establishment.name }}</h4>
                              <p v-if="establishment.description" class="text-xs text-muted-foreground line-clamp-2">
                                {{ establishment.description }}
                              </p>
                            </div>
                          </div>
                          <!-- Meta -->
                          <div class="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span v-if="establishment.industry" class="flex items-center gap-1">
                              <Building2 class="h-3 w-3" />
                              {{ establishment.industry }}
                            </span>
                            <span v-if="establishment.size" class="flex items-center gap-1">
                              <Users class="h-3 w-3" />
                              {{ establishment.size }}
                            </span>
                            <span v-if="establishment.location" class="flex items-center gap-1">
                              <MapPin class="h-3 w-3" />
                              {{ establishment.location }}
                            </span>
                          </div>
                          <!-- Website link -->
                          <a 
                            v-if="establishment.website"
                            :href="establishment.website"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink class="h-3 w-3" />
                            {{ t('establishment.visitWebsite') }}
                          </a>
                        </HoverCardContent>
                      </HoverCard>
                      <!-- Fallback without HoverCard -->
                      <p v-else class="text-sm text-muted-foreground">{{ subtitle }}</p>
                    </div>
                  </div>
                  
                  <!-- Location & Period -->
                  <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <MapPin class="h-3 w-3" />
                      {{ location }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Calendar class="h-3 w-3" />
                      {{ period }}
                    </span>
                    <Badge v-if="contractType" variant="secondary" class="text-xs">
                      {{ t(`experience.contractType.${contractType}`) }}
                    </Badge>
                  </div>

                  <!-- Truncated description -->
                  <p class="mt-3 line-clamp-2 text-sm text-muted-foreground">
                    {{ description }}
                  </p>
                </div>

                <!-- See more -->
                <Button variant="ghost" size="sm" class="shrink-0">
                  {{ t('experience.seeMore') }}
                  <ChevronRight class="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent class="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <div class="flex items-center gap-3">
              <div 
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                :class="iconBgClass"
              >
                <component :is="icon" class="h-6 w-6" :class="iconClass" />
              </div>
              <div>
                <DialogTitle class="text-xl">{{ title }}</DialogTitle>
                <DialogDescription as="div" class="flex flex-wrap items-center gap-2">
                  <!-- Establishment with HoverCard in Dialog -->
                  <HoverCard v-if="establishment">
                    <HoverCardTrigger as-child>
                      <button class="text-muted-foreground hover:text-primary hover:underline transition-colors text-left">
                        {{ subtitle }}
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent class="w-80" align="start">
                      <div class="flex gap-4">
                        <!-- Logo -->
                        <div v-if="establishment.logo" class="shrink-0">
                          <img 
                            :src="establishment.logo" 
                            :alt="establishment.name"
                            width="48"
                            height="48"
                            loading="lazy"
                            decoding="async"
                            class="h-12 w-12 rounded-md object-cover"
                          />
                        </div>
                        <div v-else class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
                          <Building2 class="h-6 w-6 text-muted-foreground" />
                        </div>
                        <!-- Info -->
                        <div class="flex-1 space-y-1">
                          <h4 class="text-sm font-semibold">{{ establishment.name }}</h4>
                          <p v-if="establishment.description" class="text-xs text-muted-foreground line-clamp-2">
                            {{ establishment.description }}
                          </p>
                        </div>
                      </div>
                      <!-- Meta -->
                      <div class="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span v-if="establishment.industry" class="flex items-center gap-1">
                          <Building2 class="h-3 w-3" />
                          {{ establishment.industry }}
                        </span>
                        <span v-if="establishment.size" class="flex items-center gap-1">
                          <Users class="h-3 w-3" />
                          {{ establishment.size }}
                        </span>
                        <span v-if="establishment.location" class="flex items-center gap-1">
                          <MapPin class="h-3 w-3" />
                          {{ establishment.location }}
                        </span>
                      </div>
                      <!-- Website link -->
                      <a 
                        v-if="establishment.website"
                        :href="establishment.website"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink class="h-3 w-3" />
                        {{ t('establishment.visitWebsite') }}
                      </a>
                    </HoverCardContent>
                  </HoverCard>
                  <!-- Fallback without HoverCard -->
                  <span v-else>{{ subtitle }}</span>
                  <Badge v-if="isCurrent" variant="default" class="ml-2">
                    {{ t('experience.current') }}
                  </Badge>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div class="space-y-6 py-4">
            <!-- Meta info -->
            <div class="flex flex-wrap gap-4 text-sm">
              <div class="flex items-center gap-2 text-muted-foreground">
                <MapPin class="h-4 w-4" />
                {{ location }}
              </div>
              <div class="flex items-center gap-2 text-muted-foreground">
                <Calendar class="h-4 w-4" />
                {{ period }}
              </div>
              <Badge v-if="contractType" variant="secondary">
                {{ t(`experience.contractType.${contractType}`) }}
              </Badge>
            </div>

            <!-- Description -->
            <div>
              <h4 class="mb-2 font-semibold">{{ t('experience.description') }}</h4>
              <p class="text-muted-foreground leading-relaxed">
                {{ description }}
              </p>
            </div>

            <!-- Achievements -->
            <div v-if="achievements && achievements.length > 0">
              <h4 class="mb-3 font-semibold">{{ t('experience.achievements') }}</h4>
              <ul class="space-y-2">
                <li 
                  v-for="(achievement, index) in achievements" 
                  :key="index"
                  class="flex items-start gap-3 text-muted-foreground"
                >
                  <CheckCircle class="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span>{{ achievement }}</span>
                </li>
              </ul>
            </div>

            <!-- Technologies/Skills -->
            <div v-if="tags && tags.length > 0">
              <h4 class="mb-3 font-semibold">
                {{ type === 'education' ? t('education.skills') : t('experience.technologies') }}
              </h4>
              <div class="flex flex-wrap gap-2">
                <Badge 
                  v-for="tag in tags" 
                  :key="tag" 
                  variant="secondary"
                >
                  {{ tag }}
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose as-child>
              <Button variant="outline">{{ t('experience.close') }}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Briefcase, GraduationCap, MapPin, Calendar, ChevronRight, CheckCircle, Building2, Users, ExternalLink } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/components/ui/hover-card'
import type { Establishment } from '~/data/portfolio'

const props = withDefaults(defineProps<{
  type: 'experience' | 'education'
  title: string
  subtitle: string
  location: string
  period: string
  year: string
  description: string
  achievements?: string[]
  tags?: string[]
  isCurrent?: boolean
  isLast?: boolean
  contractType?: 'cdi' | 'cdd' | 'alternance' | 'stage' | 'freelance' | 'interim'
  establishment?: Establishment
}>(), {
  isCurrent: false,
  isLast: false,
  achievements: () => [],
  tags: () => [],
  contractType: undefined,
  establishment: undefined,
})

const { t } = useI18n()

const isDialogOpen = ref(false)

const icon = computed(() => props.type === 'education' ? GraduationCap : Briefcase)

const iconBgClass = computed(() => 
  props.type === 'education' 
    ? 'bg-amber-500/10' 
    : 'bg-primary/10',
)

const iconClass = computed(() => 
  props.type === 'education' 
    ? 'text-amber-600 dark:text-amber-400' 
    : 'text-primary',
)
</script>

<style scoped>
.timeline-item:last-child .h-full {
  display: none;
}
</style>
