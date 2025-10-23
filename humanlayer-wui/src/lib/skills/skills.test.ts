import { describe, test, expect } from 'bun:test'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

describe('Skills Integration', () => {
  const skillsDir = join(process.cwd(), 'skills')
  const commandsDir = join(process.cwd(), 'commands')
  const pluginDir = join(process.cwd(), '.claude-plugin')

  test('skills directory exists', () => {
    expect(existsSync(skillsDir)).toBe(true)
  })

  test('commands directory exists', () => {
    expect(existsSync(commandsDir)).toBe(true)
  })

  test('.claude-plugin directory exists', () => {
    expect(existsSync(pluginDir)).toBe(true)
  })

  test('plugin.json exists and is valid', () => {
    const pluginJsonPath = join(pluginDir, 'plugin.json')
    expect(existsSync(pluginJsonPath)).toBe(true)

    const pluginJson = require(pluginJsonPath)
    expect(pluginJson.name).toBe('codelayer-skills')
    expect(pluginJson.version).toBeDefined()
    expect(pluginJson.description).toBeDefined()
  })

  test('all expected skill categories exist', () => {
    const categories = readdirSync(skillsDir)
    expect(categories).toContain('testing')
    expect(categories).toContain('debugging')
    expect(categories).toContain('collaboration')
  })

  test('test-driven-development skill exists', () => {
    const tddPath = join(skillsDir, 'testing', 'test-driven-development', 'SKILL.md')
    expect(existsSync(tddPath)).toBe(true)
  })

  test('systematic-debugging skill exists', () => {
    const debugPath = join(skillsDir, 'debugging', 'systematic-debugging', 'SKILL.md')
    expect(existsSync(debugPath)).toBe(true)
  })

  test('verification-before-completion skill exists', () => {
    const verifyPath = join(skillsDir, 'debugging', 'verification-before-completion', 'SKILL.md')
    expect(existsSync(verifyPath)).toBe(true)
  })

  test('brainstorming skill exists', () => {
    const brainstormPath = join(skillsDir, 'collaboration', 'brainstorming', 'SKILL.md')
    expect(existsSync(brainstormPath)).toBe(true)
  })

  test('writing-plans skill exists', () => {
    const plansPath = join(skillsDir, 'collaboration', 'writing-plans', 'SKILL.md')
    expect(existsSync(plansPath)).toBe(true)
  })

  test('executing-plans skill exists', () => {
    const execPath = join(skillsDir, 'collaboration', 'executing-plans', 'SKILL.md')
    expect(existsSync(execPath)).toBe(true)
  })

  test('all expected commands exist', () => {
    const commands = ['brainstorm.md', 'write-plan.md', 'execute-plan.md', 'tdd.md', 'debug.md']
    for (const command of commands) {
      const commandPath = join(commandsDir, command)
      expect(existsSync(commandPath)).toBe(true)
    }
  })

  test('brainstorm command references brainstorming skill', () => {
    const commandPath = join(commandsDir, 'brainstorm.md')
    const content = require('fs').readFileSync(commandPath, 'utf-8')
    expect(content).toContain('brainstorming skill')
  })

  test('write-plan command references writing-plans skill', () => {
    const commandPath = join(commandsDir, 'write-plan.md')
    const content = require('fs').readFileSync(commandPath, 'utf-8')
    expect(content).toContain('writing-plans skill')
  })

  test('execute-plan command references executing-plans skill', () => {
    const commandPath = join(commandsDir, 'execute-plan.md')
    const content = require('fs').readFileSync(commandPath, 'utf-8')
    expect(content).toContain('executing-plans skill')
  })

  test('tdd command references test-driven-development skill', () => {
    const commandPath = join(commandsDir, 'tdd.md')
    const content = require('fs').readFileSync(commandPath, 'utf-8')
    expect(content).toContain('test-driven-development skill')
  })

  test('debug command references systematic-debugging skill', () => {
    const commandPath = join(commandsDir, 'debug.md')
    const content = require('fs').readFileSync(commandPath, 'utf-8')
    expect(content).toContain('systematic-debugging skill')
  })
})

