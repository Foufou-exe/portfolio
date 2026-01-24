<template>
  <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
    <!-- Background gradient -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/10 blur-3xl" ></div>
      <div class="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-primary/5 blur-3xl" ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center">
      <!-- Error code -->
      <h1 class="animate-float text-[8rem] font-bold leading-none tracking-tighter text-primary/20 sm:text-[12rem]">
        {{ error?.statusCode || 500 }}
      </h1>

      <!-- Error message -->
      <div class="-mt-8 space-y-4 sm:-mt-12">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
          {{ errorTitle }}
        </h2>
        <p class="mx-auto max-w-md text-muted-foreground">
          {{ errorDescription }}
        </p>
      </div>

      <!-- Actions -->
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="lg" class="glow-sm" @click="handleGoHome">
          <Home class="mr-2 h-4 w-4" />
          {{ $t('error.backHome') }}
        </Button>
      </div>

      <!-- Debug info (dev only) -->
      <div v-if="isDev && error?.message" class="mx-auto mt-12 max-w-2xl">
        <details class="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left">
          <summary class="cursor-pointer text-sm font-medium text-destructive">
            {{ $t('error.details') }}
          </summary>
          <pre class="mt-4 overflow-auto text-xs text-muted-foreground">{{ error.message }}</pre>
          <pre v-if="error.stack" class="mt-2 overflow-auto text-xs text-muted-foreground/60">{{ error.stack }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Home } from 'lucide-vue-next'
import type { NuxtError } from '#app'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()
const isDev = process.env.NODE_ENV === 'development'

const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return t('error.404.title')
    case 403:
      return t('error.403.title')
    case 500:
      return t('error.500.title')
    default:
      return t('error.default.title')
  }
})

const errorDescription = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return t('error.404.description')
    case 403:
      return t('error.403.description')
    case 500:
      return t('error.500.description')
    default:
      return t('error.default.description')
  }
})

function handleGoHome() {
  clearError({ redirect: '/' })
}

</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>
