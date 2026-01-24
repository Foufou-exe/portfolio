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
} as const

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
