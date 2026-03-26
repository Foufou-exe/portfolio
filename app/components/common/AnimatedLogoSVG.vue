<template>
  <div
    ref="containerRef"
    class="animated-logo-svg"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      ref="svgRef"
      :width="size"
      :height="size"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      class="text-primary"
    >
      <!-- Logo paths loaded dynamically from local static asset -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <g v-html="svgContent" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAnimatedLogoSVG } from '~/composables/useAnimatedLogoSVG'

withDefaults(defineProps<{ size?: number }>(), {
  size: 45,
})

const containerRef = ref<HTMLDivElement | null>(null)
const svgContent = ref('')

const { svgRef, eyeLeftRef, eyeRightRef, animations } = useAnimatedLogoSVG()

// Charger le contenu SVG et initialiser les refs sur les yeux
onMounted(async () => {
  try {
    const response = await fetch('/images/logo/logo.svg')
    const text = await response.text()

    // Extraire le contenu entre <svg> et </svg>
    const match = text.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
    if (match) {
      svgContent.value = match[1]
    }

    // Attendre le prochain tick pour que le DOM soit mis à jour
    await nextTick()

    // Récupérer les refs sur les yeux
    if (svgRef.value) {
      eyeLeftRef.value = svgRef.value.querySelector('#eye-left') as SVGPathElement
      eyeRightRef.value = svgRef.value.querySelector('#eye-right') as SVGPathElement
    }
  }
  catch (error) {
    console.error('[AnimatedLogoSVG] Failed to load SVG:', error)
  }
})

// Exposer les animations pour le parent
defineExpose({
  animations,
})
</script>

<style scoped>
.animated-logo-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.animated-logo-svg svg {
  display: block;
}

/* Les yeux ont un transform-origin centré pour le clignement */
.animated-logo-svg :deep(#eye-left),
.animated-logo-svg :deep(#eye-right) {
  transform-origin: center center;
  will-change: transform;
}
</style>
