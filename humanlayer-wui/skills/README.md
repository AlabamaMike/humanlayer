# CodeLayer Skills

This directory contains the skills library for CodeLayer, adapted from [obra/superpowers](https://github.com/obra/superpowers).

## Structure

```
skills/
├── testing/
│   └── test-driven-development/     # TDD workflow
├── debugging/
│   ├── systematic-debugging/         # Four-phase debugging
│   └── verification-before-completion/ # Evidence-based verification
└── collaboration/
    ├── brainstorming/                # Design refinement
    ├── writing-plans/                # Implementation planning
    └── executing-plans/              # Batch execution
```

## Quick Reference

| Skill | Use When | Command |
|-------|----------|---------|
| test-driven-development | Implementing features/fixes | `/tdd` |
| systematic-debugging | Encountering bugs | `/debug` |
| verification-before-completion | Before committing | Auto-activates |
| brainstorming | Designing features | `/brainstorm` |
| writing-plans | Planning implementation | `/write-plan` |
| executing-plans | Executing plans | `/execute-plan` |

## Documentation

See [../SKILLS.md](../SKILLS.md) for comprehensive documentation on how to use these skills.

## Adaptation

These skills have been customized for CodeLayer:
- Bun test commands (`bun test`, `bun run check`)
- React 19 patterns (no forwardRef)
- Zustand state management
- ShadCN components
- Tailwind CSS styling
- Tauri desktop integration
- Daemon communication patterns

## Credits

Original skills by Jesse Vincent ([obra/superpowers](https://github.com/obra/superpowers))
Adapted for CodeLayer by HumanLayer team
