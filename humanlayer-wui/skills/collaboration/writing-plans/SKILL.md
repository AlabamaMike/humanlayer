---
name: writing-plans
description: Use when CodeLayer design is complete and you need detailed implementation tasks - creates comprehensive implementation plans with exact file paths, complete code examples, and verification steps for React/Zustand/Tauri development
---

# Writing Plans for CodeLayer

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for CodeLayer codebase. Document everything: which files to touch, code, testing, how to verify. Bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Save plans to:** `humanlayer-wui/docs/plans/YYYY-MM-DD-<feature-name>.md`

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" - step
- "Run `bun test` to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run `bun test` and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:**
- React 19 (no forwardRef, use ref prop)
- Zustand (state management)
- ShadCN + Radix UI (components)
- Tailwind CSS (styling)
- Bun (testing & package management)
- Tauri (desktop integration, if applicable)

---
```

## Task Structure for CodeLayer

```markdown
### Task N: [Component/Feature Name]

**Files:**
- Create: `humanlayer-wui/src/components/ComponentName.tsx`
- Modify: `humanlayer-wui/src/AppStore.ts:123-145`
- Test: `humanlayer-wui/src/components/ComponentName.test.tsx`

**Step 1: Write the failing test**

```typescript
import { describe, test, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

test('renders specific behavior', () => {
  render(<ComponentName prop="value" />)
  expect(screen.getByText('Expected Text')).toBeDefined()
})
```

**Step 2: Run test to verify it fails**

Run: `cd humanlayer-wui && bun test src/components/ComponentName.test.tsx`
Expected: FAIL with "ComponentName not found" or similar

**Step 3: Write minimal implementation**

```typescript
export function ComponentName({ prop }: { prop: string }) {
  return <div>Expected Text</div>
}
```

**Step 4: Run test to verify it passes**

Run: `cd humanlayer-wui && bun test src/components/ComponentName.test.tsx`
Expected: PASS

**Step 5: Verify types and lint**

Run: `cd humanlayer-wui && bun run check`
Expected: No errors

**Step 6: Commit**

```bash
cd humanlayer-wui
git add src/components/ComponentName.tsx src/components/ComponentName.test.tsx
git commit -m "feat: add ComponentName component"
```
```

## CodeLayer-Specific Task Templates

### Template: React Component

```markdown
### Task: Create [ComponentName] Component

**Files:**
- Create: `humanlayer-wui/src/components/ComponentName.tsx`
- Test: `humanlayer-wui/src/components/ComponentName.test.tsx`

**Steps:**
1. Write failing test for component rendering
2. Run `bun test` - should fail
3. Create component with minimal JSX
4. Run `bun test` - should pass
5. Add ShadCN components if needed (e.g., Button, Dialog)
6. Style with Tailwind classes
7. Run `bun run check` - verify types and lint
8. Commit

**Test Example:**
```typescript
test('renders component with props', () => {
  render(<ComponentName title="Test" />)
  expect(screen.getByText('Test')).toBeDefined()
})
```

**Implementation Notes:**
- Use ShadCN components: Button, Dialog, Select, etc.
- Tailwind for styling (no inline styles)
- React 19: use `ref` prop directly (no forwardRef)
- Props should have TypeScript interfaces
```

### Template: Zustand Store Method

```markdown
### Task: Add [methodName] to Store

**Files:**
- Modify: `humanlayer-wui/src/AppStore.ts`
- Test: `humanlayer-wui/src/AppStore.test.ts`

**Steps:**
1. Write failing test for store method
2. Run `bun test src/AppStore.test.ts` - should fail
3. Add method to store
4. Run `bun test src/AppStore.test.ts` - should pass
5. Run `bun run check` - verify types
6. Commit

**Test Example:**
```typescript
test('methodName updates state correctly', () => {
  const store = useAppStore.getState()
  store.methodName('newValue')
  expect(store.propertyName).toBe('newValue')
})
```

**Implementation Notes:**
- Use `set` for state updates
- Use computed selectors for derived state
- Consider using `immer` if nested updates needed
```

### Template: Hook

```markdown
### Task: Create [useHookName] Hook

**Files:**
- Create: `humanlayer-wui/src/hooks/useHookName.ts`
- Test: `humanlayer-wui/src/hooks/useHookName.test.ts`

