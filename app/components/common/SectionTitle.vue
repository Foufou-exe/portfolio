<template>
  <div class="mb-12 text-center">
    <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="mt-4 text-lg text-muted-foreground">
      {{ subtitle }}
    </p>
    <Separator class="mx-auto mt-6 w-24" />
  </div>
</template>

<script lang="ts" setup>
import { Separator } from '~/components/ui/separator'

defineProps<{
  title: string
  subtitle?: string
}>()
</script>
