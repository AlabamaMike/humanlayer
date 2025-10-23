---
name: systematic-debugging
description: Use when encountering any CodeLayer bug, test failure, or unexpected behavior, before proposing fixes - four-phase framework (root cause investigation, pattern analysis, hypothesis testing, implementation) that ensures understanding before attempting solutions
---

# Systematic Debugging for CodeLayer

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

**CodeLayer context:** We debug across multiple layers: React UI, Zustand state, Tauri backend, daemon communication, and MCP integration.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

Use for ANY CodeLayer technical issue:
- Test failures (`bun test`)
- UI rendering bugs
- State management issues
- Daemon connection problems
- Tauri command failures
- MCP integration bugs
- Build/typecheck errors

**Use this ESPECIALLY when:**
- Under time pressure
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Daemon seems unresponsive
- UI not reflecting state changes

## The Four Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Check browser console for React errors
   - Check terminal for daemon errors
   - Check CodeLayer logs (`~/.humanlayer/logs/wui-*/codelayer.log`)
   - Note line numbers, file paths, error codes
   - Look for `[Daemon]` prefix in logs for daemon issues

2. **Reproduce Consistently**
   - Can you trigger it reliably?
   - What are the exact steps?
   - Does it happen every time?
   - Hot-reload related or persistent?

3. **Check Recent Changes**
   - `git diff` for recent changes
   - New dependencies in package.json?
   - Zustand store modifications?
   - Daemon API changes?

4. **Gather Evidence in Multi-Layer System**

   **CodeLayer has multiple layers: UI → Store → Tauri → Daemon → API**

   **BEFORE proposing fixes, add diagnostic instrumentation:**
   ```typescript
   // Layer 1: React Component
   console.log('[Component] Props:', props)
   console.log('[Component] Rendering with state:', state)

   // Layer 2: Zustand Store
   useAppStore.subscribe((state) => {
     console.log('[Store] State changed:', state)
   })

   // Layer 3: Hook/API call
   console.log('[Hook] Fetching from daemon:', endpoint)
   console.log('[Hook] Response:', data)

   // Layer 4: Daemon logs
   // Check ~/.humanlayer/logs/wui-*/codelayer.log
   ```

   **This reveals:** Which layer fails (Store ✓, Daemon connection ✗)

5. **Trace Data Flow**

   **Common CodeLayer data flows:**
   - User action → Event handler → Store method → State update → Component re-render
   - Daemon event → WebSocket/polling → Hook update → Store update → UI update
   - Keyboard shortcut → Hook → Store method → Selection change → UI update

   **Trace backward from symptom:**
   - UI not updating? Check if store changed
   - Store not changing? Check if method called
   - Method not called? Check if event handler fired
   - Fix at source, not at symptom

### Phase 2: Pattern Analysis

**Find the pattern before fixing:**

1. **Find Working Examples**
   - Look for similar components in `src/components/`
   - Check similar store methods in `src/AppStore.ts`
   - Find similar hooks in `src/hooks/`

2. **Compare Against References**
   - Check existing tests in `src/` for patterns
   - Review CLAUDE.md for CodeLayer conventions
   - Check ShadCN component examples

3. **Identify Differences**
   - Working component uses `useAppStore`, broken one doesn't?
   - Working hook has error handling, broken one doesn't?
   - Working component properly uses React 19 patterns?

4. **Understand Dependencies**
   - Daemon running? (`ps aux | grep hld`)
   - Correct environment variables?
   - MCP connection established?
   - WebSocket connected?

### Phase 3: Hypothesis and Testing

**Scientific method:**

1. **Form Single Hypothesis**
   - "I think the store isn't updating because the selector is wrong"
   - "I think daemon connection failed because socket path is incorrect"
   - Write it down clearly

2. **Test Minimally**
   - Add ONE console.log to verify hypothesis
   - Change ONE variable at a time
   - Test with `bun test` if unit test
   - Test in UI if integration

