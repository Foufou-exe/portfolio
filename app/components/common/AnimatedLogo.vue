<template>
  <span
    ref="logoRef"
    class="logo inline-block cursor-pointer select-none font-mono whitespace-nowrap"
  >
    <span class="logo__head text-primary font-bold">{</span><!--
    --><span class="logo__eyes">{{ currentEyes }}</span><!--
    --><span class="logo__mouth text-primary font-bold">{{ currentMouth }}</span>
  </span>
</template>

<script lang="ts" setup>
import { useAnimatedLogo } from '~/composables/useAnimatedLogo'

const { logoRef, currentEyes, currentMouth } = useAnimatedLogo()
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
