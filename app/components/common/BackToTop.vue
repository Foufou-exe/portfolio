<template>
  <Transition name="fade-slide">
    <button
      v-show="isVisible"
      class="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-background/80 text-primary shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground hover:shadow-xl"
      :class="{ 'glow-sm': isVisible }"
      :aria-label="$t('common.backToTop')"
      @click="scrollToTop"
    >
      <ArrowUp class="h-5 w-5" />
    </button>
  </Transition>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

const isVisible = ref(false)
const threshold = 400

function handleScroll() {
  isVisible.value = window.scrollY > threshold
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
