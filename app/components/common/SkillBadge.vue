<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <Badge 
        :variant="variant" 
        class="cursor-pointer transition-transform hover:scale-105"
      >
        {{ skill.name }}
      </Badge>
    </HoverCardTrigger>
    <HoverCardContent class="w-64">
      <div class="space-y-2">
        <h4 class="text-sm font-semibold">{{ skill.name }}</h4>
        <p class="text-sm text-muted-foreground">
          {{ skill.description }}
        </p>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<script lang="ts" setup>
import { Badge } from '~/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~/components/ui/hover-card'
import type { Skill } from '~/data/portfolio'

withDefaults(defineProps<{
  skill: Skill
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}>(), {
  variant: 'secondary',
})
</script>
