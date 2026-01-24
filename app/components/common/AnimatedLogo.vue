<template>
  <span
    ref="logoRef"
    class="logo-container inline-block cursor-pointer select-none font-mono"
    @mouseenter="onHover"
    @mouseleave="onLeave"
    @click="onClick"
  >
    <span class="logo-bracket text-primary">{</span>
    <span
      class="logo-face transition-all duration-150"
      :class="{ 'animate-bounce-subtle': isBouncing }"
      :style="eyeStyle"
    >{{ currentFace }}</span>
    <span class="logo-bracket text-primary">}</span>
  </span>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useColorMode, useMouse, useIdle, useWindowScroll } from '@vueuse/core'

// Expressions du logo - visages sympas et drôles
const faces = {
  // États normaux (idle)
  idle: [
    ':', // Normal
    ':)', // Content
    ';)', // Clin d'oeil
    ':D', // Grand sourire
    ':P', // Tire la langue
    ':3', // Kawaii
    'o:', // Auréole
    ':>', // Sourire malicieux
  ],
  // États au hover
  hover: [
    ':o', // Surpris
    ':O', // Très surpris
    'O_O', // Étonné
    ':?', // Curieux
    '*_*', // Impressionné
    '^_^', // Happy
  ],
  // États au clic
  click: [
    'xD', // Mort de rire
    'X)', // Fou rire
    ':*', // Bisou
    '<3', // Coeur
    '\\o/', // Celebration
    ':B', // Lunettes cool
    '8)', // Cool
  ],
  // États spéciaux (rares)
  special: [
    '?.?', // Confus
    '-_-', // Blasé
    'T_T', // Pleure de joie
    ':/', // Perplexe
  ],
  // États au scroll
  scroll: [
    'o.o', // Regarde passer
    '@_@', // Vertige
    '>.>', // Regarde à droite
    '<.<', // Regarde à gauche
    'x_x', // Étourdi
  ],
  // État endormi (inactivité)
  sleeping: [
    'zzZ',
    '-.-',
    '-.o',
    'z.z',
  ],
  // États au typing
  typing: [
    ':)', // Content
    ':D', // Intéressé
    'o.O', // Curieux
    ':o', // Attentif
    '*.*', // Fasciné
  ],
  // États selon le thème
  lightTheme: [
    ':)', // Sourire solaire
    ':D', // Content au soleil
    '^_^', // Joyeux
    '◡‿◡', // Zen
  ],
  darkTheme: [
    '-_-', // Mode nuit
    '._.',  // Calme
    'o_o', // Nocturne
    '•_•', // Discret
  ],
  // États de réveil (transition sommeil -> actif)
  waking: [
    '-.o', // Un œil ouvert
    'o.-', // L'autre œil
    'o.o', // Les deux yeux
    ':)', // Content d'être réveillé
  ],
}

// État principal
const currentFace = ref(':')
const isBouncing = ref(false)
const isHovering = ref(false)
const logoRef = ref<HTMLElement | null>(null)

// Timers
let idleInterval: ReturnType<typeof setInterval> | null = null
let bounceTimeout: ReturnType<typeof setTimeout> | null = null
let typingTimeout: ReturnType<typeof setTimeout> | null = null
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

// Priorité des états (pour éviter les conflits)
type StateType = 'click' | 'hover' | 'typing' | 'scroll' | 'sleeping' | 'theme' | 'idle'
const currentState = ref<StateType>('idle')
const statePriority: Record<StateType, number> = {
  click: 6,
  hover: 5,
  typing: 4,
  scroll: 3,
  sleeping: 2,
  theme: 1,
  idle: 0,
}

// VueUse composables
const { x: mouseX, y: mouseY } = useMouse()
const { idle: isUserIdle } = useIdle(15000) // 15 secondes d'inactivité
const { y: scrollY } = useWindowScroll()
const colorMode = useColorMode()

// Variables pour détecter le scroll
let lastScrollY = 0
let isScrolling = ref(false)

// Variables pour détecter le typing
const isTyping = ref(false)

// Style pour le suivi des yeux (subtil décalage)
const eyeStyle = computed(() => {
  if (!logoRef.value || currentState.value === 'sleeping') {
    return {}
  }
  
  const rect = logoRef.value.getBoundingClientRect()
  const logoCenterX = rect.left + rect.width / 2
  const logoCenterY = rect.top + rect.height / 2
  
  // Calculer le décalage basé sur la position de la souris
  const deltaX = mouseX.value - logoCenterX
  const deltaY = mouseY.value - logoCenterY
  
  // Limiter le décalage à quelques pixels pour un effet subtil
  const maxOffset = 2
  const offsetX = Math.max(-maxOffset, Math.min(maxOffset, deltaX / 100))
  const offsetY = Math.max(-maxOffset, Math.min(maxOffset, deltaY / 100))
  
  return {
    transform: `translate(${offsetX}px, ${offsetY}px)`,
  }
})

// Retourne un élément aléatoire d'un tableau
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Animation bounce subtile
function triggerBounce() {
  isBouncing.value = true
  if (bounceTimeout) clearTimeout(bounceTimeout)
  bounceTimeout = setTimeout(() => {
    isBouncing.value = false
  }, 300)
}

// Vérifie si on peut changer d'état selon la priorité
function canChangeState(newState: StateType): boolean {
  return statePriority[newState] >= statePriority[currentState.value]
}

