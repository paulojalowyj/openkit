# ADR 0001: Prevent Incorrect OpenKit Installation

**Status:** Accepted  
**Date:** 2026-02-06  
**Decision Makers:** OpenKit Team  
**Technical Story:** Users were installing OpenKit as a project dependency instead of using npx

---

## Context

OpenKit is a CLI tool designed to be executed via `npx @paulojalowyj/openkit init` to scaffold the OpenCode Agent System framework into user projects. However, users were frequently installing it incorrectly:

1. **Adding to package.json**: `npm install @paulojalowyj/openkit` or `npm install --save @paulojalowyj/openkit`
2. **Importing as a module**: `require('@paulojalowyj/openkit')` or `import openkit from '@paulojalowyj/openkit'`

This created confusion because:
- OpenKit doesn't need to persist as a runtime dependency
- The package exports no useful programmatic API
- Users expected library behavior from a CLI tool

## Decision

We will implement **three complementary mechanisms** to prevent incorrect installation and guide users to the correct usage pattern:

### 1. Postinstall Warning (Educational)
- **File:** `bin/postinstall-check.js`
- **Trigger:** When npm installs OpenKit as a dependency (detected via `INIT_CWD` env var)
- **Action:** Display warning message explaining correct usage
- **Implementation:** Uses native Node.js modules (no external deps), outputs to stderr for visibility

### 2. Import/Require Blocker (Technical)
- **File:** `index.js` (main entry point)
- **Trigger:** When code attempts `require()` or `import`
- **Action:** Display error message and exit with code 1
- **Implementation:** Replaces programmatic exports with error message

### 3. Package Metadata (Preventive)
- **File:** `package.json`
- **Updates:**
  - `description`: Explicitly states "Use 'npx @paulojalowyj/openkit init' (not npm install)"
  - `keywords`: Added `cli-tool`, `npx-only`, `no-install-needed`
  - `scripts.postinstall`: Points to check script
- **Purpose:** Visible on npm registry before installation

### 4. Enhanced Success Message (Guidance)
- **File:** `bin/cli.js` (init command)
- **Trigger:** After successful `npx @paulojalowyj/openkit init`
- **Action:** Display clear next steps with emphasis on `opencode` command
- **Implementation:** Visual borders, colored output, command examples

## Alternatives Considered

### A. Preinstall Script (Rejected)
```json
{
  "scripts": {
    "preinstall": "exit 1 with error message"
  }
}
```
**Reason for rejection:** Would block `npx` which also performs temporary installation

### B. Empty Package (Rejected)
Publish OpenKit as a stub that only shows error message.

**Reason for rejection:** 
- Breaks legitimate use cases (like CI checking package version)
- Npm registry would show "no files" warning
- Users couldn't inspect package contents

### C. Dual Entry Points (Rejected)
Provide both CLI and programmatic API.

**Reason for rejection:**
- Increases maintenance burden
- No clear use case for programmatic API
- Contradicts tool's purpose (scaffold once, then exit)

## Consequences

### Positive
- **Clear guidance**: Users see helpful messages at multiple touchpoints
- **Better DX**: First-time users immediately understand correct workflow
- **Reduced support**: Fewer GitHub issues about "OpenKit not working"
- **Non-breaking**: Doesn't prevent any legitimate use case
- **Graceful**: Educational rather than aggressive blocking

### Negative
- **Extra file**: `bin/postinstall-check.js` adds ~2KB to package
- **Noise in logs**: Postinstall runs on every `npm install` (but only warns if dependency detected)
- **Not foolproof**: Users can still force-install if determined

### Neutral
- **Module system change**: `index.js` no longer exports, but there were no documented exports anyway
- **Package.json changes**: Visible in npm metadata but doesn't affect functionality

## Implementation Details

### Detection Logic
```javascript
// bin/postinstall-check.js
const initCwd = process.env.INIT_CWD; // Where npm install was run
const parentPackageJson = join(initCwd, 'package.json');
const pkg = JSON.parse(readFileSync(parentPackageJson, 'utf8'));

if (pkg.dependencies?.['@paulojalowyj/openkit'] || 
    pkg.devDependencies?.['@paulojalowyj/openkit']) {
  // Show warning
}
```

### Message Template
All messages follow this structure:
1. **Problem statement**: "OpenKit detected as a project dependency"
2. **Explanation**: Why this is incorrect
3. **Solution**: Exact commands to use (`npx init`, `npx upgrade`, `opencode`)
4. **Remediation**: How to remove if already installed

### Color Coding
- **Yellow**: Warning header
- **White**: Explanatory text
- **Cyan**: Command examples
- **Gray**: Optional/secondary info

## Verification

Testing scenarios:
1. ✅ `npm install @paulojalowyj/openkit` → Shows warning
2. ✅ `require('@paulojalowyj/openkit')` → Blocks with error
3. ✅ `npx @paulojalowyj/openkit init` → Shows success message with `opencode` guidance
4. ✅ Metadata visible on npm registry page

## References

- npm postinstall hooks: https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts
- INIT_CWD environment variable: https://docs.npmjs.com/cli/v10/using-npm/scripts#environment
- CLI tool patterns: https://github.com/sindresorhus/meow
- Exit codes: https://nodejs.org/api/process.html#processexitcode

## Rollout Plan

1. **Phase 1**: Test locally with tarball installation (Done)
2. **Phase 2**: Update documentation (This ADR, README, CHANGELOG)
3. **Phase 3**: Publish to npm as patch version
4. **Phase 4**: Monitor GitHub issues for user feedback
5. **Phase 5**: Iterate on messaging if confusion persists

## Success Metrics

- Reduction in GitHub issues tagged "installation" or "setup"
- Increase in successful `npx init` executions (tracked via analytics if implemented)
- Community feedback on clarity of messages

---

**Notes:**
- This decision can be revisited if npm introduces better mechanisms for "npx-only" packages
- Messages are in English only (internationalization can be added later)
- No emojis used per project coding standards
