# CONTEXT

**Created**: 2026-02-06
**Scope**: Full (CLI framework package)

## Executive Summary (10 bullets)

- This repo is a Node.js ESM CLI package published as `@paulojalowyj/openkit` with the `openkit` binary (`package.json`).
- The CLI entrypoint is `bin/cli.js` and currently implements `openkit init` and `openkit doctor` (`bin/cli.js`).
- The OpenKit runtime payload is shipped inside `.opencode/` and `opencode.json` (see `package.json` `files`).
- Sprint-01 (CLI upgrade) is specified under `docs/requirements/cli-upgrade/` and tracked in `docs/sprint/Sprint-01/`.
- Sprint-02 (docs standardization) is specified under `docs/requirements/docs-standardization/` and tracked in `docs/sprint/Sprint-02/`.
- `npm test` is currently a placeholder and does not run a real test suite (`package.json`).
- Project validation is enforced via `.opencode/scripts/checklist.py`, which runs security/lint/schema/tests/UX/SEO checks.
- The highest-risk work for Sprint-01 is safe filesystem mutation (path traversal/symlinks, partial writes, backups).
- Non-interactive behavior matters: the CLI already detects TTY for prompts; `upgrade` must default to safe behavior in CI (`bin/cli.js`).
- Release process is node-based (`scripts/prepare.js`, `scripts/update-version.js`) and package files are explicitly whitelisted (`package.json`).

## Repository Map

| Area | Path(s) | Notes |
|---|---|---|
| CLI | `bin/cli.js` | Commander-based CLI (init/doctor today)
| Agent system payload | `.opencode/` | Commands, prompts, skills, rules, scripts
| Runtime config | `opencode.json` | OpenCode runtime configuration used by installs
| Docs | `docs/` | Framework docs + requirements + sprint tracking
| Blueprints | `blueprints/` | Optional project scaffolds installed by `init`

## Key Flows

1. Install framework (init): `openkit init` -> copy `.opencode/` + `opencode.json` into target project (`bin/cli.js`).
2. Health check (doctor): `openkit doctor` -> verifies `.opencode/` layout in target project (`bin/cli.js`).
3. Quality validation: `python .opencode/scripts/checklist.py .` -> runs core checks (security/lint/schema/tests/UX/SEO) (`.opencode/scripts/checklist.py`).

## Evidence

- `package.json`: `"type": "module"` and `"bin": { "openkit": "bin/cli.js" }`.
- `package.json`: `"test": "echo \"No tests yet - implement integration tests\""` (placeholder test script).
- `bin/cli.js`: defines `.command('init')` and `.command('doctor')`; no `upgrade` command yet.
- `docs/sprint/Sprint-01/SPRINT_GOAL.md`: Sprint-01 targets a secure `openkit upgrade` flow.
- `docs/requirements/cli-upgrade/PLAN.md`: describes flags/exit codes and a manifest-driven algorithm.
