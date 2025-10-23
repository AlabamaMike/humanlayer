# CodeLayer Skills System

CodeLayer integrates the [obra/superpowers](https://github.com/obra/superpowers) skills library, adapted specifically for our React + Zustand + Tauri + Bun development stack.

## What Are Skills?

Skills are structured workflows and best practices that guide development. They activate automatically when Claude Code detects relevant tasks, or can be invoked manually using slash commands.

## Available Skills

### Testing Skills

#### test-driven-development
**Use when:** Implementing any feature or bugfix
**Command:** `/tdd`

Enforces RED-GREEN-REFACTOR cycle:
1. Write failing test first
2. Watch it fail (`bun test`)
3. Write minimal code to pass
4. Watch it pass
5. Refactor while keeping tests green

**Key points for CodeLayer:**
- Use `bun test` not npm
- Test React components with React Testing Library
- Test Zustand store methods directly
- Always run `bun run check` after changes

**File:** [skills/testing/test-driven-development/SKILL.md](skills/testing/test-driven-development/SKILL.md)

### Debugging Skills

#### systematic-debugging
**Use when:** Encountering any bug or unexpected behavior
**Command:** `/debug`

Four-phase framework:
1. **Root Cause Investigation** - Gather evidence, check logs, trace data flow
2. **Pattern Analysis** - Find working examples, compare differences
3. **Hypothesis Testing** - Form hypothesis, test minimally
4. **Implementation** - Create failing test, fix root cause

**Key points for CodeLayer:**
- Check browser console for React errors
- Check `~/.humanlayer/logs/wui-*/codelayer.log` for daemon errors
- Trace across layers: UI → Store → Tauri → Daemon
- Use store subscriptions to trace state changes

**File:** [skills/debugging/systematic-debugging/SKILL.md](skills/debugging/systematic-debugging/SKILL.md)

#### verification-before-completion
**Use when:** About to claim work is complete or commit code
**Command:** Automatically activates before completion claims

Requires evidence before any completion claim:
- `bun test` - All tests must pass
- `bun run check` - Lint and typecheck must pass
- Manual UI verification when applicable
- Daemon connection test for integration features

**Key points for CodeLayer:**
```bash
cd humanlayer-wui
bun run check && bun test  # Must pass before claiming success
```

**File:** [skills/debugging/verification-before-completion/SKILL.md](skills/debugging/verification-before-completion/SKILL.md)

### Collaboration Skills

#### brainstorming
**Use when:** Designing new features or exploring approaches
**Command:** `/brainstorm`

Refines rough ideas into complete designs through:
1. **Understanding** - Ask questions to gather requirements
2. **Exploration** - Propose 2-3 alternative approaches
3. **Design Presentation** - Present design in sections for validation
4. **Design Documentation** - Write design doc to `docs/plans/`
5. **Ready for Implementation** - Confirm next steps

**Key points for CodeLayer:**
- Consider React component hierarchy
- Plan Zustand store structure
- Check if daemon APIs exist or need creation
- Use ShadCN components where available
- Plan Tailwind styling approach

**File:** [skills/collaboration/brainstorming/SKILL.md](skills/collaboration/brainstorming/SKILL.md)

#### writing-plans
**Use when:** Design is complete, need detailed implementation tasks
**Command:** `/write-plan`

Creates comprehensive implementation plans with:
- Exact file paths (`humanlayer-wui/src/...`)
- Complete code examples
- Step-by-step test-first approach
- Verification commands at each step
- Bite-sized tasks (2-5 minutes each)

**Key points for CodeLayer:**
- Include React 19 patterns (no forwardRef)
- Specify ShadCN components to use
- Include Tailwind styling
- Reference Zustand store changes
- Include `bun test` and `bun run check` at each step

**File:** [skills/collaboration/writing-plans/SKILL.md](skills/collaboration/writing-plans/SKILL.md)

#### executing-plans
**Use when:** Have a complete implementation plan to execute
**Command:** `/execute-plan`

Executes plans in controlled batches:
1. **Load and Review** - Read plan, identify concerns
2. **Execute Batch** - Implement 3 tasks at a time
3. **Report** - Show verification output, wait for feedback
4. **Continue** - Execute next batch after review
5. **Final Verification** - Run all checks before completion

**Key points for CodeLayer:**
- Stop immediately if blocked (don't guess)
- Run `bun run check` after each task
- Commit after each task completion
- Manual UI verification when needed
- Follow TDD cycle strictly

**File:** [skills/collaboration/executing-plans/SKILL.md](skills/collaboration/executing-plans/SKILL.md)

## How to Use Skills

### Automatic Activation

Skills activate automatically when Claude detects relevant tasks:
- Starting to write code → TDD activates
- Encountering a bug → Systematic debugging activates
- About to commit → Verification activates
- Designing a feature → Brainstorming may suggest activation

### Manual Activation with Commands

Use slash commands to explicitly activate skills:

```
/brainstorm          # Start design process
/write-plan          # Create implementation plan
/execute-plan        # Execute existing plan
/tdd                 # Enforce test-driven development
/debug               # Activate systematic debugging
```

## Typical Workflows

### Adding a New Feature

```
1. /brainstorm
   - Explore design alternatives
   - Validate design incrementally
   - Document in docs/plans/

2. /write-plan
   - Create detailed implementation plan
   - Break into bite-sized tasks
   - Include verification at each step

3. /execute-plan
   - Execute in batches of 3 tasks
   - Report after each batch
   - Verify with bun test & bun run check

4. Final verification before PR
   - bun run check && bun test
   - Manual UI testing
   - Update documentation
```

### Fixing a Bug

```
1. /debug
   - Phase 1: Root cause investigation
   - Check logs, reproduce consistently
   - Trace data flow across layers

2. /tdd (integrated with debug)
   - Write failing test reproducing bug
   - Watch it fail
   - Fix root cause (not symptom)
   - Watch test pass
   - Verify no regressions

3. verification-before-completion
   - bun test (all pass)
   - bun run check (no errors)
   - Bug actually fixed in UI
```

## CodeLayer-Specific Patterns

### React Component Development

```typescript
// 1. Write test first
test('SessionFilter renders with options', () => {
  render(<SessionFilter options={['active', 'archived']} />)
  expect(screen.getByRole('combobox')).toBeDefined()
})

// 2. Implement with ShadCN
import { Select } from '@/components/ui/select'

export function SessionFilter({ options }) {
  return <Select>...</Select>
}

// 3. Style with Tailwind
<Select className="w-64 border-border">
```

### Zustand Store Development

```typescript
// 1. Write test first
test('setFilter updates filter state', () => {
  const store = useAppStore.getState()
  store.setFilter({ status: 'active' })
  expect(store.filter.status).toBe('active')
})

// 2. Implement in store
export const useAppStore = create<AppStore>((set) => ({
  filter: { status: null },
  setFilter: (filter) => set({ filter }),
}))

// 3. Use in component
const setFilter = useAppStore((state) => state.setFilter)
```

### Daemon Integration

```typescript
// 1. Write test with mock
test('fetches sessions from daemon', async () => {
  const mockClient = mockDaemonClient({
    listSessions: async () => [{ id: '1', name: 'Test' }]
  })
  // Test implementation
})

// 2. Implement using hld-sdk
import { daemonClient } from '@/lib/daemon/client'

const sessions = await daemonClient.listSessions()
```

## Verification Checklist

Before any commit:

```bash
cd humanlayer-wui

# 1. Run all tests
bun test

# 2. Check types and lint
bun run check

# 3. Manual UI check (if UI changes)
make codelayer-dev
# Test the feature manually

# 4. Commit
git add [files]
git commit -m "feat: descriptive message"
```

## Best Practices

### DO
- ✅ Write tests first (TDD always)
- ✅ Run `bun run check` before committing
- ✅ Use ShadCN components
- ✅ Style with Tailwind only
- ✅ Follow React 19 patterns (ref prop, no forwardRef)
- ✅ Commit frequently (per task)
- ✅ Stop and ask when blocked

### DON'T
- ❌ Skip writing tests
- ❌ Commit without running checks
- ❌ Create custom components when ShadCN exists
- ❌ Use inline styles or CSS files
- ❌ Use forwardRef (React 19 deprecated it)
- ❌ Make large commits
- ❌ Guess when blocked - ask instead

## Integration with Development Process

The skills system integrates with CodeLayer development:

1. **Planning Phase** → Use brainstorming skill
2. **Implementation Phase** → Use TDD + writing-plans + executing-plans
3. **Debug Phase** → Use systematic-debugging
4. **Pre-Commit Phase** → Use verification-before-completion
5. **Code Review Phase** → Reference skills in PR descriptions

## Learning More

Each skill has comprehensive documentation in its SKILL.md file:

- **Full skill docs:** [skills/](skills/)
- **Command reference:** [commands/](commands/)
- **Plugin config:** [.claude-plugin/plugin.json](.claude-plugin/plugin.json)

## Testing the Skills

Run the skills integration tests:

```bash
cd humanlayer-wui
bun test src/lib/skills/skills.test.ts
```

This verifies:
- All skills are present
- All commands reference correct skills
- Skills have valid metadata
- Skills contain CodeLayer-specific content

## Credits

Skills adapted from [obra/superpowers](https://github.com/obra/superpowers) by Jesse Vincent, customized for CodeLayer's React + Zustand + Tauri + Bun stack.
