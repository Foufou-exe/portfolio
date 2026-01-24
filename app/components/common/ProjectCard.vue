<template>
  <div class="gradient-border-card group">
    <Card
      class="relative overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1"
    >
      <!-- Image du projet -->
      <div class="relative aspect-video overflow-hidden">
        <!-- Fallback gradient background -->
        <div
          class="absolute inset-0 flex items-center justify-center"
          :style="{ background: `linear-gradient(135deg, ${projectColor} 0%, ${projectColorDark} 100%)` }"
        >
          <span class="text-2xl font-bold text-white/90 text-center px-4">{{ project.title }}</span>
        </div>

        <!-- Skeleton loader -->
        <div
          v-if="hasImage && !imageLoaded && !imageError"
          class="skeleton absolute inset-0 z-[1]"
        ></div>

        <!-- Image -->
        <img
          v-if="hasImage && !imageError"
          :src="project.image"
          :alt="project.title"
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
          class="relative z-[2] h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          :class="{ 'opacity-0': !imageLoaded }"
          @load="imageLoaded = true"
          @error="imageError = true"
        />

        <div v-if="project.featured" class="absolute right-2 top-2 z-20">
          <Badge variant="default" class="border-0 bg-primary/90 backdrop-blur-sm">
            <Star class="mr-1 h-3 w-3" />
            {{ t('projects.featuredBadge') }}
          </Badge>
        </div>
        <!-- Gradient overlay on hover -->
        <div class="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>

      <CardHeader class="relative z-20">
        <CardTitle class="line-clamp-1 transition-colors group-hover:text-primary">
          {{ project.title }}
        </CardTitle>
        <CardDescription class="line-clamp-2">
          {{ project.description }}
        </CardDescription>
      </CardHeader>

      <CardContent class="relative z-20">
        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5">
          <Badge
            v-for="tag in project.tags.slice(0, 4)"
            :key="tag"
            variant="outline"
            class="border-primary/20 text-xs transition-colors hover:border-primary/50 hover:bg-primary/10"
          >
            {{ tag }}
          </Badge>
          <Badge
            v-if="project.tags.length > 4"
            variant="outline"
            class="text-xs"
          >
            +{{ project.tags.length - 4 }}
          </Badge>
        </div>
      </CardContent>

      <CardFooter class="relative z-20 gap-2 p-5">
        <!-- Bouton pour voir les details (Dialog) -->
        <Dialog>
          <DialogTrigger as-child>
            <Button variant="default" size="sm" class="flex-1 glow-sm">
              <Eye class="mr-2 h-4 w-4" />
              {{ t('projects.details') }}
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-2xl">
            <DialogHeader>
              <DialogTitle class="text-xl">
                {{ project.title }}
              </DialogTitle>
              <DialogDescription>
                {{ project.description }}
              </DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
              <!-- Image -->
              <div v-if="hasImage" class="aspect-video overflow-hidden rounded-lg">
                <img
                  :src="project.image"
                  :alt="project.title"
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-cover"
                />
              </div>
              <div
                v-else
                class="aspect-video overflow-hidden rounded-lg flex items-center justify-center"
                :style="{ background: `linear-gradient(135deg, ${projectColor} 0%, ${projectColorDark} 100%)` }"
              >
                <span class="text-2xl font-bold text-white/90 text-center px-4">{{ project.title }}</span>
              </div>

              <!-- Description longue -->
              <div class="prose prose-sm dark:prose-invert max-w-none">
                <p class="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {{ project.longDescription }}
                </p>
              </div>

              <!-- Tags -->
              <div>
                <h4 class="mb-2 text-sm font-semibold">
                  {{ t('projects.technologies') }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <Badge v-for="tag in project.tags" :key="tag" variant="secondary">
                    {{ tag }}
                  </Badge>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-4">
                <Button
                  v-if="project.demoUrl"
                  as="a"
                  :href="project.demoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1"
                >
                  <ExternalLink class="mr-2 h-4 w-4" />
                  {{ t('projects.viewProject') }}
                </Button>
                <Button
                  v-if="project.sourceUrl"
                  variant="outline"
                  as="a"
                  :href="project.sourceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1"
                >
                  <Github class="mr-2 h-4 w-4" />
                  {{ t('projects.viewSource') }}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <!-- Lien direct vers demo -->
        <Button
          v-if="project.demoUrl"
          variant="outline"
          size="sm"
          class="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
          as="a"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('projects.viewDemo', { title: project.title })"
        >
          <ExternalLink class="h-4 w-4" />
        </Button>

        <!-- Lien vers GitHub -->
        <Button
          v-if="project.sourceUrl"
          variant="outline"
          size="sm"
          class="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
          as="a"
          :href="project.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('projects.viewSourceCode', { title: project.title })"
        >
          <Github class="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Eye, ExternalLink, Github, Star } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import type { Project } from '~/data/portfolio'

const props = defineProps<{
  project: Project
}>()

const { t } = useI18n()

const imageLoaded = ref(false)
const imageError = ref(false)

// Check if project has a valid image
const hasImage = computed(() => !!props.project.image && props.project.image.trim() !== '')

// Generate a consistent color based on project title
const projectColor = computed(() => {
  const colors = [
    'oklch(0.65 0.2 285)', // violet
    'oklch(0.65 0.2 200)', // blue
    'oklch(0.65 0.2 150)', // teal
    'oklch(0.65 0.2 330)', // pink
    'oklch(0.65 0.2 30)', // orange
  ]
  const index = props.project.title.length % colors.length
  return colors[index]
})

const projectColorDark = computed(() => {
  const colors = [
    'oklch(0.35 0.15 285)', // violet dark
    'oklch(0.35 0.15 200)', // blue dark
    'oklch(0.35 0.15 150)', // teal dark
    'oklch(0.35 0.15 330)', // pink dark
    'oklch(0.35 0.15 30)', // orange dark
  ]
  const index = props.project.title.length % colors.length
  return colors[index]
})
</script>

<style scoped>
.gradient-border-card {
  --gradient-angle: 0deg;
  position: relative;
  border-radius: var(--radius);
  background: linear-gradient(
    var(--gradient-angle),
    oklch(0.7 0.25 285),
    oklch(0.65 0.2 200),
    oklch(0.7 0.25 330),
    oklch(0.7 0.25 285)
  );
  padding: 2px;
  transition: box-shadow 0.3s ease;
}

.gradient-border-card:hover {
  animation: rotate-gradient 3s linear infinite;
  box-shadow:
    0 8px 30px -10px oklch(0.7 0.25 285 / 40%),
    0 4px 15px -5px oklch(0.65 0.2 200 / 30%);
}

.gradient-border-card > :deep(.card) {
  background: hsl(var(--card));
  border-radius: calc(var(--radius) - 2px);
  border: none;
}

@keyframes rotate-gradient {
  0% {
    --gradient-angle: 0deg;
  }
  100% {
    --gradient-angle: 360deg;
  }
}

@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
</style>
