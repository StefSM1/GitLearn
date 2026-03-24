---
trigger: always_on
---

## Code Style
- Use TypeScript with strict mode enabled
- All functions must have JSDoc comments
- No any types — use proper interfaces
- Every component must have a .test.tsx file

## Architecture
- Use functional React components, never class components
- State management via Zustand (not Redux)
- API calls through a dedicated /api service layer

## Safety
- Never hardcode secrets or API keys
- Always validate user input before processing
- Prefer immutable operations — avoid mutating state directly

## Workflow
- Always create a plan artifact before writing code
- Run tests after every change
- Commit with descriptive messages using conventional commits

## Reflect & Anticipate: 
Before finalizing any task, output a <reflection> block. Analyze why the user requested this, predict potential edge cases, and ensure no change requests will be needed. Do not mark task complete until certain.

## Test-Driven: 
Write Jest/Playwright tests only for critical paths (e.g., database schema logic, API routing). Skip UI testing to preserve daily usage limits.