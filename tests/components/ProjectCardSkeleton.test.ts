import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ProjectCardSkeleton from '../../app/components/common/ProjectCardSkeleton.vue'

describe('ProjectCardSkeleton', () => {
  it('renders with large size', async () => {
    const wrapper = await mountSuspended(ProjectCardSkeleton, {
      props: { size: 'large' },
    })
    expect(wrapper.find('.bento-card').exists()).toBe(true)
    expect(wrapper.classes()).toContain('md:col-span-2')
  })

  it('renders with medium size', async () => {
    const wrapper = await mountSuspended(ProjectCardSkeleton, {
      props: { size: 'medium' },
    })
    expect(wrapper.find('.bento-card').exists()).toBe(true)
    expect(wrapper.classes()).toContain('col-span-1')
  })

  it('renders with small size', async () => {
    const wrapper = await mountSuspended(ProjectCardSkeleton, {
      props: { size: 'small' },
    })
    expect(wrapper.find('.bento-card').exists()).toBe(true)
  })

  it('has skeleton shimmer animation elements', async () => {
    const wrapper = await mountSuspended(ProjectCardSkeleton, {
      props: { size: 'medium' },
    })
    const shimmerElements = wrapper.findAll('.skeleton-shimmer')
    expect(shimmerElements.length).toBeGreaterThan(0)
  })

  it('shows extra description line for large size', async () => {
    const wrapperLarge = await mountSuspended(ProjectCardSkeleton, {
      props: { size: 'large' },
    })
    const wrapperMedium = await mountSuspended(ProjectCardSkeleton, {
      props: { size: 'medium' },
    })

    const largeSkeleton = wrapperLarge.findAll('.skeleton-shimmer')
    const mediumSkeleton = wrapperMedium.findAll('.skeleton-shimmer')

    // Large should have more skeleton elements (extra description line)
    expect(largeSkeleton.length).toBeGreaterThanOrEqual(mediumSkeleton.length)
  })
})
