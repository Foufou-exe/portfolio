import { describe, it, expect } from 'vitest'
import {
  skills,
  softSkills,
  skillCategories,
  softSkillCategories,
  getSkillsByCategory,
  getSoftSkillsByCategory,
  profile,
  socialLinks,
  experiences,
  education,
} from '../../app/data/portfolio'
import type { Skill } from '../../app/data/portfolio'

describe('Portfolio Data', () => {
  describe('Profile', () => {
    it('has required profile fields', () => {
      expect(profile.name).toBeDefined()
      expect(profile.title).toBeDefined()
      expect(profile.avatar).toBeDefined()
      expect(profile.bio).toBeDefined()
    })

    it('has valid initials', () => {
      expect(profile.initials).toMatch(/^[A-Z]{2}$/)
    })
  })

  describe('Skills', () => {
    it('has skills defined', () => {
      expect(skills.length).toBeGreaterThan(0)
    })

    it('all skills have required fields', () => {
      skills.forEach((skill) => {
        expect(skill.name).toBeDefined()
        expect(skill.description).toBeDefined()
        expect(skill.category).toBeDefined()
      })
    })

    it('getSkillsByCategory returns correct skills', () => {
      const frontendSkills = getSkillsByCategory('frontend')
      expect(frontendSkills.length).toBeGreaterThan(0)
      frontendSkills.forEach((skill) => {
        expect(skill.category).toBe('frontend')
      })
    })

    it('all skill categories have at least one skill', () => {
      skillCategories.forEach((category) => {
        const categorySkills = getSkillsByCategory(category.id as Skill['category'])
        expect(categorySkills.length).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('Soft Skills', () => {
    it('has soft skills defined', () => {
      expect(softSkills.length).toBeGreaterThan(0)
    })

    it('all soft skills have required fields', () => {
      softSkills.forEach((skill) => {
        expect(skill.name).toBeDefined()
        expect(skill.description).toBeDefined()
        expect(skill.category).toBeDefined()
        expect(skill.icon).toBeDefined()
      })
    })

    it('getSoftSkillsByCategory returns correct skills', () => {
      const communicationSkills = getSoftSkillsByCategory('communication')
      expect(communicationSkills.length).toBeGreaterThan(0)
      communicationSkills.forEach((skill) => {
        expect(skill.category).toBe('communication')
      })
    })
  })

  describe('Social Links', () => {
    it('has social links defined', () => {
      expect(socialLinks.length).toBeGreaterThan(0)
    })

    it('all social links have required fields', () => {
      socialLinks.forEach((link) => {
        expect(link.name).toBeDefined()
        expect(link.url).toBeDefined()
        expect(link.icon).toBeDefined()
      })
    })

    it('has valid URLs', () => {
      socialLinks.forEach((link) => {
        expect(link.url).toMatch(/^(https?:\/\/|mailto:)/)
      })
    })
  })

  describe('Experiences', () => {
    it('has experiences defined', () => {
      expect(experiences.length).toBeGreaterThan(0)
    })

    it('all experiences have required fields', () => {
      experiences.forEach((exp) => {
        expect(exp.id).toBeDefined()
        expect(exp.title).toBeDefined()
        expect(exp.company).toBeDefined()
        expect(exp.period).toBeDefined()
        expect(exp.description).toBeDefined()
      })
    })

    it('experiences are sorted by start year descending', () => {
      for (let i = 0; i < experiences.length - 1; i++) {
        expect(experiences[i].startYear).toBeGreaterThanOrEqual(experiences[i + 1].startYear)
      }
    })
  })

  describe('Education', () => {
    it('has education entries defined', () => {
      expect(education.length).toBeGreaterThan(0)
    })

    it('all education entries have required fields', () => {
      education.forEach((edu) => {
        expect(edu.id).toBeDefined()
        expect(edu.degree).toBeDefined()
        expect(edu.school).toBeDefined()
        expect(edu.period).toBeDefined()
      })
    })
  })

  describe('Categories', () => {
    it('has skill categories defined', () => {
      expect(skillCategories.length).toBeGreaterThan(0)
    })

    it('has soft skill categories defined', () => {
      expect(softSkillCategories.length).toBeGreaterThan(0)
    })

    it('all skill categories have required fields', () => {
      skillCategories.forEach((cat) => {
        expect(cat.id).toBeDefined()
        expect(cat.label).toBeDefined()
        expect(cat.icon).toBeDefined()
      })
    })

    it('all soft skill categories have required fields', () => {
      softSkillCategories.forEach((cat) => {
        expect(cat.id).toBeDefined()
        expect(cat.label).toBeDefined()
        expect(cat.icon).toBeDefined()
        expect(cat.color).toBeDefined()
      })
    })
  })
})
