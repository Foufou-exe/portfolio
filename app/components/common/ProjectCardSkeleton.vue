<template>
  <div
    :class="[
      'bento-card relative overflow-hidden rounded-xl',
      sizeClasses,
    ]"
  >
    <div class="relative h-full rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
      <!-- Header skeleton -->
      <div class="h-1.5 rounded-t-xl skeleton-shimmer bg-muted"></div>

      <div class="flex h-[calc(100%-6px)] flex-col p-5">
        <!-- Title + Badge skeleton -->
        <div class="mb-3 flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="skeleton-shimmer h-6 w-3/4 rounded bg-muted"></div>
            <div class="mt-2 flex items-center gap-2">
              <div class="skeleton-shimmer h-2.5 w-2.5 rounded-full bg-muted"></div>
              <div class="skeleton-shimmer h-3 w-16 rounded bg-muted"></div>
              <div class="skeleton-shimmer h-3 w-20 rounded bg-muted"></div>
            </div>
          </div>
          <div class="skeleton-shimmer h-5 w-16 rounded-full bg-muted"></div>
        </div>

        <!-- Description skeleton -->
        <div class="space-y-2">
          <div class="skeleton-shimmer h-4 w-full rounded bg-muted"></div>
          <div class="skeleton-shimmer h-4 w-5/6 rounded bg-muted"></div>
          <div v-if="size === 'large'" class="skeleton-shimmer h-4 w-4/6 rounded bg-muted"></div>
        </div>

        <!-- Topics skeleton -->
        <div class="mt-auto pt-4">
          <div class="flex flex-wrap gap-1.5">
            <div class="skeleton-shimmer h-5 w-14 rounded-full bg-muted"></div>
            <div class="skeleton-shimmer h-5 w-18 rounded-full bg-muted"></div>
            <div class="skeleton-shimmer h-5 w-12 rounded-full bg-muted"></div>
            <div v-if="size === 'large'" class="skeleton-shimmer h-5 w-16 rounded-full bg-muted"></div>
          </div>
        </div>

        <!-- Footer skeleton -->
        <div class="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
          <div class="flex items-center gap-4">
            <div class="skeleton-shimmer h-4 w-8 rounded bg-muted"></div>
            <div class="skeleton-shimmer h-4 w-8 rounded bg-muted"></div>
          </div>
          <div class="flex items-center gap-2">
            <div class="skeleton-shimmer h-8 w-8 rounded bg-muted"></div>
            <div class="skeleton-shimmer h-8 w-8 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  size: 'large' | 'medium' | 'small'
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'large':
      return 'md:col-span-2 md:row-span-1'
    case 'medium':
    case 'small':
    default:
      return 'col-span-1 row-span-1'
  }
})
</script>

<style scoped>
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    oklch(0.7 0.2 285 / 15%),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
