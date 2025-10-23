---
name: executing-plans
description: Use when partner provides a complete CodeLayer implementation plan to execute in controlled batches with review checkpoints - loads plan, reviews critically, executes tasks in batches, reports for review between batches
---

# Executing Plans for CodeLayer

## Overview

Load plan, review critically, execute tasks in batches, report for review between batches.

**Core principle:** Batch execution with checkpoints for review.

**CodeLayer context:** All commands run in `humanlayer-wui/` directory. Use `bun test`, `bun run check` for verification.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## The Process

### Step 1: Load and Review Plan

1. **Read plan file** from `docs/plans/`
2. **Review critically:**
   - Are file paths correct for CodeLayer structure?
   - Are dependencies available (ShadCN components, etc.)?
   - Do test commands use Bun syntax?
   - Does it follow React 19 patterns (no forwardRef)?
   - Are Zustand store patterns correct?
3. **If concerns:** Raise them with your human partner before starting
4. **If no concerns:** Use todo_write to create task list and proceed

**Example concerns to check:**
- "Plan references Dialog but we need to install it: `bunx --bun shadcn@latest add dialog`"
- "Plan uses forwardRef but we're on React 19, should use ref prop"
- "Plan doesn't include `bun run check` verification"

### Step 2: Execute Batch

**Default: First 3 tasks**

For each task:
1. **Mark as in_progress** using todo_write
2. **Follow each step exactly**
   - Run test commands from `humanlayer-wui/` directory
   - Verify expected output matches actual
   - Don't skip verification steps
3. **Run verification:** `bun run check` after each task
4. **Commit** as specified in plan
5. **Mark as completed** using todo_write

**CodeLayer verification pattern:**
```bash
cd humanlayer-wui
bun test [specific-test]      # Verify test passes
bun run check                  # Verify types and lint
git add [files]
git commit -m "[message]"
```

### Step 3: Report

When batch complete:
- **Show what was implemented** (file names, brief description)
- **Show verification output:**
  ```
  ✓ Tests passed (3/3)
  ✓ Type check passed
  ✓ Lint passed
  ✓ Committed: [commit messages]
  ```
- **Say:** "Batch N complete. Ready for feedback."

**Don't** write long summaries or explanations. Just facts and output.

### Step 4: Continue

Based on feedback:
- **If issues:** Fix them, re-verify, report
- **If approved:** Execute next batch
- **Repeat** until all tasks complete

### Step 5: Final Verification

**After all tasks complete:**

```bash
cd humanlayer-wui
bun test                    # All tests
bun run check               # All checks
make codelayer-dev          # Manual UI verification
```

Report results and ask: "All tasks complete and verified. Ready to finish?"

## When to Stop and Ask for Help

**STOP executing immediately when:**
- **Test fails unexpectedly** after following plan steps
- **`bun run check` fails** with type errors
- **Missing dependency** (component not installed, API doesn't exist)
- **Instruction unclear** or contradictory
- **Plan assumes API exists** but it doesn't in hld-sdk
- **Daemon connection needed** but not available

**Ask for clarification rather than guessing.**

**Example stop scenarios:**
```
❌ "Test fails with 'Cannot find module' - plan references @/utils/helper but file doesn't exist"
❌ "Type error: hld-sdk doesn't have 'listFilters' method mentioned in plan"
❌ "ShadCN component 'Tabs' not installed, plan assumes it exists"
```

## When to Revisit Earlier Steps

**Return to Review (Step 1) when:**
- Partner updates the plan based on your feedback
- Fundamental approach needs rethinking (e.g., "this won't work with Zustand, needs different pattern")

**Don't force through blockers** - stop and ask.

## CodeLayer-Specific Execution Tips

### React Components
- Always use ShadCN when available
- Style with Tailwind only (no inline styles)
- Use `ref` prop directly (no forwardRef)
- Test with React Testing Library patterns

### Zustand Store
- Reset state with `setState` in beforeEach
- Test both actions and selectors
- Verify state updates with subscribe if needed

### Daemon Integration
- Check if API exists in hld-sdk first
- Mock daemon for unit tests
- Test with live daemon manually if possible
- Handle errors gracefully (daemon unavailable)

### Testing
- Run specific test file during development
- Run all tests before batch completion
- Use `bun test --watch` for iteration
- Don't skip red-green cycle

### Committing
- Commit after each task completion
- Use conventional commit format: `feat:`, `fix:`, `test:`, `refactor:`
- Keep commits atomic (one task = one commit)

## Progress Tracking

Use todo_write to track:
```typescript
todo_write({
  todos: [
    { id: '1', content: 'Task 1: Add filter state', status: 'completed' },
    { id: '2', content: 'Task 2: Create filter component', status: 'in-progress' },
    { id: '3', content: 'Task 3: Wire up filter to list', status: 'todo' },
    { id: '4', content: 'Task 4: Add filter tests', status: 'todo' }
  ]
})
```

Update after each task completion.

## Example Execution Flow

**Batch 1 (Tasks 1-3):**
```
[Task 1: in-progress]
- Writing test for filter state...
- Running: bun test src/AppStore.test.ts
- Test failed (expected)
- Implementing filter state...
- Running: bun test src/AppStore.test.ts
- Test passed ✓
- Running: bun run check
- All checks passed ✓
- Committed: feat: add filter state to store
[Task 1: completed]

[Task 2: in-progress]
[... similar pattern ...]

[Task 3: in-progress]
[... similar pattern ...]

Batch 1 complete. Summary:
✓ 3 tasks implemented
✓ 9/9 tests passing
✓ Type check: 0 errors
✓ Lint: 0 problems
✓ 3 commits made

Ready for feedback.
```

## Remember for CodeLayer

- **Always `cd humanlayer-wui`** before commands
- **Use `bun`** not npm: `bun test`, `bun run check`
- **Run `bun run check`** after each task
- **Commit frequently** (per task)
- **Follow TDD** red-green cycle strictly
- **Stop if blocked** - don't guess or improvise
- **Update todos** after each task
- **Report concisely** between batches

## Integration with Other Skills

**During execution, reference:**
- **test-driven-development** - Follow TDD cycle for every task
- **systematic-debugging** - If test fails unexpectedly
- **verification-before-completion** - Before claiming batch complete

## Final Rule

```
Follow plan exactly → Verify each step → Commit frequently → Report between batches
Blocked? STOP and ask.
```