// Change le visage avec une petite animation
function changeFace(newFace: string, state: StateType = 'idle') {
  if (!canChangeState(state) && state !== currentState.value) return
  
  currentFace.value = newFace
  currentState.value = state
  triggerBounce()
}

// Animation idle - change de temps en temps
function startIdleAnimation() {
  const randomDelay = () => 3000 + Math.random() * 3000

  const animate = () => {
    if (!isHovering.value && currentState.value === 'idle') {
      const useSpecial = Math.random() < 0.2
      const pool = useSpecial ? faces.special : faces.idle
      changeFace(randomFrom(pool), 'idle')
    }

    idleInterval = setTimeout(animate, randomDelay())
  }

  idleInterval = setTimeout(animate, randomDelay())
}

function stopIdleAnimation() {
  if (idleInterval) {
    clearTimeout(idleInterval)
    idleInterval = null
  }
}

// Handlers d'événements
function onHover() {
  isHovering.value = true
  changeFace(randomFrom(faces.hover), 'hover')
}

function onLeave() {
  isHovering.value = false
  setTimeout(() => {
    if (!isHovering.value && currentState.value === 'hover') {
      currentState.value = 'idle'
      changeFace(randomFrom(faces.idle), 'idle')
    }
  }, 100)
}

function onClick() {
  changeFace(randomFrom(faces.click), 'click')
  setTimeout(() => {
    if (isHovering.value) {
      changeFace(randomFrom(faces.hover), 'hover')
    } else {
      currentState.value = 'idle'
      changeFace(randomFrom(faces.idle), 'idle')
    }
  }, 1000)
}

// Watcher pour le scroll
watch(scrollY, (newY) => {
  const delta = Math.abs(newY - lastScrollY)
  lastScrollY = newY
  
  if (delta > 10 && !isHovering.value && currentState.value !== 'click') {
    isScrolling.value = true
    
    // Choisir une expression de scroll
    if (delta > 100) {
      changeFace(randomFrom(['@_@', 'x_x']), 'scroll') // Scroll rapide
    } else {
      changeFace(randomFrom(faces.scroll), 'scroll')
    }
    
    // Reset après un moment
    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      isScrolling.value = false
      if (currentState.value === 'scroll') {
        currentState.value = 'idle'
        changeFace(randomFrom(faces.idle), 'idle')
      }
    }, 500)
  }
})

// Watcher pour l'inactivité
watch(isUserIdle, (idle) => {
  if (idle && !isHovering.value) {
    // L'utilisateur est inactif - le logo s'endort progressivement
    const sleepSequence = async () => {
      await sleep(500)
      if (!isUserIdle.value) return
      changeFace('-.o', 'sleeping')
      await sleep(1000)
      if (!isUserIdle.value) return
      changeFace('-.-', 'sleeping')
      await sleep(1500)
      if (!isUserIdle.value) return
      changeFace('zzZ', 'sleeping')
    }
    sleepSequence()
  } else if (!idle && currentState.value === 'sleeping') {
    // L'utilisateur revient - le logo se réveille
    const wakeSequence = async () => {
      changeFace('-.o', 'idle')
      await sleep(300)
      changeFace('o.o', 'idle')
      await sleep(300)
      changeFace(':)', 'idle')
      currentState.value = 'idle'
    }
    wakeSequence()
  }
})

// Watcher pour le thème
watch(() => colorMode.value, (newMode) => {
  if (currentState.value !== 'click' && currentState.value !== 'hover') {
    if (newMode === 'dark') {
      changeFace(randomFrom(faces.darkTheme), 'theme')
    } else {
      changeFace(randomFrom(faces.lightTheme), 'theme')
    }
    
    // Revenir à idle après un moment
    setTimeout(() => {
      if (currentState.value === 'theme') {
        currentState.value = 'idle'
      }
    }, 2000)
  }
}, { immediate: false })

// Détection du typing
function handleKeydown(e: KeyboardEvent) {
  // Ignorer les touches de modification seules
  if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return
  
  if (!isHovering.value && currentState.value !== 'click' && currentState.value !== 'sleeping') {
    isTyping.value = true
    changeFace(randomFrom(faces.typing), 'typing')
    
    // Reset après un moment d'arrêt de frappe
    if (typingTimeout) clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      isTyping.value = false
      if (currentState.value === 'typing') {
        currentState.value = 'idle'
        changeFace(randomFrom(faces.idle), 'idle')
      }
    }, 1000)
  }
}

// Utilitaire sleep
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

onMounted(() => {
  startIdleAnimation()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopIdleAnimation()
  window.removeEventListener('keydown', handleKeydown)
  if (bounceTimeout) clearTimeout(bounceTimeout)
  if (typingTimeout) clearTimeout(typingTimeout)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<style scoped>
.logo-container {
  font-size: inherit;
  line-height: 1;
}

.logo-bracket {
  font-weight: 700;
}

.logo-face {
  display: inline-block;
  min-width: 1.5em;
  text-align: center;
}

.animate-bounce-subtle {
  animation: bounce-subtle 0.3s ease-out;
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.1);
  }
}

/* Hover effect sur tout le logo */
.logo-container:hover .logo-bracket {
  color: hsl(var(--primary) / 0.8);
}

.logo-container:active .logo-face {
  transform: scale(0.95);
}
</style>
