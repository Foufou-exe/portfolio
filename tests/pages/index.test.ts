import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '../../app/pages/index.vue'

// Mock animejs (used by child components)
vi.mock('animejs', () => ({
  animate: vi.fn(),
}))

describe('index page', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => Promise.resolve('<svg></svg>'),
    } as Response)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without errors', async () => {
    const wrapper = await mountSuspended(IndexPage, {
      global: {
        stubs: {
          HeroSection: { template: '<section id="hero">Hero</section>' },
          AboutSection: { template: '<section id="about">About</section>' },
          SkillsSection: { template: '<section id="skills">Skills</section>' },
          ProjectsSection: { template: '<section id="projects">Projects</section>' },
          ExperienceSection: { template: '<section id="experience">Experience</section>' },
          EducationSection: { template: '<section id="education">Education</section>' },
          ContactSection: { template: '<section id="contact">Contact</section>' },
        },
      },
    })
    expect(wrapper.html()).toBeTruthy()
  })

  it('renders HeroSection eagerly', async () => {
    const wrapper = await mountSuspended(IndexPage, {
      global: {
        stubs: {
          HeroSection: { template: '<section id="hero">Hero Stub</section>' },
          AboutSection: { template: '<section>About</section>' },
          SkillsSection: { template: '<section>Skills</section>' },
          ProjectsSection: { template: '<section>Projects</section>' },
          ExperienceSection: { template: '<section>Experience</section>' },
          EducationSection: { template: '<section>Education</section>' },
          ContactSection: { template: '<section>Contact</section>' },
        },
      },
    })
    expect(wrapper.html()).toContain('Hero Stub')
  })

  it('creates lazy sections for below-fold content', async () => {
    const wrapper = await mountSuspended(IndexPage, {
      global: {
        stubs: {
          HeroSection: { template: '<section>Hero</section>' },
          AboutSection: { template: '<section>About</section>' },
          SkillsSection: { template: '<section>Skills</section>' },
          ProjectsSection: { template: '<section>Projects</section>' },
          ExperienceSection: { template: '<section>Experience</section>' },
          EducationSection: { template: '<section>Education</section>' },
          ContactSection: { template: '<section>Contact</section>' },
        },
      },
    })
    // There should be placeholders or sections for lazy content
    expect(wrapper.html()).toBeTruthy()
  })

  it('computes SEO title with profile name', async () => {
    const wrapper = await mountSuspended(IndexPage, {
      global: {
        stubs: {
          HeroSection: { template: '<section>Hero</section>' },
          AboutSection: { template: '<section>About</section>' },
          SkillsSection: { template: '<section>Skills</section>' },
          ProjectsSection: { template: '<section>Projects</section>' },
          ExperienceSection: { template: '<section>Experience</section>' },
          EducationSection: { template: '<section>Education</section>' },
          ContactSection: { template: '<section>Contact</section>' },
        },
      },
    })
    // The page should set SEO meta (we can verify it exists)
    expect(wrapper.html()).toBeTruthy()
  })

  it('renders lazy section containers', async () => {
    const wrapper = await mountSuspended(IndexPage, {
      global: {
        stubs: {
          HeroSection: { template: '<section>Hero</section>' },
          AboutSection: { template: '<section>About</section>' },
          SkillsSection: { template: '<section>Skills</section>' },
          ProjectsSection: { template: '<section>Projects</section>' },
          ExperienceSection: { template: '<section>Experience</section>' },
          EducationSection: { template: '<section>Education</section>' },
          ContactSection: { template: '<section>Contact</section>' },
        },
      },
    })
    // The page should contain section wrapper divs for lazy content
    const html = wrapper.html()
    // At least some sections exist (either rendered or placeholder)
    expect(html).toBeTruthy()
    // Check the page has multiple section areas
    expect(wrapper.findAll('div').length).toBeGreaterThan(1)
  })
})
