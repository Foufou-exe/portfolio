<template>
  <TooltipProvider :delay-duration="0">
    <Tooltip v-model:open="isTooltipOpen">
      <TooltipTrigger as-child>
        <span
          class="logo relative inline-flex items-center cursor-pointer select-none"
          @click="handleClick"
        >
          <!-- SVG animé côté client uniquement -->
          <ClientOnly>
            <AnimatedLogoSVG ref="logoSVGRef" :size="size" />

            <!-- Fallback texte pour SSR -->
            <template #fallback>
              <span class="logo-fallback font-mono whitespace-nowrap">
                <span class="text-primary font-bold">{</span><!--
                -->:<span class="text-primary font-bold">}</span>
              </span>
            </template>
          </ClientOnly>
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" :side-offset="8">
        {{ currentMessage }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLogoTooltip } from '~/composables/useLogoTooltip'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import AnimatedLogoSVG from '~/components/common/AnimatedLogoSVG.vue'

withDefaults(defineProps<{
  size?: number
}>(), {
  size: 40,
})

const logoSVGRef = ref<InstanceType<typeof AnimatedLogoSVG> | null>(null)
const { currentMessage, isTooltipOpen, triggerClickMessage } = useLogoTooltip()

function handleClick() {
  triggerClickMessage()
  logoSVGRef.value?.animations.shake()
}
</script>

<style scoped>
.logo {
  font-size: inherit;
  line-height: 1;
}

.logo-fallback {
  font-size: inherit;
}
</style>
