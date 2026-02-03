<template>
  <TooltipProvider :delay-duration="0">
    <Tooltip v-model:open="isTooltipOpen">
      <TooltipTrigger as-child>
        <span
          ref="logoRef"
          class="logo relative inline-block cursor-pointer select-none font-mono whitespace-nowrap"
          @click="handleClick"
        >
          <span class="logo__head text-primary font-bold rotate-90">{</span><!--
          --><span ref="eyesRef" class="logo__eyes">{{ currentEyes }}</span><!--
          --><span ref="mouthRef" class="logo__mouth text-primary font-bold">{{ currentMouth }}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" :side-offset="8">
        {{ currentMessage }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<script lang="ts" setup>
import { useAnimatedLogo } from '~/composables/useAnimatedLogo'
import { useLogoTooltip } from '~/composables/useLogoTooltip'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'

const { currentEyes, currentMouth, handleLogoClick, animations } = useAnimatedLogo()
const { currentMessage, isTooltipOpen, triggerClickMessage } = useLogoTooltip()

function handleClick() {
  handleLogoClick()
  triggerClickMessage()
  animations.shake()
}
</script>

<style scoped>
.logo {
  font-size: inherit;
  line-height: 1;
}

.logo__eyes {
  display: inline-block;
  width: 2ch;
  text-align: center;
  transition: transform 75ms ease-out;
}

.logo__mouth {
  transition: transform 150ms ease-out;
}

.logo:hover .logo__head {
  color: hsl(var(--primary) / 0.8);
}

.logo:active .logo__eyes,
.logo:active .logo__mouth {
  transform: scale(0.95);
}
</style>
