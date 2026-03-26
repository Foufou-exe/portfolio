<template>
  <div class="flex items-center gap-1">
    <TooltipProvider>
      <Tooltip v-for="link in socialLinks" :key="link.name">
        <TooltipTrigger as-child>
          <Button
            :variant="variant"
            :size="size"
            as="a"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <component :is="getIcon(link.icon)" class="h-5 w-5" />
            <span class="sr-only">{{ link.name }}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ link.name }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<script lang="ts" setup>
import { Github, Linkedin, Twitter, Mail, Globe } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { socialLinks } from '~/data/portfolio'
import type { Component } from 'vue'

withDefaults(defineProps<{
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}>(), {
  variant: 'ghost',
  size: 'icon',
})

const iconMap: Record<string, Component> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  globe: Globe,
}

function getIcon(iconName: string): Component {
  return iconMap[iconName] || Globe
}
</script>
