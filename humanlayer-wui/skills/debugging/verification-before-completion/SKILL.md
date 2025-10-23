---
name: verification-before-completion
description: Use when about to claim CodeLayer work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always
---

# Verification Before Completion for CodeLayer

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**CodeLayer context:** We have specific verification commands that MUST pass before claiming completion.

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## CodeLayer Verification Commands

| Claim | Required Command | Exit Code Must Be |
|-------|-----------------|-------------------|
| Tests pass | `bun test` | 0 |
| Lint passes | `bun run lint` | 0 |
| Types pass | `bun run typecheck` | 0 |
| All checks pass | `bun run check` | 0 |
| Build succeeds | `bun run build` | 0 |
| Tauri builds | `bun run tauri build` | 0 (rarely needed) |

**ALWAYS run from `humanlayer-wui/` directory**

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | `bun test` output: 0 failures | Previous run, "should pass" |
| Linter clean | `bun run lint` output: 0 errors | Partial check, extrapolation |
| Types correct | `bun run typecheck` output: 0 errors | "Looks right", editor OK |
| Bug fixed | Test reproducing bug: passes | Code changed, assumed fixed |
| Component works | Tests pass + UI verified | Tests only, no UI check |
| Store method works | Unit test passes + integration test passes | Unit test only |
| Daemon connection works | Live test with daemon running | Mocked test only |

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit without running `bun run check`
- Trusting hot-reload as verification
- Relying on partial verification (lint only, not typecheck)
- Thinking "just this once"
- **ANY wording implying success without having run verification**

## Key Patterns for CodeLayer

**Tests:**
```
✅ [Run: bun test] [Output: 34 pass] "All tests pass"
❌ "Should pass now" / "Tests look correct"
```

**Type checking:**
```
✅ [Run: bun run typecheck] [Output: Found 0 errors] "Types pass"
❌ "Editor shows no errors" / "Types look good"
```

**Linting:**
```
✅ [Run: bun run lint] [Output: 0 problems] "Lint passes"
❌ "Followed existing patterns" / "Should be clean"
```

**Full verification:**
```
✅ [Run: bun run check] [All pass] "All checks pass"
❌ "Tests pass so we're good"
```

**Regression tests (TDD Red-Green):**
```
✅ Write test → Run (FAIL) → Fix → Run (PASS) → Revert fix → Run (FAIL) → Restore → Run (PASS)
❌ "I've written a regression test" (without red-green verification)
```

**React Component:**
```
✅ [Tests pass] + [Manual UI check: renders correctly] "Component works"
❌ "Tests pass" (UI might be broken)
```

**Zustand Store:**
```
✅ [Unit test passes] + [Integration test passes] "Store method works"
❌ "Unit test passes" (integration might fail)
```

**Daemon Connection:**
```
✅ [Test with live daemon] [Connection succeeds] "Daemon integration works"
❌ "Mocked test passes" (real connection might fail)
```

## CodeLayer-Specific Verification Examples

### Before Claiming "Feature Complete"

```bash
cd humanlayer-wui
bun run check    # Runs format:check + lint + typecheck
bun test         # Runs all tests
# Check output: All pass?
# Then and only then: "Feature complete"
```

### Before Claiming "Bug Fixed"

```bash
# 1. Verify test for bug exists and failed
bun test path/to/bug.test.ts  # Should have failed before fix

# 2. Verify fix makes test pass
bun test path/to/bug.test.ts  # Should pass now

# 3. Verify no regressions
bun test                       # All other tests still pass

# 4. Verify types and lint
bun run check                  # All pass

# Then and only then: "Bug fixed"
```

### Before Claiming "Component Ready"

```bash
# 1. Unit tests pass
bun test src/components/MyComponent.test.tsx

# 2. Integration tests pass
bun test src/components/  # All component tests

# 3. Manually verify in UI
make codelayer-dev
# Actually use the component, check rendering, interactions

# 4. All checks pass
bun run check

# Then and only then: "Component ready"
```

### Before Claiming "Store Method Works"

```bash
# 1. Unit test for method
bun test src/AppStore.test.ts  # Specific test passes

# 2. All store tests pass
bun test src/AppStore.test.ts  # All tests pass

# 3. Integration test if applicable
bun test                       # Test components using method

# 4. Manual verification in UI
make codelayer-dev
# Actually trigger the method, verify state changes

# Then and only then: "Store method works"
```

## Rationalization Prevention

| Excuse | Reality | CodeLayer Solution |
|--------|---------|-------------------|
| "Should work now" | RUN the verification | `bun run check && bun test` |
| "I'm confident" | Confidence ≠ evidence | Run commands, see output |
| "Hot-reload looks good" | Hot-reload ≠ test suite | `bun test` |
| "Linter passed" | Linter ≠ types | `bun run typecheck` |
| "Types passed" | Types ≠ tests | `bun test` |
| "Tests passed" | Tests ≠ UI works | Manual UI check |
| "Just this once" | No exceptions | Always verify |

## Why This Matters for CodeLayer

From past failures:
- Claimed tests pass, actually had 3 failures
- Claimed types pass, actually had import errors
- Claimed component works, UI was broken
- Claimed daemon connected, socket path was wrong
- Time wasted on false completion → rework

**Trust is critical.** Verify or lose credibility.

## When To Apply

**ALWAYS before:**
- ANY claim of success/completion
- ANY expression of satisfaction
- Committing code
- Creating PRs
- Moving to next task
- Saying "done", "works", "fixed", "passes"

**Apply to:**
- Exact phrases
- Paraphrases and synonyms
- Implications of success
- ANY communication suggesting completion/correctness

## Pre-Commit Checklist

```bash
# Before every git commit in humanlayer-wui:
cd humanlayer-wui
bun run check     # Format, lint, typecheck
bun test          # All tests
git status        # Review what's changing
git diff          # Review actual changes
# Then commit
```

## The Bottom Line

**No shortcuts for verification.**

Run the command. Read the output. THEN claim the result.

This is non-negotiable.

## Quick Reference

```bash
# Single source of truth for "ready to commit":
cd humanlayer-wui
bun run check && bun test
# Exit code 0? THEN you can claim success.
# Exit code non-zero? Fix issues first.
```
