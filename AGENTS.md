# AGENTS.md — Development Guidelines & Standards

This document defines the operational standards, workflow policies, and engineering discipline expected from all contributors—both AI agents and human developers—working on this site.

---

## 1. Git Workflow & Version Control

### 1.1 Atomic Commits
- **Single Responsibility**: Every commit MUST represent a single, self-contained logical change (e.g., adding a specific helper function, updating a single test file, fixing a specific bug).
- **No Kitchen-Sink Commits**: Never mix refactoring, formatting changes, and new features in the same commit.
- **Build Integrity**: The codebase MUST pass all tests and build successfully at every commit in the history.

### 1.2 Commit Message Format
All commit messages MUST follow the **Conventional Commits** specification:

```text
<type>(<scope>): <short imperative summary>

[optional body explaining WHY and WHAT]

[optional footer(s), e.g., Fixes #123]
```

#### Allowed Types
- `feat`: A new feature or capability.
- `fix`: A bug fix.
- `docs`: Documentation changes only (`README`, specs, code comments).
- `style`: Formatting, missing semi-colons, whitespace changes (no logic change).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Maintenance tasks, dependency updates, build configuration.
- `perf`: Code changes that improve performance.
- `ci`: CI/CD configuration and workflow updates.

#### Examples
- `feat(amm): implement constant-product market maker calculation`
- `fix(auth): correct token validation check for Google Workspace OIDC`
- `docs(spec): update seasonal Work Bux distribution rules`
- `test(market): add unit tests for market resolution edge cases`

---

## 2. Branching Strategy

- **`main`**: Production-ready branch. Direct pushes are prohibited; changes require Pull Requests.
- **`dev`**: Primary integration branch for active development.
- **Feature Branches**: `feat/<issue-id>-<short-description>` (e.g., `feat/MF-42-slack-notifications`)
- **Bugfix Branches**: `fix/<issue-id>-<short-description>` (e.g., `fix/MF-108-amm-rounding-error`)
- **Documentation & Chores**: `docs/<topic>` or `chore/<topic>`

### Pull Requests & Code Review
- Keep PRs small and focused.
- All CI checks (linting, type checking, unit tests) must pass before merging.
- Prefer rebasing feature branches onto `dev` to maintain a clean linear git history.

---

## 3. Test Coverage & Quality Assurance

### 3.1 Coverage Standards
- **Core Business Logic**: AMM algorithms, market state transitions, Work Bux accounting, and authorization rules require **>= 90% unit test coverage**.
- **API & Integrations**: Slack webhooks and GCP endpoints require integration tests covering both happy paths and failure modes.
- **UI Components**: Critical interactive flows (placing a prediction, viewing active markets) require component/end-to-end tests.

### 3.2 Verification Discipline
- **No Unverified Declarations**: Never claim a task or feature is complete without executing test suites or build commands and verifying clean output.
- **No Masking Errors**: Do not write empty `catch` blocks, swallow exceptions, or lower test assertions to pass a build. Fix the underlying root cause.

---

## 4. Documentation Hygiene & Living Specs

### 4.1 Zero README Setup Drift
- Update [`README.md`](README.md) whenever a change modifies developer setup, prerequisites, environment variables, dependencies, CLI commands, or local run procedures.
- Do not let instructions in `README.md` fall out of sync with actual codebase requirements.

### 4.2 Living Specifications & Architecture
- Product rules and features defined in [`docs/spec.md`](docs/spec.md) and technical architecture in [`docs/architecture.md`](docs/architecture.md) are living documents.
- When core business rules, domain schemas, or infrastructure components are added or modified, update the corresponding specifications in `docs/` in the same PR or commit.

### 4.3 Architectural Decision Records (ADRs)
- Store major technical decisions in [`docs/adr/`](docs/adr/) using the format `000X-<short-title>.md`.
- Create an ADR whenever making non-trivial decisions regarding database choices, AMM mathematical models, security models, or third-party framework adoptions.
- Each ADR must specify: **Status** (Proposed/Accepted/Superseded), **Context**, **Decision**, and **Consequences**.

---

## 5. Changelog Maintenance

- Maintain [`CHANGELOG.md`](CHANGELOG.md) following the [Keep a Changelog](https://keepachangelog.com/) standard.
- Any commit or PR that adds a user-facing feature (`feat`), fixes a bug (`fix`), or introduces breaking changes MUST append an entry under the `[Unreleased]` header.
- Group changelog entries by: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, or `Security`.

---

## 6. Agent Memory & Persistent Context Protocol

- AI agents must maintain and reference the persistent context file at [`.agents/context.md`](.agents/context.md).
- **At Start of Task**: AI agents should read `.agents/context.md` to load recent architecture insights, known gotchas, active technical debt, and environment quirks.
- **At End of Task**: When discovering non-obvious repository behavior, environmental quirks, or key architectural decisions during a task, the AI agent must record a concise note in `.agents/context.md`.

---

## 7. Code Hygiene & Security Standards

### 7.1 Type Safety & Static Analysis
- Enforce strict type checking (`tsc`, Python type annotations) and linting (`eslint`, `ruff`).
- Suppressing lints or type checks (`@ts-ignore`, `any`, `# type: ignore`) is prohibited unless accompanied by an explicit inline explanation justifying why it is unavoidable.

### 7.2 Zero Secrets & Security Boundaries
- Never commit passwords, API keys, GCP service account keys, Slack tokens, or OAuth secrets to Git.
- Ensure `.env` and secret patterns remain strictly listed in [`.gitignore`](.gitignore).

### 7.3 No Leftover Debugging Artifacts
- Clean up all temporary `console.log` statements, `print` calls, `debugger` breakpoints, commented-out dead code, and scratch files before staging commits.

---

## 8. Issue Logging & Tracking

When identifying bugs, technical debt, or new requirements during development:

1. **Check Existing Issues**: Avoid creating duplicate tickets.
2. **Issue Format**:
   - **Title**: Clear, descriptive summary (e.g., `[Bug] TITLE OF BUG`).
   - **Context / Background**: Brief description of the module affected.
   - **Steps to Reproduce**: Detailed steps for bugs.
   - **Expected vs. Actual Behavior**: Concrete explanation of the divergence.
   - **Acceptance Criteria**: Checkable list of conditions required to close the issue.
3. **Commit Linking**: Reference the issue key in commit messages (e.g., `fix: TITLE OF FIX (Fixes #45)`).