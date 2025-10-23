# Superpowers Integration Plan for CodeLayer

## Date: 2025-10-23

## Overview
Integrate obra/superpowers skills library into CodeLayer (humanlayer-wui) to enhance Claude Code's capabilities with proven development workflows, TDD patterns, debugging processes, and collaboration skills.

## Understanding

### What is Superpowers?
- Comprehensive skills library for Claude Code
- Provides structured workflows for testing, debugging, collaboration, and development
- Uses Claude's native skills system with SKILL.md files
- Includes slash commands for common workflows
- Activates automatically when relevant tasks are detected

### What is CodeLayer?
- Desktop application (Tauri + React) for HumanLayer daemon (hld)
- Manages Claude Code sessions and approval requests
- Built with React 19, Zustand state management, Radix UI components
- Uses Bun for package management and testing
- Already has testing infrastructure in place

### Skills Structure
Each skill is a directory containing:
- `SKILL.md` - Frontmatter metadata (name, description) + detailed instructions
- Skills use YAML frontmatter for metadata
- Instructions follow structured format with phases, checklists, examples

### Categories of Skills
1. **Testing**: TDD, async testing, anti-patterns
2. **Debugging**: Systematic debugging, root cause tracing, verification
3. **Collaboration**: Brainstorming, planning, code review, parallel agents
4. **Development**: Git worktrees, finishing branches, subagent workflows
5. **Meta**: Creating/sharing/testing skills

## Integration Approach

### Option 1: Direct Copy + Adaptation (Recommended)
**Approach**: Copy skills to CodeLayer repository and adapt for CodeLayer-specific workflows
- **Pros**: Full control, can customize for CodeLayer, no external dependencies
- **Cons**: Need to maintain separately, updates not automatic

### Option 2: Git Submodule
**Approach**: Add superpowers as git submodule
- **Pros**: Easy updates from upstream
- **Cons**: Less flexibility to customize, external dependency

### Option 3: Hybrid
**Approach**: Reference core skills + add CodeLayer-specific skills
- **Pros**: Best of both worlds
- **Cons**: More complex setup

**Decision: Option 1 with periodic manual sync**

## Implementation Plan

### Phase 1: Repository Setup
- [x] Create .agent/ directory for planning
- [ ] Create .claude-plugin/ directory in humanlayer-wui/
- [ ] Create skills/ directory structure
- [ ] Create commands/ directory for slash commands
- [ ] Create hooks/ directory for session hooks

### Phase 2: Core Skills Integration
Priority skills to integrate first:
1. **test-driven-development** - Critical for CodeLayer development
2. **systematic-debugging** - Useful for troubleshooting daemon issues
3. **verification-before-completion** - Ensures quality
4. **brainstorming** - For feature design
5. **writing-plans** - For implementation planning
6. **executing-plans** - For batch execution

### Phase 3: CodeLayer-Specific Adaptations
Customize skills for CodeLayer context:
- Adapt test commands to use `bun test`
- Add CodeLayer-specific verification steps
- Include daemon connection testing
- Add React/Zustand patterns to examples
- Reference ShadCN components in UI examples

### Phase 4: Command Integration
Create slash commands:
- `/codelayer:brainstorm` - Design new features
- `/codelayer:write-plan` - Create implementation plans
- `/codelayer:execute-plan` - Execute plans in batches
- `/codelayer:tdd` - Activate TDD workflow
- `/codelayer:debug` - Systematic debugging

### Phase 5: Testing Infrastructure
- [ ] Create test suite for skill activation
- [ ] Test slash command parsing
- [ ] Test skill content rendering
- [ ] E2E tests for workflow completion
- [ ] Validate against existing CodeLayer test patterns

### Phase 6: Documentation
- [ ] Add skills documentation to humanlayer-wui/docs/
- [ ] Update CLAUDE.md with skills reference
- [ ] Create SKILLS.md overview
- [ ] Add examples for CodeLayer-specific workflows

## Technical Details

### Directory Structure
```
humanlayer-wui/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── skills/
│   ├── testing/
│   │   ├── test-driven-development/
│   │   │   └── SKILL.md
│   │   ├── condition-based-waiting/
│   │   │   └── SKILL.md
│   │   └── testing-anti-patterns/
│   │       └── SKILL.md
│   ├── debugging/
│   │   ├── systematic-debugging/
│   │   │   └── SKILL.md
│   │   ├── root-cause-tracing/
│   │   │   └── SKILL.md
│   │   └── verification-before-completion/
│   │       └── SKILL.md
│   ├── collaboration/
│   │   ├── brainstorming/
│   │   │   └── SKILL.md
│   │   ├── writing-plans/
│   │   │   └── SKILL.md
│   │   └── executing-plans/
│   │       └── SKILL.md
│   └── codelayer-specific/
│       ├── daemon-testing/
│       │   └── SKILL.md
│       └── react-component-tdd/
│           └── SKILL.md
├── commands/
│   ├── brainstorm.md
│   ├── write-plan.md
│   ├── execute-plan.md
│   └── tdd.md
└── hooks/
    └── session-start.md
```

### Plugin Configuration
```json
{
  "name": "codelayer-skills",
  "description": "Development skills for CodeLayer: TDD, debugging, collaboration patterns",
  "version": "1.0.0",
  "author": {
    "name": "HumanLayer Team"
  },
  "homepage": "https://github.com/humanlayer/humanlayer",
  "repository": "https://github.com/humanlayer/humanlayer",
  "license": "MIT"
}
```

### Test Command Adaptation
Change all test commands from:
- `npm test` → `bun test`
- `npm run lint` → `bun run lint`
- `npm run typecheck` → `bun run typecheck`

### CodeLayer-Specific Verification Checklist
Add to verification-before-completion:
- [ ] Daemon connection verified
- [ ] React hot-reload working
- [ ] Zustand store updates tested
- [ ] ShadCN components properly styled
- [ ] Tauri build succeeds
- [ ] MCP integration tested (if applicable)

## Risk Assessment

### Risks
1. **Maintenance Overhead**: Skills need to be kept in sync with upstream
2. **Learning Curve**: Team needs to understand skills system
3. **Tool Conflicts**: Slash commands might conflict with existing tooling

### Mitigations
1. Document sync process, schedule quarterly reviews
2. Create onboarding guide with examples
3. Use `/codelayer:` prefix to avoid conflicts

## Success Criteria

### Must Have
- [ ] 6 core skills integrated and working
- [ ] 3 slash commands functional
- [ ] Test suite with >80% coverage
- [ ] Documentation complete

### Nice to Have
- [ ] 10+ skills integrated
- [ ] 5+ slash commands
- [ ] CodeLayer-specific skills created
- [ ] Video tutorial created

## Timeline Estimate
- Phase 1: 1 hour (setup)
- Phase 2: 3 hours (core skills)
- Phase 3: 2 hours (adaptations)
- Phase 4: 2 hours (commands)
- Phase 5: 4 hours (testing)
- Phase 6: 2 hours (documentation)

**Total: ~14 hours**

## Next Steps
1. Create directory structure
2. Copy test-driven-development skill as first integration
3. Write unit tests for skill activation
4. Iterate on remaining skills
