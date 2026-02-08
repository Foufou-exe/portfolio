<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      isScrolled
        ? 'bg-background/80 backdrop-blur-md border-b shadow-sm'
        : 'bg-transparent',
    ]"
  >
    <nav class="container mx-auto flex h-16 items-center justify-between px-4">
      <!-- Logo animé -->
      <a
        href="#"
        class="text-xl font-bold tracking-tight transition-colors"
        @click.prevent="scrollToTop"
      >
        <AnimatedLogo />
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden items-center gap-1 md:flex">
        <Button
          v-for="link in translatedNavLinks"
          :key="link.href"
          variant="ghost"
          size="sm"
          as="a"
          :href="link.href"
          @click.prevent="scrollToSection(link.href)"
        >
          {{ link.name }}
        </Button>
      </div>

      <!-- Actions (Desktop & Mobile) -->
      <div class="flex items-center gap-2">
        <!-- Language Toggle -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon" @click="toggleLocale">
                <span class="text-sm font-semibold">{{ locale === 'fr' ? 'EN' : 'FR' }}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ $t('nav.switchLanguage') }}</p>
            </TooltipContent>
          </Tooltip>

          <ClientOnly>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="ghost" size="icon" @click="toggleColorMode">
                  <Sun v-if="colorMode.value === 'dark'" class="h-5 w-5" />
                  <Moon v-else class="h-5 w-5" />
                </Button>
                <template #fallback>
                  <Button variant="ghost" size="icon" disabled>
                    <Sun class="h-5 w-5" />
                  </Button>
                </template>
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ $t('common.toggleTheme') }}</p>
              </TooltipContent>
            </Tooltip>
          </ClientOnly>

          <!-- Theme Toggle -->
        </TooltipProvider>

        <!-- Mobile Menu (Sheet) -->
        <Sheet v-model:open="isMenuOpen">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="md:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">{{ $t('nav.menu') }}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-72">
            <SheetHeader>
              <SheetTitle>{{ $t('nav.navigation') }}</SheetTitle>
              <SheetDescription>
                {{ $t('nav.mobileDescription') }}
              </SheetDescription>
            </SheetHeader>
            <div class="mt-6 flex flex-col gap-2">
              <Button
                v-for="link in translatedNavLinks"
                :key="link.href"
                variant="ghost"
                class="justify-start"
                as="a"
                :href="link.href"
                @click="handleMobileNavClick(link.href)"
              >
                {{ link.name }}
              </Button>
              <Separator class="my-4" />
              <SocialLinks variant="outline" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { Menu, Moon, Sun } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import SocialLinks from '~/components/common/SocialLinks.vue'
import AnimatedLogo from '~/components/common/AnimatedLogo.vue'

const { locale, setLocale } = useI18n()
const colorMode = useColorMode()
const isScrolled = ref(false)
const isMenuOpen = ref(false)

const { translatedNavLinks } = useNavLinks()
const { scrollToSection, scrollToTop } = useScrollToSection()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function toggleLocale() {
  setLocale(locale.value === 'fr' ? 'en' : 'fr')
}

function handleMobileNavClick(href: string) {
  isMenuOpen.value = false
  setTimeout(() => {
    scrollToSection(href)
  }, 300)
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
