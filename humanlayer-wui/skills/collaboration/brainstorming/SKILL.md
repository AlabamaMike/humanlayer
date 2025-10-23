---
name: brainstorming
description: Use when creating or developing CodeLayer features, before writing code or implementation plans - refines rough ideas into fully-formed designs through structured Socratic questioning, alternative exploration, and incremental validation
---

# Brainstorming Ideas Into Designs for CodeLayer

## Overview

Transform rough CodeLayer feature ideas into fully-formed designs through structured questioning and alternative exploration.

**Core principle:** Ask questions to understand, explore alternatives, present design incrementally for validation.

**CodeLayer context:** We build with React 19, Zustand, Tauri, and integrate with the HumanLayer daemon. Always consider the full stack.

## Quick Reference

| Phase | Key Activities | CodeLayer Focus | Output |
|-------|---------------|-----------------|--------|
| **1. Understanding** | Ask questions (one at a time) | Current daemon capabilities, UI patterns | Purpose, constraints, criteria |
| **2. Exploration** | Propose 2-3 approaches | React patterns, store structure, daemon API | Architecture options with trade-offs |
| **3. Design Presentation** | Present in 200-300 word sections | Component hierarchy, state flow, API calls | Complete design with validation |
| **4. Design Documentation** | Write design document | `docs/plans/` directory | Design doc committed to git |
| **5. Ready for Implementation** | Confirm next steps | TDD approach, testing strategy | Ready to code or create plan |

## The Process

Copy this checklist to track progress:

```
Brainstorming Progress:
- [ ] Phase 1: Understanding (purpose, constraints, criteria gathered)
- [ ] Phase 2: Exploration (2-3 approaches proposed and evaluated)
- [ ] Phase 3: Design Presentation (design validated in sections)
- [ ] Phase 4: Design Documentation (design written to docs/plans/)
- [ ] Phase 5: Ready for Implementation
```

### Phase 1: Understanding

**Check current CodeLayer state:**
- What components exist? (`ls humanlayer-wui/src/components/`)
- What store methods exist? (Check `src/AppStore.ts`)
- What daemon APIs exist? (Check `hld-sdk` types)
- What patterns are already used?

**Ask ONE question at a time:**
- "What should this feature do?"
- "Who will use this?"
- "How should it integrate with existing UI?"
- "Should it require daemon changes or use existing APIs?"

**Gather:**
- Purpose
- User workflows
- Performance constraints
- Integration points with daemon
- Success criteria

### Phase 2: Exploration

**Propose 2-3 different approaches:**

For each approach, consider:
- **React layer**: Component structure, hooks needed
- **State layer**: Zustand store changes, state shape
- **Tauri layer**: Any new commands needed?
- **Daemon layer**: Existing APIs sufficient or need new endpoints?
- **Trade-offs**: Complexity vs. features, performance, maintainability

**Example approaches for "Add session filtering":**

**Option 1: Client-side filtering**
- Store all sessions in Zustand, filter in UI
- Pros: Fast, no daemon changes, works offline
- Cons: Memory usage for large session lists
- Complexity: Low

**Option 2: Server-side filtering**
- Add filter API to daemon, UI requests filtered data
- Pros: Scalable, memory efficient
- Cons: Requires daemon changes, network latency
- Complexity: Medium

**Option 3: Hybrid with caching**
- Cache in UI, server-side pagination
- Pros: Best of both, scalable
- Cons: Most complex, cache invalidation
- Complexity: High

### Phase 3: Design Presentation

**Present design in sections:**

**Section 1: Component Architecture**
```
SessionFilter component:
- Uses existing ShadCN Select component
- Controlled by Zustand store filterState
- Renders in SessionList header
```

"Does this look right so far?"

**Section 2: State Management**
```
Store additions:
- filterState: { status: string, dateRange: [Date, Date] }
- applyFilter(filter): updates state, triggers re-render
- filteredSessions computed selector
```

"Does this state structure make sense?"

**Section 3: Data Flow**
```
User selects filter
→ Store updates filterState
→ filteredSessions selector recalculates
→ SessionList re-renders with filtered data
```