describe('Skill Content Validation', () => {
  const skillsDir = join(process.cwd(), 'skills')

  test('test-driven-development skill has CodeLayer-specific content', () => {
    const skillPath = join(skillsDir, 'testing', 'test-driven-development', 'SKILL.md')
    const content = require('fs').readFileSync(skillPath, 'utf-8')
    
    // Check for CodeLayer-specific mentions
    expect(content).toContain('bun test')
    expect(content).toContain('CodeLayer')
    expect(content).toContain('Zustand')
    expect(content).toContain('React Testing Library')
  })

  test('systematic-debugging skill has CodeLayer-specific content', () => {
    const skillPath = join(skillsDir, 'debugging', 'systematic-debugging', 'SKILL.md')
    const content = require('fs').readFileSync(skillPath, 'utf-8')
    
    expect(content).toContain('CodeLayer')
    expect(content).toContain('daemon')
    expect(content).toContain('Zustand')
    expect(content).toContain('Tauri')
  })

  test('verification-before-completion skill has CodeLayer commands', () => {
    const skillPath = join(skillsDir, 'debugging', 'verification-before-completion', 'SKILL.md')
    const content = require('fs').readFileSync(skillPath, 'utf-8')
    
    expect(content).toContain('bun test')
    expect(content).toContain('bun run check')
    expect(content).toContain('humanlayer-wui')
  })

  test('brainstorming skill mentions CodeLayer patterns', () => {
    const skillPath = join(skillsDir, 'collaboration', 'brainstorming', 'SKILL.md')
    const content = require('fs').readFileSync(skillPath, 'utf-8')
    
    expect(content).toContain('CodeLayer')
    expect(content).toContain('ShadCN')
    expect(content).toContain('Zustand')
  })

  test('writing-plans skill has CodeLayer templates', () => {
    const skillPath = join(skillsDir, 'collaboration', 'writing-plans', 'SKILL.md')
    const content = require('fs').readFileSync(skillPath, 'utf-8')
    
    expect(content).toContain('humanlayer-wui/')
    expect(content).toContain('bun test')
    expect(content).toContain('React 19')
    expect(content).toContain('no forwardRef')
  })

  test('executing-plans skill references bun commands', () => {
    const skillPath = join(skillsDir, 'collaboration', 'executing-plans', 'SKILL.md')
    const content = require('fs').readFileSync(skillPath, 'utf-8')
    
    expect(content).toContain('bun test')
    expect(content).toContain('bun run check')
    expect(content).toContain('humanlayer-wui')
  })
})

describe('Skill Metadata', () => {
  const skillsDir = join(process.cwd(), 'skills')

  const skillPaths = [
    ['testing', 'test-driven-development'],
    ['debugging', 'systematic-debugging'],
    ['debugging', 'verification-before-completion'],
    ['collaboration', 'brainstorming'],
    ['collaboration', 'writing-plans'],
    ['collaboration', 'executing-plans'],
  ]

  for (const [category, skillName] of skillPaths) {
    test(`${skillName} has valid YAML frontmatter`, () => {
      const skillPath = join(skillsDir, category, skillName, 'SKILL.md')
      const content = require('fs').readFileSync(skillPath, 'utf-8')
      
      // Check for YAML frontmatter
      expect(content.startsWith('---')).toBe(true)
      expect(content.indexOf('---', 3) > 0).toBe(true)
      
      // Extract frontmatter
      const frontmatterEnd = content.indexOf('---', 3)
      const frontmatter = content.substring(0, frontmatterEnd + 3)
      
      // Check for required fields
      expect(frontmatter).toContain('name:')
      expect(frontmatter).toContain('description:')
    })

    test(`${skillName} has name matching directory`, () => {
      const skillPath = join(skillsDir, category, skillName, 'SKILL.md')
      const content = require('fs').readFileSync(skillPath, 'utf-8')
      
      // Extract name from frontmatter
      const nameMatch = content.match(/name:\s*(.+)/)
      expect(nameMatch).toBeTruthy()
      expect(nameMatch![1].trim()).toBe(skillName)
    })
  }
})
