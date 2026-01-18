<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <button
        class="skill-node group relative flex items-center justify-center rounded-full border-2 border-transparent bg-background/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary/50 hover:shadow-lg"
        :class="sizeClasses"
        :style="nodeStyle"
        type="button"
      >
        <span 
          class="font-medium transition-colors duration-300 group-hover:text-primary"
          :class="textSizeClass"
        >
          {{ skill.name }}
        </span>
        
        <!-- Level indicator dots -->
        <div class="absolute -bottom-1 flex gap-0.5">
          <span
            v-for="i in 5"
            :key="i"
            class="h-1 w-1 rounded-full transition-all duration-300"
            :class="i <= skill.level ? 'bg-primary' : 'bg-muted-foreground/30'"
          />
        </div>

        <!-- Glow effect on hover -->
        <div 
          class="absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30"
          :style="{ backgroundColor: skill.color || 'hsl(var(--primary))' }"
        />
      </button>
    </HoverCardTrigger>
    
    <HoverCardContent class="w-64" :side="hoverSide" :align="hoverAlign">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-semibold">{{ skill.name }}</h4>
          <Badge variant="outline" class="text-xs capitalize">
            {{ categoryLabel }}
          </Badge>
        </div>
        
        <p class="text-sm text-muted-foreground">
          {{ skill.description }}
        </p>
        
        <!-- Level bar -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground">Niveau</span>
            <span class="font-medium">{{ levelLabel }}</span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div 
              class="h-full rounded-full transition-all duration-500"
              :style="{ 
                width: `${(skill.level / 5) * 100}%`,
                backgroundColor: skill.color || 'hsl(var(--primary))'
              }"
            />
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card'
import { Badge } from '~/components/ui/badge'
import type { Skill } from '~/data/portfolio'

const props = withDefaults(defineProps<{
  skill: Skill
  hoverSide?: 'top' | 'right' | 'bottom' | 'left'
  hoverAlign?: 'start' | 'center' | 'end'
}>(), {
  hoverSide: 'top',
  hoverAlign: 'center',
})

// Taille basee sur le niveau (1-5)
const sizeClasses = computed(() => {
  const sizes: Record<number, string> = {
    1: 'h-14 w-14 min-w-14',
    2: 'h-16 w-16 min-w-16',
    3: 'h-20 w-20 min-w-20',
    4: 'h-24 w-24 min-w-24',
    5: 'h-28 w-28 min-w-28',
  }
  return sizes[props.skill.level] || sizes[3]
})

const textSizeClass = computed(() => {
  const sizes: Record<number, string> = {
    1: 'text-[10px]',
    2: 'text-xs',
    3: 'text-xs',
    4: 'text-sm',
    5: 'text-sm',
  }
  return sizes[props.skill.level] || sizes[3]
})

const nodeStyle = computed(() => ({
  '--skill-color': props.skill.color || 'hsl(var(--primary))',
}))

const categoryLabel = computed(() => {
  const labels: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    devops: 'DevOps',
  }
  return labels[props.skill.category] || props.skill.category
})

const levelLabel = computed(() => {
  const labels: Record<number, string> = {
    1: 'Debutant',
    2: 'Junior',
    3: 'Intermediaire',
    4: 'Avance',
    5: 'Expert',
  }
  return labels[props.skill.level] || 'Intermediaire'
})
</script>

<style scoped>
.skill-node {
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.1);
}

.skill-node:hover {
  box-shadow: 
    0 4px 20px -4px var(--skill-color, hsl(var(--primary) / 0.3)),
    0 0 0 1px var(--skill-color, hsl(var(--primary) / 0.2));
}
</style>