"Does this flow work for your needs?"

**Section 4: Error Handling**
```
- Invalid filter values: show error toast
- Daemon unavailable: show cached data + warning
- Empty results: show "No sessions match" message
```

"Any edge cases I'm missing?"

**Section 5: Testing Strategy**
```
Unit tests:
- Store filter methods
- Selector correctness
- Filter validation

Integration tests:
- Component + store interaction
- Filter persistence across sessions
```

"Does this testing approach look sufficient?"

### Phase 4: Design Documentation

**Create design document:**

```bash
# File: docs/plans/2025-10-23-session-filtering-design.md
```

**Contents:**
1. Overview & Goals
2. Architecture (from Phase 3)
3. Component Structure
4. State Management
5. API Integration (if applicable)
6. Error Handling
7. Testing Strategy
8. Future Considerations

**Commit the design:**
```bash
cd humanlayer-wui
git add docs/plans/2025-10-23-session-filtering-design.md
git commit -m "Design: Add session filtering feature"
```

### Phase 5: Ready for Implementation

**Confirm next steps:**
- "Ready to implement this design?"
- "Should I create a detailed implementation plan?"
- "Want to start with TDD on the store methods?"

**If implementing immediately:**
- Use test-driven-development skill
- Start with failing tests
- Implement one component at a time

**If planning first:**
- Use writing-plans skill
- Create detailed task breakdown
- Estimate complexity

## CodeLayer-Specific Considerations

### When Designing UI Components

**Always check:**
- ShadCN component available? (Prefer over custom)
- Existing component similar? (Reuse patterns)
- Tailwind styling? (Never inline styles)
- Responsive? (Mobile considerations)
- Keyboard shortcuts? (Vim-style navigation)

### When Designing State Management

**Always consider:**
- Zustand store structure (flat vs nested)
- Computed selectors for derived state
- Persistence (localStorage? daemon?)
- Undo/redo needed?
- Real-time updates from daemon?

### When Designing Daemon Integration

**Always check:**
- API already exists in hld-sdk?
- Polling vs WebSocket vs one-time fetch?
- Error handling for daemon unavailable
- Fallback to local state?
- Testing with mock daemon

### When Designing for Performance

**Consider:**
- List virtualization for large datasets
- Debouncing for search/filter inputs
- Memoization of expensive computations
- Lazy loading of components
- Background tasks in Tauri

## Key Principles

| Principle | Application |
|-----------|-------------|
| **One question at a time** | Don't overwhelm, gather context methodically |
| **YAGNI ruthlessly** | Remove unnecessary features from all designs |
| **Explore alternatives** | Always propose 2-3 approaches before settling |
| **Incremental validation** | Present design in sections, validate each |
| **Follow patterns** | Check existing code for patterns to follow |
| **Document designs** | Write to docs/plans/ before implementing |

## Example: Brainstorming "Add Approval Preview"

**Phase 1: Understanding**
- Q: "Should preview show full request details or summary?"
- Q: "Should it be inline or modal?"
- Q: "Should it support markdown rendering?"
→ Answer: Modal with full details, markdown support

**Phase 2: Exploration**
- Option 1: Modal with Dialog component (simple, familiar)
- Option 2: Drawer slide-in (modern, more space)
- Option 3: Inline expansion (no overlay, but limited space)
→ Selected: Option 1 (Dialog)

**Phase 3: Design Presentation**
- Component: ApprovalPreview using ShadCN Dialog
- State: selectedApprovalId in store
- Flow: Click approval → store updates → modal opens
→ Validated section by section

**Phase 4: Documentation**
- Created `docs/plans/2025-10-23-approval-preview-design.md`
- Committed to git

**Phase 5: Ready**
- Confirmed TDD approach
- Ready to implement

## Integration with Other Skills

**After brainstorming:**
- Use **writing-plans** for detailed implementation breakdown
- Use **test-driven-development** for implementation
- Use **verification-before-completion** before committing

## Final Note

Good design comes from understanding, exploration, and validation. Don't skip phases. Don't rush to code.

**Announce at start:** "I'm using the brainstorming skill to refine your idea into a design."
