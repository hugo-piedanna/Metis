# Branch Management Policy

This policy defines the rules for managing branches in the **Metis** project to ensure structured, stable, and collaborative development.

## Main Branches

### `main` (Production)

**Protected branch**

- Contains only stable code that is ready for production.
- Should only be updated via **merge requests (MR)** from `develop`.
- Each merge must be validated and pass all tests.

### `develop` (Development)

**Main branch of development**

- Contains the latest status of ongoing development.
- Receives **merge requests** from issue branches.
- Each merge must be validated by a code review and pass all tests.
- May be unstable but must always be in working order.

## Temporary branches

Each **issue** (feature, bug fix, UI improvement, refactoring, etc.) must be developed in a dedicated branch.

#### **Branch name format :**

type/xxx-issue-name

- `type` : category of change among :
  - `feat` → feature
  - `fix` → Bug fix
  - `ui` → UI/UX update
  - `refactor` → Code refactoring
  - `docs` → Documentation
  - `test` → Add/update tests
  - `chore` → Maintenance (dependencies, configurations, etc.)
- `xxx` : GitHub issue number
- `nom-issue` : short description in **kebab-case**.
