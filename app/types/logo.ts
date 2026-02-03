/**
 * Types et constantes pour le logo animé {:]
 */

// =============================================================================
// TYPES
// =============================================================================

/** États possibles du logo */
export type LogoState =
  | 'idle'
  | 'typing'
  | 'sleeping'
  | 'yawning'
  | 'mouseOut'

/** Directions des yeux (8 directions + centre) */
export type EyeDirection =
  | 'center'
  | 'up'
  | 'upRight'
  | 'right'
  | 'downRight'
  | 'down'
  | 'downLeft'
  | 'left'
  | 'upLeft'

/** Période de la journée */
export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night'

/** Expression du logo (yeux + bouche) */
export interface LogoExpression {
  eyes: string
  mouth: string
}

/** Contexte de déclenchement des dialogues */
export type SpeechTrigger = 'load' | 'idle' | 'click' | 'scroll'

/** Section du portfolio */
export type PortfolioSection = 'hero' | 'about' | 'experience' | 'projects' | 'contact'

/** Message de dialogue */
export interface SpeechMessage {
  key: string // Clé i18n (ex: 'logo.speech.greeting')
  trigger: SpeechTrigger
  section?: PortfolioSection // Pour les messages liés au scroll
  expression?: Partial<LogoExpression> // Expression pendant le message
  duration?: number // Durée d'affichage (ms)
}

// =============================================================================
// CONSTANTES - EXPRESSIONS
// =============================================================================

/** Yeux directionnels pour le suivi souris (360°) */
export const DIRECTIONAL_EYES: Record<EyeDirection, string> = {
  center: ':',
  up: '¨',
  upRight: '°.',
  right: '.·',
  downRight: '.,',
  down: '..',
  downLeft: ',.',
  left: '·.',
  upLeft: '.°',
} as const

/** Yeux pour états spéciaux */
export const SPECIAL_EYES = {
  normal: ':',
  closed: '-',
  sad: ':',
  wide: 'Ö',
  tired: '=',
} as const

/** Expressions de la bouche */
export const MOUTHS = {
  smile: '}',
  smallSmile: '}',
  bigSmile: 'D',
  sad: '(',
  surprised: 'O',
} as const

// =============================================================================
// CONSTANTES - CONFIGURATION
// =============================================================================

export const CONFIG = {
  /** Intervalle de clignement (min-max en ms) */
  blink: {
    minInterval: 2000,
    maxInterval: 5000,
    duration: 120,
  },

  /** Inactivité avant sommeil (ms) */
  idleTimeout: 15000,

  /** Durées des animations (ms) */
  animation: {
    yawnStart: 200,
    yawnPeak: 800,
    yawnEnd: 300,
    wakeUp: 200,
    mouseOutDelay: 500,
    typingReset: 1000,
    happyAfterReturn: 1000,
  },

  /** Seuil de distance pour le suivi souris (px) */
  mouseFollowThreshold: 30,

  /** Configuration des bulles de dialogue */
  speech: {
    /** Délai avant le premier message au chargement (ms) */
    loadDelay: 1500,
    /** Durée d'affichage par défaut (ms) */
    defaultDuration: 3000,
    /** Délai minimum entre deux messages (ms) */
    cooldown: 10000,
    /** Délai avant message d'inactivité (ms) */
    idleDelay: 20000,
    /** Animation */
    animationDuration: 300,
  },
} as const

/** Messages de dialogue par défaut (clés i18n) */
export const SPEECH_MESSAGES: Record<SpeechTrigger, string[]> = {
  load: [
    'logo.speech.load.greeting',
    'logo.speech.load.welcome',
    'logo.speech.load.hey',
  ],
  idle: [
    'logo.speech.idle.stillThere',
    'logo.speech.idle.bored',
    'logo.speech.idle.sleepy',
  ],
  click: [
    'logo.speech.click.ouch',
    'logo.speech.click.hey',
    'logo.speech.click.tickles',
  ],
  scroll: [], // Les messages de scroll sont définis par section
}

/** Messages par section (clés i18n) */
export const SECTION_MESSAGES: Record<PortfolioSection, string> = {
  hero: 'logo.speech.section.hero',
  about: 'logo.speech.section.about',
  experience: 'logo.speech.section.experience',
  projects: 'logo.speech.section.projects',
  contact: 'logo.speech.section.contact',
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Retourne l'expression par défaut selon l'heure
 */
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours()

  if (hour >= 6 && hour < 10) return 'morning'
  if (hour >= 10 && hour < 18) return 'day'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

/**
 * Retourne l'expression par défaut selon la période
 */
export function getDefaultExpression(time: TimeOfDay): LogoExpression {
  switch (time) {
    case 'morning':
      return { eyes: SPECIAL_EYES.wide, mouth: MOUTHS.bigSmile }
    case 'day':
      return { eyes: SPECIAL_EYES.normal, mouth: MOUTHS.smile }
    case 'evening':
      return { eyes: SPECIAL_EYES.normal, mouth: MOUTHS.smallSmile }
    case 'night':
      return { eyes: SPECIAL_EYES.tired, mouth: MOUTHS.smallSmile }
  }
}

/**
 * Calcule la direction des yeux selon l'angle de la souris
 */
export function getEyeDirectionFromAngle(angle: number): EyeDirection {
  // Normaliser l'angle entre 0 et 360
  const normalized = ((angle % 360) + 360) % 360

  // 8 secteurs de 45° chacun
  if (normalized >= 337.5 || normalized < 22.5) return 'right'
  if (normalized >= 22.5 && normalized < 67.5) return 'downRight'
  if (normalized >= 67.5 && normalized < 112.5) return 'down'
  if (normalized >= 112.5 && normalized < 157.5) return 'downLeft'
  if (normalized >= 157.5 && normalized < 202.5) return 'left'
  if (normalized >= 202.5 && normalized < 247.5) return 'upLeft'
  if (normalized >= 247.5 && normalized < 292.5) return 'up'
  return 'upRight'
}
