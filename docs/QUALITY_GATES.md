# QUALITY_GATES

## Required

- Security scan
- Lint
- Schema validation
- Tests

## Commands

```bash
# Full project checklist (recommended)
python .opencode/scripts/checklist.py .

# Individual runners (used by checklist)
python .opencode/skills/vulnerability-scanner/scripts/security_scan.py .
python .opencode/skills/lint-and-validate/scripts/lint_runner.py .
python .opencode/skills/testing-patterns/scripts/test_runner.py .
python .opencode/skills/frontend-design/scripts/ux_audit.py .
python .opencode/skills/seo-fundamentals/scripts/seo_checker.py .
```

## Notes

- `npm test` is currently a placeholder and should be replaced once Sprint-01 adds a real test harness (`package.json`).
- Non-interactive behavior is a first-class constraint for CLI work; avoid prompts and require safe defaults when `process.stdin.isTTY == false`.
