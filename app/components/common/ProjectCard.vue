<template>
  <div 
    ref="cardRef"
    class="tilt-card"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <Card 
      class="tilt-card-inner group relative overflow-hidden py-0 transition-all duration-300"
      :style="cardStyle"
    >
      <!-- Shine effect overlay -->
      <div 
        class="tilt-card-shine pointer-events-none absolute inset-0 z-10 rounded-lg"
        :style="shineStyle"
      />

      <!-- Image du projet -->
      <div class="relative aspect-video overflow-hidden">
        <!-- Skeleton loader -->
        <div 
          v-if="!imageLoaded" 
          class="skeleton absolute inset-0"
        />
        <img
          :src="project.image"
          :alt="project.title"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          :class="{ 'opacity-0': !imageLoaded }"
          @load="imageLoaded = true"
        />
        <div v-if="project.featured" class="absolute right-2 top-2 z-20">
          <Badge variant="default" class="border-0 bg-primary/90 backdrop-blur-sm">
            <Star class="mr-1 h-3 w-3" />
            Featured
          </Badge>
        </div>
        <!-- Gradient overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <CardHeader class="relative z-10">
        <CardTitle class="line-clamp-1 transition-colors group-hover:text-primary">
          {{ project.title }}
        </CardTitle>
        <CardDescription class="line-clamp-2">
          {{ project.description }}
        </CardDescription>
      </CardHeader>

      <CardContent class="relative z-10">
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

      <CardFooter class="relative z-10 gap-2 p-5">
        <!-- Bouton pour voir les details (Dialog) -->
        <Dialog>
          <DialogTrigger as-child>
            <Button variant="default" size="sm" class="flex-1 glow-sm">
              <Eye class="mr-2 h-4 w-4" />
              Details
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-2xl">
            <DialogHeader>
              <DialogTitle class="text-xl">{{ project.title }}</DialogTitle>
              <DialogDescription>
                {{ project.description }}
              </DialogDescription>
            </DialogHeader>
            
            <div class="space-y-4">
              <!-- Image -->
              <div class="aspect-video overflow-hidden rounded-lg">
                <img
                  :src="project.image"
                  :alt="project.title"
                  class="h-full w-full object-cover"
                />
              </div>

              <!-- Description longue -->
              <div class="prose prose-sm dark:prose-invert max-w-none">
                <p class="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {{ project.longDescription }}
                </p>
              </div>

              <!-- Tags -->
              <div>
                <h4 class="mb-2 text-sm font-semibold">Technologies</h4>
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
                  Voir le projet
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
                  Code source
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

defineProps<{
  project: Project
}>()

const cardRef = ref<HTMLElement | null>(null)
const imageLoaded = ref(false)
const isHovered = ref(false)
const mouseX = ref(50)
const mouseY = ref(50)
const rotateX = ref(0)
const rotateY = ref(0)

const cardStyle = computed(() => {
  if (!isHovered.value) {
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    }
  }
  return {
    transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
    boxShadow: `
      0 25px 50px -12px oklch(0.7 0.2 285 / 25%),
      ${rotateY.value * 2}px ${rotateX.value * -2}px 30px -15px oklch(0.7 0.2 285 / 20%)
    `,
  }
})

const shineStyle = computed(() => ({
  background: `radial-gradient(circle at ${mouseX.value}% ${mouseY.value}%, oklch(1 0 0 / 15%), transparent 50%)`,
  opacity: isHovered.value ? 1 : 0,
}))

function handleMouseMove(e: MouseEvent) {
  if (!cardRef.value) return
  
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  mouseX.value = (x / rect.width) * 100
  mouseY.value = (y / rect.height) * 100
  
  // Calculate rotation (max 10 degrees)
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  rotateY.value = ((x - centerX) / centerX) * 8
  rotateX.value = ((centerY - y) / centerY) * 8
}

function handleMouseEnter() {
  isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
  rotateX.value = 0
  rotateY.value = 0
  mouseX.value = 50
  mouseY.value = 50
}
</script>

<style scoped>
.tilt-card {
  perspective: 1000px;
}

.tilt-card-inner {
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out, box-shadow 0.3s ease;
}

.tilt-card-shine {
  transition: opacity 0.3s ease;
}
</style>
