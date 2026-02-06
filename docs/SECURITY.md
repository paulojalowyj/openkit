# SECURITY

## Threats

- Path traversal / arbitrary write: attacker-controlled paths or `..` segments during any copy/upgrade operation.
- Symlink attacks: overwriting files outside the project root via symlinks.
- Partial upgrades: process failure mid-write leaving the install in an inconsistent state.
- Unsafe CI defaults: non-interactive mode overwriting user customizations.

## Controls

- Explicit ignore patterns exist for template copying (`bin/cli.js` `IGNORED_PATTERNS`).
- Quality baseline includes a security scan runner (`.opencode/skills/vulnerability-scanner/scripts/security_scan.py`).

## Gaps

- `openkit upgrade` is not implemented yet (planned in `docs/requirements/cli-upgrade/PLAN.md`).
- No real test suite is wired via `npm test` yet (`package.json`).

## Prioritized Actions

- Implement `openkit upgrade` with strict path normalization, no symlink following, and write boundaries anchored to the project directory.
- Add backups + atomic writes for any overwrite/removal path (rollback-friendly).
- Add a real unit/integration test harness for planner/applier logic and CI-safe behavior.
