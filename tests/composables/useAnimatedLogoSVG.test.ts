import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { animate } from 'animejs'

// We need to import after mocks
import { useAnimatedLogoSVG } from '../../app/composables/useAnimatedLogoSVG'

// Mock animejs
vi.mock('animejs', () => ({
  animate: vi.fn(),
}))

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useMouse: vi.fn(() => ({
    x: { value: 0 },
    y: { value: 0 },
  })),
}))

describe('useAnimatedLogoSVG', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    // Mock window properties
    vi.stubGlobal('window', {
      ...globalThis.window,
      innerWidth: 1024,
      innerHeight: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      requestAnimationFrame: vi.fn((cb: () => void) => {
        cb()
        return 1
      }),
      cancelAnimationFrame: vi.fn(),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns svgRef, eyeLeftRef, eyeRightRef and animations', () => {
    const result = useAnimatedLogoSVG()
    expect(result).toHaveProperty('svgRef')
    expect(result).toHaveProperty('eyeLeftRef')
    expect(result).toHaveProperty('eyeRightRef')
    expect(result).toHaveProperty('animations')
  })

  it('initializes refs as null', () => {
    const { svgRef, eyeLeftRef, eyeRightRef } = useAnimatedLogoSVG()
    expect(svgRef.value).toBeNull()
    expect(eyeLeftRef.value).toBeNull()
    expect(eyeRightRef.value).toBeNull()
  })

  it('provides all expected animation functions', () => {
    const { animations } = useAnimatedLogoSVG()
    const expectedAnimations = [
      'blink', 'wink', 'surprised', 'happy', 'lookAround',
      'squash', 'shake', 'bounce', 'spin', 'wobble', 'pulse', 'float',
    ]
    expectedAnimations.forEach((name) => {
      expect(animations[name as keyof typeof animations]).toBeInstanceOf(Function)
    })
  })

  it('wink does nothing when no eyeLeftRef', async () => {
    const { animations } = useAnimatedLogoSVG()
    await animations.wink()
    expect(animate).not.toHaveBeenCalled()
  })

  it('surprised does nothing without eye refs', async () => {
    const { animations } = useAnimatedLogoSVG()
    await animations.surprised()
    expect(animate).not.toHaveBeenCalled()
  })

  it('happy does nothing without eye refs', async () => {
    const { animations } = useAnimatedLogoSVG()
    await animations.happy()
    expect(animate).not.toHaveBeenCalled()
  })

  it('squash does nothing without svgRef', () => {
    const { animations } = useAnimatedLogoSVG()
    animations.squash()
    expect(animate).not.toHaveBeenCalled()
  })

  it('shake does nothing without svgRef', () => {
    const { animations } = useAnimatedLogoSVG()
    animations.shake()
    expect(animate).not.toHaveBeenCalled()
  })

  it('bounce does nothing without svgRef', () => {
    const { animations } = useAnimatedLogoSVG()
    animations.bounce()
    expect(animate).not.toHaveBeenCalled()
  })

  it('spin does nothing without svgRef', () => {
    const { animations } = useAnimatedLogoSVG()
    animations.spin()
    expect(animate).not.toHaveBeenCalled()
  })

  it('wobble does nothing without svgRef', () => {
    const { animations } = useAnimatedLogoSVG()
    animations.wobble()
    expect(animate).not.toHaveBeenCalled()
  })

  it('pulse does nothing without svgRef', () => {
    const { animations } = useAnimatedLogoSVG()
    animations.pulse()
    expect(animate).not.toHaveBeenCalled()
  })

  it('float does nothing without svgRef', () => {
    const { animations } = useAnimatedLogoSVG()
    animations.float()
    expect(animate).not.toHaveBeenCalled()
  })

  it('lookAround does nothing without eye refs', async () => {
    const { animations } = useAnimatedLogoSVG()
    await animations.lookAround()
    expect(animate).not.toHaveBeenCalled()
  })

  it('blink does nothing without eye refs', async () => {
    const { animations } = useAnimatedLogoSVG()
    await animations.blink()
    expect(animate).not.toHaveBeenCalled()
  })

  it('squash calls animate with svgRef when available', () => {
    const { svgRef, animations } = useAnimatedLogoSVG()
    const mockSvg = { style: {} } as unknown as SVGSVGElement
    svgRef.value = mockSvg

    animations.squash()
    expect(animate).toHaveBeenCalledWith(mockSvg, expect.objectContaining({
      duration: 300,
    }))
  })

  it('shake calls animate with svgRef', () => {
    const { svgRef, animations } = useAnimatedLogoSVG()
    const mockSvg = { style: {} } as unknown as SVGSVGElement
    svgRef.value = mockSvg

    animations.shake()
    expect(animate).toHaveBeenCalledWith(mockSvg, expect.objectContaining({
      duration: 400,
    }))
  })

  it('bounce calls animate with svgRef', () => {
    const { svgRef, animations } = useAnimatedLogoSVG()
    const mockSvg = { style: {} } as unknown as SVGSVGElement
    svgRef.value = mockSvg

    animations.bounce()
    expect(animate).toHaveBeenCalledWith(mockSvg, expect.objectContaining({
      duration: 400,
    }))
  })

  it('spin calls animate with rotate 360', () => {
    const { svgRef, animations } = useAnimatedLogoSVG()
    const mockSvg = { style: {} } as unknown as SVGSVGElement
    svgRef.value = mockSvg

    animations.spin()
    expect(animate).toHaveBeenCalledWith(mockSvg, expect.objectContaining({
      rotate: [0, 360],
    }))
  })

  it('wobble calls animate with rotate oscillation', () => {
    const { svgRef, animations } = useAnimatedLogoSVG()
    const mockSvg = { style: {} } as unknown as SVGSVGElement
    svgRef.value = mockSvg

    animations.wobble()
    expect(animate).toHaveBeenCalledWith(mockSvg, expect.objectContaining({
      duration: 500,
    }))
  })

  it('pulse calls animate with scale', () => {
    const { svgRef, animations } = useAnimatedLogoSVG()
    const mockSvg = { style: {} } as unknown as SVGSVGElement
    svgRef.value = mockSvg

    animations.pulse()
    expect(animate).toHaveBeenCalledWith(mockSvg, expect.objectContaining({
      duration: 600,
    }))
  })

  it('float calls animate with translateY', () => {
    const { svgRef, animations } = useAnimatedLogoSVG()
    const mockSvg = { style: {} } as unknown as SVGSVGElement
    svgRef.value = mockSvg

    animations.float()
    expect(animate).toHaveBeenCalledWith(mockSvg, expect.objectContaining({
      duration: 1500,
    }))
  })

  it('wink calls animate with eye ref when available', async () => {
    const { eyeLeftRef, animations } = useAnimatedLogoSVG()
    const mockEye = { style: {} } as unknown as SVGPathElement
    eyeLeftRef.value = mockEye

    const promise = animations.wink()
    await vi.advanceTimersByTimeAsync(300)
    await promise
    expect(animate).toHaveBeenCalled()
  })

  it('blink calls animate on both eyes when refs available', async () => {
    const { eyeLeftRef, eyeRightRef, animations } = useAnimatedLogoSVG()
    const mockEyeL = { style: {} } as unknown as SVGPathElement
    const mockEyeR = { style: {} } as unknown as SVGPathElement
    eyeLeftRef.value = mockEyeL
    eyeRightRef.value = mockEyeR

    const blinkPromise = animations.blink()
    await vi.advanceTimersByTimeAsync(200)
    await blinkPromise
    expect(animate).toHaveBeenCalled()
  })

  it('surprised calls animate on both eyes when refs available', async () => {
    const { eyeLeftRef, eyeRightRef, animations } = useAnimatedLogoSVG()
    const mockEyeL = { style: {} } as unknown as SVGPathElement
    const mockEyeR = { style: {} } as unknown as SVGPathElement
    eyeLeftRef.value = mockEyeL
    eyeRightRef.value = mockEyeR

    const promise = animations.surprised()
    await vi.advanceTimersByTimeAsync(500)
    await promise
    expect(animate).toHaveBeenCalled()
  })

  it('happy calls animate on both eyes when refs available', async () => {
    const { eyeLeftRef, eyeRightRef, animations } = useAnimatedLogoSVG()
    const mockEyeL = { style: {} } as unknown as SVGPathElement
    const mockEyeR = { style: {} } as unknown as SVGPathElement
    eyeLeftRef.value = mockEyeL
    eyeRightRef.value = mockEyeR

    const promise = animations.happy()
    await vi.advanceTimersByTimeAsync(600)
    await promise
    expect(animate).toHaveBeenCalled()
  })

  it('lookAround animates eyes through positions', async () => {
    const { eyeLeftRef, eyeRightRef, animations } = useAnimatedLogoSVG()
    const mockEyeL = { style: {} } as unknown as SVGPathElement
    const mockEyeR = { style: {} } as unknown as SVGPathElement
    eyeLeftRef.value = mockEyeL
    eyeRightRef.value = mockEyeR

    const promise = animations.lookAround()
    // 5 positions, 250ms each
    await vi.advanceTimersByTimeAsync(1500)
    await promise
    expect(animate).toHaveBeenCalled()
  })
})
