<template>
  <div
    class="stat-card group flex flex-col items-center justify-center rounded-xl border bg-card p-4 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-md"
  >
    <div
      class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20"
    >
      <component :is="iconComponent" class="h-5 w-5 text-primary" />
    </div>
    <div
      class="text-2xl font-bold tracking-tight text-foreground transition-transform duration-300 group-hover:scale-110"
    >
      {{ stat.value }}
    </div>
    <div class="text-xs text-muted-foreground">
      {{ stat.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Calendar, Folder, Code, Coffee, Award, Users, Zap, Globe } from 'lucide-vue-next'
import type { Stat } from '~/data/portfolio'

const props = defineProps<{
  stat: Stat
}>()

const iconMap: Record<string, typeof Calendar> = {
  calendar: Calendar,
  folder: Folder,
  code: Code,
  coffee: Coffee,
  award: Award,
  users: Users,
  zap: Zap,
  globe: Globe,
}

const iconComponent = computed(() => {
  return iconMap[props.stat.icon || 'code'] || Code
})
</script>

<style scoped>
.stat-card {
  min-height: 100px;
}
</style>
