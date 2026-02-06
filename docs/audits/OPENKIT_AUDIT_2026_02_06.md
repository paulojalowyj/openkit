# OpenKit Consistency Audit (2026-02-06)

## Scope

Audit targets:
- CLI (init/doctor), package metadata
- Committed docs (README + docs/)
- OpenKit runtime assets (.opencode/commands, .opencode/prompts, .opencode/skills, .opencode/rules)

Goal:
- Identify inconsistencies, incorrect interactions, and stale references
- Apply small, low-risk fixes immediately
- Leave larger refactors as backlog items

## Inventory (current repo)

- Tracked files: 291
- Prompts: 17 files in `.opencode/prompts/`
- Commands: 18 files in `.opencode/commands/` (excluding README)
- Skills: 33 skill dirs in `.opencode/skills/`
- Rules: 6 files in `.opencode/rules/`

## Small Fixes Applied

### 1) Agent file paths were wrong across the repo

Problem:
- Documentation and some runtime docs referenced `.opencode/agents/*.md`, but the repo actually uses `.opencode/prompts/*.md`.
- This caused:
  - Broken paths in docs
  - `openkit doctor` checking for a non-existent file

Fixes:
- Updated references from `.opencode/agents/` -> `.opencode/prompts/` in:
  - `docs/AGENTS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/FAQ.md`
  - `docs/EXTENDING.md`
  - `docs/CONTRIBUTING.md`
  - `README.md`
  - `.opencode/prompts/orchestrator.md`
  - `.opencode/commands/engineer.md`
  - `.opencode/commands/README.md`
  - `.opencode/rules/MASTER.md`
  - `.opencode/rules/TOOL_USAGE.md`
  - `.opencode/rules/README.md`
- Updated `openkit doctor` to check `.opencode/prompts/backend-specialist.md` instead:
  - `bin/cli.js`
  - `.opencode/bin/cli.js`

### 2) Command count drift (13 vs 18)

Problem:
- `docs/README.md` and `docs/FAQ.md` claimed 13 commands, but `.opencode/commands/` contains 18.

Fixes:
- Updated counts to 18 in:
  - `docs/README.md`
  - `docs/FAQ.md`

### 3) Missing skill references

Problem:
- Some docs referenced skills that do not exist under `.opencode/skills/`:
  - `docker-expert`, `security-hardening`, and example-only skills in `docs/CONTRIBUTING.md`

Fixes:
- Replaced with existing skills or removed placeholder skill tags:
  - `docs/AGENTS.md`
  - `docs/CONTRIBUTING.md`

### 4) CLI/package messages referenced stale model env configuration

Problem:
- `package.json` description still instructed `OPENCODE_AGENT_MODEL_*` env vars.
- `package.json` included `.env.example.openkit` in published files, but the template was removed.
- `.gitignore` still had an exception for `.env.example.openkit`.

Fixes:
- Updated `package.json` description, removed `.env.example.openkit`, removed `glm` keyword.
- Removed `.env.example.openkit` exception from `.gitignore`.
- Removed the `.env.example.openkit` creation flow and env-var instructions from `bin/cli.js`.

### 5) Misc drift

- Root `AGENTS.md` was empty and now points to `docs/AGENTS.md`.
- `.opencode/bin/cli.js` referenced a legacy package name; updated to `npx @paulojalowyj/openkit init`.

## Findings / Backlog (not fixed yet)

1) Document the new model configuration standard
- Current direction: `opencode.json` remains for tools/agents/permissions, but models/providers are runtime-managed.
- Ensure all docs describe this split consistently.

2) "Primary agents" vs shipped prompts
- Docs mention 4 primary agents (`build`, `plan`, `chat`, `orchestrator`), but only prompts for `chat` and `orchestrator` exist in `.opencode/prompts/`.
- Decide whether `build`/`plan` should:
  - Be shipped as prompts, or
  - Be removed/marked optional in docs.

3) Dual CLI implementations
- There are two CLI entrypoints:
  - `bin/cli.js` (main)
  - `.opencode/bin/cli.js` (template/legacy)
- They diverge in behavior and versioning. Decide which one is canonical and whether `.opencode/bin/cli.js` should be distributed.

## Next Pass Suggestions

For the next audit iteration (deeper, file-by-file):
- Verify every doc link path resolves (commands, prompts, rules, scripts)
- Validate every script path referenced in rules/prompts exists
- Standardize terminology: "agent prompt" vs "agent file" across docs
- Decide and document the runtime configuration standard (and update CLI accordingly)

## Pass 2 Updates (2026-02-06)

### A) Configuration standard consolidated

- Confirmed split standard and aligned docs:
  - `opencode.json`: tools, agents, permissions
  - runtime environment: model/provider selection
- Updated wording to avoid ambiguity in:
  - `README.md`
  - `docs/ARCHITECTURE.md`
  - `docs/EXTENDING.md`
  - `.opencode/rules/README.md`
  - `.opencode/rules/TOOL_USAGE.md`

### B) Core package-by-package sweep completed

1. `.opencode/ARCHITECTURE.md`
- Removed stale references to non-existent skills (`docker-expert`, `prisma-expert`)
- Removed stale model-tier wording (GLM Thinking/Core/Lite)
- Fixed script path typo (`script/auto_preview.py` -> `scripts/auto_preview.py`)

2. `.opencode/rules/*`
- Fixed stale wording "agent markdown files" -> "prompt markdown files"
- Fixed broken related link to non-existent `.opencode/skills/README.md` -> `docs/SKILLS.md`
- Fixed stale LSP config path (`.opencode/lsp.json`) to runtime configuration wording

3. `.opencode/prompts/*`
- Fixed broken script path namespace in orchestrator/planner prompts:
  - `.openco../skills/.internal/...` -> `.opencode/skills/...`

### C) Reference integrity checks run

- Checked `.opencode/...` path references in architecture/rules/prompts/commands: no missing paths.
- Checked `@[skills/... ]` references across `.opencode` + `docs`: no missing skills.

## Remaining Backlog

1) Primary agent docs vs shipped prompts
- Docs still mention primary `build` and `plan` agents while only `chat` and `orchestrator` prompts are present.
- Decide whether to ship those prompts or mark them as optional/runtime-defined.

## Pass 3 Updates (2026-02-06)

### Full emoji cleanup completed

- Applied repository-wide emoji normalization on tracked text files (`.md`, `.js`, `.json`, `.py`, `.yml`, `.yaml`, `.txt`, `.toml`, `.ini`).
- Cleaned 103 files across:
  - `.opencode/prompts`
  - `.opencode/commands`
  - `.opencode/rules`
  - `.opencode/skills`
  - `.opencode/scripts`
  - `docs/`, `README.pt-BR.md`, `PACKAGE_STATUS.md`, `bin/cli.js`, `scripts/*`
- Validation rerun confirms no tracked text file currently contains emoji characters.

### Post-cleanup review completed

- Normalized Markdown heading spacing after emoji removal (`##  Title` -> `## Title`).
- Revalidated CLI syntax (`bin/cli.js` and `.opencode/bin/cli.js`) after string cleanup.
- Checked for suspicious broken references in prompts/rules/architecture after normalization.
