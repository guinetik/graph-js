---
title: "Testing Strategy"
created: "2025-01-03"
tags: [testing, tests, coverage]
category: "advanced"
related: []
status: "complete"
aliases: ["testing", "tests"]
---

# Testing Strategy

Overview of the testing architecture and coverage in graph-js.

## Test Framework

graph-js uses **Vitest** for testing:
- Fast test runner
- Jest-compatible API
- Built-in coverage support

## Test Structure

Tests are co-located with source files:
```
src/
  graph.js
  graph.test.js
  statistics/
    algorithms/
      node-stats.js
      node-stats.test.js
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

## Coverage

Test coverage includes:
- Unit tests for all algorithms
- Integration tests for API
- Worker tests for parallel computation
- Layout tests for visualization

## Related Notes

- See test files in `src/` directory for examples


