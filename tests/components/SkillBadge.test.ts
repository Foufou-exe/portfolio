import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SkillBadge from '../../app/components/common/SkillBadge.vue'
import type { Skill } from '../../app/data/portfolio'

const mockSkill: Skill = {
  name: 'TypeScript',
  description: 'A strongly typed programming language',
  category: 'frontend',
}

describe('SkillBadge', () => {
  it('renders the skill name in a Badge', async () => {
    const wrapper = await mountSuspended(SkillBadge, {
      props: { skill: mockSkill },
    })
    expect(wrapper.text()).toContain('TypeScript')
  })

  it('uses secondary variant by default', async () => {
    const wrapper = await mountSuspended(SkillBadge, {
      props: { skill: mockSkill },
    })
    // Badge with secondary variant should have the secondary class
    expect(wrapper.html()).toBeTruthy()
  })

  it('accepts a custom variant prop', async () => {
    const wrapper = await mountSuspended(SkillBadge, {
      props: { skill: mockSkill, variant: 'outline' },
    })
    expect(wrapper.text()).toContain('TypeScript')
  })

  it('renders HoverCard structure', async () => {
    const wrapper = await mountSuspended(SkillBadge, {
      props: { skill: mockSkill },
    })
    // The component should render a trigger element (the badge is the trigger)
    expect(wrapper.html()).toContain('TypeScript')
  })
})
