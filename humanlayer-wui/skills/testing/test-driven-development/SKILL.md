---
name: test-driven-development
description: Use when implementing any CodeLayer feature or bugfix, before writing implementation code - write the test first, watch it fail, write minimal code to pass; ensures tests actually verify behavior by requiring failure first
---

# Test-Driven Development (TDD) for CodeLayer

## Overview

Write the test first. Watch it fail. Write minimal code to pass.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

**CodeLayer context:** We use Bun's test runner, React Testing Library, and Zustand for state management. All tests must follow existing patterns.

## When to Use

**Always:**
- New React components
- New Zustand store methods
- Bug fixes in UI or daemon communication
- New hooks or utilities
- Tauri command integrations

**Exceptions (ask your human partner):**
- Throwaway prototypes
- Configuration files
- Documentation-only changes

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over.

## Red-Green-Refactor

### RED - Write Failing Test

Write one minimal test showing what should happen.

<Good>
```typescript
// src/AppStore.test.ts
import { describe, test, expect } from 'bun:test'
import { create } from 'zustand'

test('selectSession sets current session', () => {
  const store = create<AppStore>()((set) => ({
    currentSessionId: null,
    selectSession: (id: string) => set({ currentSessionId: id })
  }))

  store.getState().selectSession('session-123')
  
  expect(store.getState().currentSessionId).toBe('session-123')
})
```
Clear name, tests real behavior, one thing
</Good>

<Bad>
```typescript
test('selection works', () => {
  // Tests multiple things at once
  // Vague name
  // No clear assertion
})
```
</Bad>

**Requirements:**
- One behavior per test
- Clear, descriptive name
- Use React Testing Library for components
- Use Zustand's store directly for state tests
- Real code (no mocks unless unavoidable like daemon API)

### Verify RED - Watch It Fail

**MANDATORY. Never skip.**

```bash
cd humanlayer-wui
bun test path/to/test.test.ts
```

Confirm:
- Test fails (not errors)
- Failure message is expected
- Fails because feature missing (not typos)

**Test passes?** You're testing existing behavior. Fix test.
**Test errors?** Fix error, re-run until it fails correctly.

### GREEN - Minimal Code

Write simplest code to pass the test.

<Good>
```typescript
// src/AppStore.ts
export const useAppStore = create<AppStore>((set) => ({
  currentSessionId: null,
  selectSession: (id: string) => set({ currentSessionId: id })
}))
```
Just enough to pass
</Good>

<Bad>
```typescript
// Over-engineered with features not in test
export const useAppStore = create<AppStore>((set) => ({
  currentSessionId: null,
  previousSessionId: null, // YAGNI
  sessionHistory: [], // YAGNI
  selectSession: (id: string) => set((state) => ({ 
    currentSessionId: id,
    previousSessionId: state.currentSessionId,
    sessionHistory: [...state.sessionHistory, id]
  }))
}))
```
</Bad>

Don't add features, refactor other code, or "improve" beyond the test.

### Verify GREEN - Watch It Pass

**MANDATORY.**

```bash
bun test path/to/test.test.ts
```

Confirm:
- Test passes
- Other tests still pass (run `bun test` for all)
- Output pristine (no errors, warnings)

**Test fails?** Fix code, not test.
**Other tests fail?** Fix now.

### REFACTOR - Clean Up

After green only:
- Remove duplication
- Improve names
- Extract hooks or utilities
- Apply Tailwind styling patterns

Keep tests green. Don't add behavior.

## CodeLayer-Specific Patterns

### Testing React Components

```typescript
// src/components/SessionList.test.tsx
import { describe, test, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { SessionList } from './SessionList'

test('renders session items', () => {
  const sessions = [
    { id: '1', name: 'Test Session', status: 'active' }
  ]
  
  render(<SessionList sessions={sessions} />)
  
  expect(screen.getByText('Test Session')).toBeDefined()
})
```

### Testing with Zustand Store

```typescript
// src/AppStore.test.ts
import { describe, test, expect, beforeEach } from 'bun:test'
import { useAppStore } from './AppStore'

beforeEach(() => {
  useAppStore.setState({
    sessions: [],
    currentSessionId: null
  })
})

test('bulkSelect creates selection range', () => {
  const sessions = [
    { id: 's1' }, { id: 's2' }, { id: 's3' }
  ]
  useAppStore.setState({ sessions, currentSessionId: 's1' })
  
  useAppStore.getState().bulkSelect('s3', 'down')
  
  const selected = useAppStore.getState().selectedSessionIds
  expect(selected).toEqual(['s1', 's2', 's3'])
})
```

### Testing Async Operations

Use the condition-based-waiting skill for async patterns:

```typescript
import { waitFor } from '@testing-library/react'

test('loads approvals from daemon', async () => {
  const { result } = renderHook(() => useApprovals())
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })
  
  expect(result.current.approvals).toHaveLength(3)
})
```

## Verification Checklist for CodeLayer

Before marking work complete:

- [ ] Every new function/method/component has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason (feature missing, not typo)
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass (`bun test`)
- [ ] Linting passes (`bun run lint`)
- [ ] Type checking passes (`bun run typecheck`)
- [ ] React components use proper hooks patterns
- [ ] Zustand store updates tested
- [ ] ShadCN components properly styled with Tailwind
- [ ] No forwardRef usage (use ref prop in React 19)

Can't check all boxes? You skipped TDD. Start over.

## CodeLayer Test Commands

| Command | Purpose |
|---------|---------|
| `bun test` | Run all tests |
| `bun test path/to/file.test.ts` | Run specific test file |
| `bun run lint` | Check code style |
| `bun run typecheck` | Check TypeScript types |
| `bun run check` | Run all checks (format + lint + typecheck) |

## Integration with Daemon

When testing features that interact with the daemon:

```typescript
// Mock daemon responses when necessary
import { mockDaemonClient } from '@/test-utils/daemon-mock'

test('fetches sessions from daemon', async () => {
  const mockClient = mockDaemonClient({
    listSessions: async () => [
      { id: '1', name: 'Test' }
    ]
  })
  
  // Use mockClient in test
})
```

## Common CodeLayer Scenarios

### New UI Component

1. **RED**: Write test rendering component with props
2. **Verify RED**: Component doesn't exist
3. **GREEN**: Create component file, minimal JSX
4. **Verify GREEN**: Test passes
5. **REFACTOR**: Add ShadCN components, Tailwind styling

### New Store Method

1. **RED**: Write test calling method, checking state change
2. **Verify RED**: Method doesn't exist
3. **GREEN**: Add method to store
4. **Verify GREEN**: State updates correctly
5. **REFACTOR**: Extract common logic if needed

### Bug Fix

1. **RED**: Write test reproducing the bug
2. **Verify RED**: Test fails with bug behavior
3. **GREEN**: Fix the bug
4. **Verify GREEN**: Test passes
5. **REFACTOR**: Clean up if needed

## When Stuck

| Problem | Solution |
|---------|----------|
| Don't know how to test React component | Check existing tests in `src/` for patterns |
| Test setup too complex | Extract test utilities to `testing-library.ts` |
| Mock daemon too hard | Use real daemon with test data in development |
| Zustand store test confusing | Reset state with `setState` in `beforeEach` |

## Final Rule

```
Production code → test exists and failed first
Otherwise → not TDD
```

No exceptions without your human partner's permission.