3. **Verify Before Continuing**
   - Did it work? Yes → Phase 4
   - Didn't work? Form NEW hypothesis
   - DON'T stack multiple fixes

### Phase 4: Implementation

**Fix the root cause, not the symptom:**

1. **Create Failing Test Case**
   - Write test that reproduces bug
   - Use React Testing Library for components
   - Use Zustand direct testing for store
   - Run `bun test` to confirm it fails
   - **Use test-driven-development skill for proper test writing**

2. **Implement Single Fix**
   - Address the root cause identified
   - ONE change at a time
   - Follow CodeLayer conventions:
     - Use Zustand for state
     - Use ShadCN components
     - Use Tailwind for styling
     - No forwardRef (React 19)

3. **Verify Fix**
   - `bun test` passes?
   - `bun run lint` passes?
   - `bun run typecheck` passes?
   - UI works correctly?
   - No other tests broken?

4. **If Fix Doesn't Work**
   - STOP
   - Count: How many fixes have you tried?
   - If < 3: Return to Phase 1
   - **If ≥ 3: Question the architecture**

5. **If 3+ Fixes Failed: Question Architecture**
   - Is this pattern fundamentally sound?
   - Should we refactor vs. continue fixing?
   - Discuss with your human partner

## CodeLayer-Specific Debugging

### Daemon Connection Issues

```typescript
// Check if daemon is running
const isDaemonRunning = async () => {
  try {
    const response = await daemonClient.health()
    console.log('[Daemon] Health check:', response)
    return true
  } catch (error) {
    console.error('[Daemon] Connection failed:', error)
    return false
  }
}
```

### State Not Updating

```typescript
// Add store subscription to trace updates
import { useAppStore } from '@/AppStore'

useAppStore.subscribe((state, prevState) => {
  console.log('[Store] Changed from:', prevState)
  console.log('[Store] Changed to:', state)
})
```

### Component Not Re-rendering

```typescript
// Check if selector is stable
const sessions = useAppStore((state) => state.sessions)
console.log('[Component] Sessions:', sessions)
console.log('[Component] Renders count:', ++renderCount)
```

### Keyboard Shortcuts Not Working

```typescript
// Check hook registration
useHotkeys('j', () => {
  console.log('[Hotkey] J pressed')
  // ... handler
})
```

## Red Flags - STOP and Follow Process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Skip the test, I'll manually verify"
- "Daemon is probably down, restart it"
- "Store is probably wrong, rewrite it"
- Proposing solutions before checking logs
- **"One more fix attempt" (when already tried 2+)**

**ALL of these mean: STOP. Return to Phase 1.**

## Common CodeLayer Issues

| Symptom | Common Root Causes | Investigation |
|---------|-------------------|---------------|
| UI not updating | Selector not reactive, store not changing | Check store subscription |
| Daemon error | Connection failed, API changed | Check logs, verify socket path |
| Test failing | Test expectations wrong, test setup incorrect | Check existing tests for patterns |
| Build error | Type error, import missing | Run `bun run typecheck` |
| Keyboard shortcut not working | Shortcut not registered, wrong scope | Check useHotkeys registration |

## Quick Reference

| Phase | Key Activities | CodeLayer Tools |
|-------|---------------|-----------------|
| **1. Root Cause** | Read errors, reproduce, gather evidence | Browser console, logs, `bun test` |
| **2. Pattern** | Find working examples, compare | Check `src/` for similar code |
| **3. Hypothesis** | Form theory, test minimally | Console.log, store.subscribe |
| **4. Implementation** | Create test, fix, verify | `bun test`, `bun run check` |

## Integration with Other Skills

**This skill requires using:**
- **test-driven-development** - REQUIRED for creating failing test case
- **verification-before-completion** - Verify fix worked before claiming success

## Final Rule

```
Fix attempts without investigation = thrashing
Investigation first = fast resolution
```