**Steps:**
1. Write failing test using renderHook
2. Run `bun test` - should fail
3. Implement hook
4. Run `bun test` - should pass
5. Run `bun run check` - verify types
6. Commit

**Test Example:**
```typescript
import { renderHook, waitFor } from '@testing-library/react'

test('hook returns expected data', async () => {
  const { result } = renderHook(() => useHookName())
  
  await waitFor(() => {
    expect(result.current.data).toBeDefined()
  })
})
```

**Implementation Notes:**
- Handle loading and error states
- Use Zustand for shared state
- Memoize expensive computations with useMemo
```

### Template: Daemon Integration

```markdown
### Task: Integrate with Daemon [Endpoint]

**Files:**
- Modify: `humanlayer-wui/src/hooks/useDaemonData.ts`
- Test: `humanlayer-wui/src/hooks/useDaemonData.test.ts`

**Steps:**
1. Write failing test with mock daemon response
2. Run `bun test` - should fail
3. Implement API call using hld-sdk
4. Run `bun test` - should pass
5. Test with live daemon manually
6. Run `bun run check` - verify types
7. Commit

**Test Example:**
```typescript
import { mockDaemonClient } from '@/test-utils/daemon-mock'

test('fetches data from daemon', async () => {
  const mockClient = mockDaemonClient({
    endpoint: async () => ({ data: 'test' })
  })
  
  const { result } = renderHook(() => useEndpoint())
  
  await waitFor(() => {
    expect(result.current.data).toBe('test')
  })
})
```

**Implementation Notes:**
- Use @humanlayer/hld-sdk types
- Handle daemon unavailable gracefully
- Show error toast on failure
- Cache responses when appropriate
```

## Remember for CodeLayer

- **Exact file paths** starting with `humanlayer-wui/`
- **Complete code** in plan (not "add validation")
- **Exact commands**: `bun test`, `bun run check`, `bun run lint`
- **Expected output** for each command
- **Reference skills** when needed (test-driven-development, systematic-debugging)
- **DRY, YAGNI, TDD**, frequent commits
- **No forwardRef** - use ref prop (React 19)
- **ShadCN components** preferred over custom
- **Tailwind** for all styling

## CodeLayer Verification Commands

Include in plan tasks:

```bash
# Run tests
cd humanlayer-wui && bun test

# Type check
cd humanlayer-wui && bun run typecheck

# Lint
cd humanlayer-wui && bun run lint

# All checks
cd humanlayer-wui && bun run check

# Manual UI check
cd humanlayer-wui && make codelayer-dev
```

## Execution Handoff

After saving the plan:

"The implementation plan is ready in `docs/plans/YYYY-MM-DD-feature-name.md`. Ready to execute it with the executing-plans skill?"

## Example Plan Snippet

```markdown
# Session Filtering Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Add filtering UI to SessionList to filter sessions by status and date range.

**Architecture:** Client-side filtering using Zustand store with computed selector for filtered sessions.

**Tech Stack:**
- React 19 (no forwardRef)
- Zustand (state management)
- ShadCN Select (filter UI)
- Tailwind CSS (styling)
- Bun (testing)

---

### Task 1: Add Filter State to Store

**Files:**
- Modify: `humanlayer-wui/src/AppStore.ts:45-60`
- Test: `humanlayer-wui/src/AppStore.test.ts`

**Step 1: Write the failing test**

```typescript
test('setFilter updates filter state', () => {
  const store = useAppStore.getState()
  store.setFilter({ status: 'active' })
  expect(store.filter.status).toBe('active')
})
```

**Step 2: Run test to verify it fails**

Run: `cd humanlayer-wui && bun test src/AppStore.test.ts`
Expected: FAIL with "setFilter is not a function"

**Step 3: Write minimal implementation**

```typescript
// In AppStore.ts interface
filter: { status: string | null }
setFilter: (filter: { status: string | null }) => void

// In store implementation
filter: { status: null },
setFilter: (filter) => set({ filter }),
```

**Step 4: Run test to verify it passes**

Run: `cd humanlayer-wui && bun test src/AppStore.test.ts`
Expected: PASS

**Step 5: Verify types and lint**

Run: `cd humanlayer-wui && bun run check`
Expected: No errors

**Step 6: Commit**

```bash
cd humanlayer-wui
git add src/AppStore.ts src/AppStore.test.ts
git commit -m "feat: add filter state to store"
```

---

[Continue with more tasks...]
```
