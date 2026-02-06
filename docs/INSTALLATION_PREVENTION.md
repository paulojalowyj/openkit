# Installation Prevention Mechanisms

This document describes the technical implementation of OpenKit's installation prevention system.

## Overview

OpenKit implements a three-layer defense system to prevent incorrect installation and guide users toward the correct `npx` workflow:

1. **Postinstall Warning** - Educational message when installed as dependency
2. **Import Blocker** - Technical prevention of module imports
3. **Package Metadata** - Preemptive guidance on npm registry

## Architecture

```
User Action
    ↓
┌─────────────────────────────────────────┐
│ npm install @paulojalowyj/openkit      │ ← INCORRECT
└─────────────────────────────────────────┘
    ↓
    ├─→ [1] Postinstall Hook Executes
    │       ├─ Detects INIT_CWD env var
    │       ├─ Reads parent package.json
    │       ├─ Finds OpenKit in dependencies
    │       └─ Displays warning to stderr
    │
    └─→ [2] User tries require/import
            ├─ index.js main entry executes
            ├─ Displays error message
            └─ process.exit(1)

┌─────────────────────────────────────────┐
│ npx @paulojalowyj/openkit init         │ ← CORRECT
└─────────────────────────────────────────┘
    ↓
    └─→ [3] CLI executes successfully
            └─ Shows success message with `opencode` next steps
```

## Component Details

### 1. Postinstall Hook (`bin/postinstall-check.js`)

**Purpose:** Detect and warn when OpenKit is installed as a project dependency.

**Trigger Condition:**
```javascript
const initCwd = process.env.INIT_CWD; // npm sets this to user's working directory
const parentPkg = join(initCwd, 'package.json');
const pkg = JSON.parse(readFileSync(parentPkg, 'utf8'));

if (pkg.dependencies?.['@paulojalowyj/openkit'] || 
    pkg.devDependencies?.['@paulojalowyj/openkit']) {
  // User installed OpenKit as dependency - show warning
}
```

**Key Design Decisions:**
- Uses **only native Node.js modules** (no chalk/inquirer)
  - Reason: Dependencies may not be installed yet during postinstall
  - Solution: ANSI color codes via `\x1b[33m` escape sequences
  
- Outputs to **stderr** (not stdout)
  - Reason: npm suppresses stdout from postinstall by default
  - Solution: `console.error()` ensures visibility
  
- Uses **INIT_CWD** instead of `__dirname`
  - Reason: Symlinked installs (`file:` protocol) resolve to original path
  - Solution: `INIT_CWD` always points to where `npm install` was executed

**Message Structure:**
1. Problem identification (yellow text)
2. Explanation (white text)
3. Correct commands (cyan text)
4. Remediation steps (gray text)

**Exit Behavior:** 
- Does NOT fail the installation (exit 0)
- Allows installation to complete so user can uninstall cleanly
- Non-blocking educational approach

### 2. Import Blocker (`index.js`)

**Purpose:** Prevent programmatic usage of OpenKit as a module.

**Implementation:**
```javascript
// index.js replaces normal exports with:
console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OpenKit should not be imported as a module

Use via npx:
  npx @paulojalowyj/openkit init
  opencode
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
process.exit(1);
```

**Behavior:**
- Blocks both `require('@paulojalowyj/openkit')` and `import` statements
- Exits with code 1 (failure) to break consuming code
- Shows clear error message with correct usage

**Trade-offs:**
- ❌ Breaks programmatic access (intentional)
- ✅ Forces users to use correct CLI workflow
- ✅ Fails fast with helpful guidance

### 3. Package Metadata (`package.json`)

**Purpose:** Prevent installation before it happens via npm registry visibility.

**Changes:**
```json
{
  "description": "Use 'npx @paulojalowyj/openkit init' (not npm install). OpenKit is a CLI tool...",
  "keywords": [
    "cli-tool",
    "npx-only", 
    "no-install-needed"
  ],
  "scripts": {
    "postinstall": "node bin/postinstall-check.js"
  }
}
```

**Visibility:**
- Description shown on npm package page
- Keywords aid discoverability of correct usage
- Users searching "npx-only" find OpenKit as example

### 4. Enhanced Success Message (`bin/cli.js`)

**Purpose:** Guide users to next correct step after successful init.

**Implementation:**
```javascript
console.log(chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log(chalk.green(' ✓ OpenKit installed successfully!'));
console.log(chalk.green('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log('');
console.log(chalk.cyan(' Next steps:'));
console.log('');
console.log(chalk.white('  1. Start OpenCode in your project:'));
console.log(chalk.yellow('     opencode'));  // ← Emphasized
console.log('');
console.log(chalk.white('  2. Use available commands:'));
console.log(chalk.gray('     /engineer   - Universal builder'));
console.log(chalk.gray('     /plan       - Create plan'));
// ...
```

**Design:**
- Visual hierarchy with colored borders
- `opencode` command is step 1 (yellow highlight)
- Examples of available commands
- Blueprint-specific instructions when applicable

## Testing

### Manual Test Scenarios

**Test 1: Install as Dependency**
```bash
mkdir /tmp/test-install
cd /tmp/test-install
npm init -y
npm install --save @paulojalowyj/openkit

# Expected: Warning message appears during installation
```

**Test 2: Attempt Import**
```bash
cd /tmp/test-install
node -e "require('@paulojalowyj/openkit')"

# Expected: Error message and exit code 1
```

**Test 3: Correct Usage**
```bash
mkdir /tmp/test-npx
cd /tmp/test-npx
npx @paulojalowyj/openkit init

# Expected: Success message with opencode guidance
```

### Automated Testing

**Postinstall Detection:**
```javascript
// Test that INIT_CWD detection works
process.env.INIT_CWD = '/tmp/test';
const pkg = { dependencies: { '@paulojalowyj/openkit': '^0.2.0' } };
// Mock fs.readFileSync to return pkg
// Assert: Warning message generated
```

**Import Blocking:**
```javascript
// Test that index.js exits
const { execSync } = require('child_process');
try {
  execSync('node -e "require(\\"@paulojalowyj/openkit\\")"');
  assert.fail('Should have exited with error');
} catch (err) {
  assert.equal(err.status, 1);
}
```

## Environment Variables

| Variable | Set By | Purpose | Example |
|----------|--------|---------|---------|
| `INIT_CWD` | npm | Directory where `npm install` was executed | `/home/user/my-project` |
| `npm_package_json` | npm | Path to package being installed (not reliable for detection) | `/tmp/node_modules/@paulojalowyj/openkit/package.json` |

## Edge Cases

### 1. npx Temporary Installation
**Scenario:** `npx @paulojalowyj/openkit init` temporarily installs the package

**Behavior:**
- `INIT_CWD` points to npm cache directory (e.g., `/tmp/npx-...`)
- `package.json` doesn't exist in cache dir
- Postinstall exits silently (no warning)

**Why it works:** Detection only triggers if parent package.json exists and contains OpenKit

### 2. Symlinked Installation
**Scenario:** `npm install file:/path/to/openkit`

**Behavior:**
- npm creates symlink in node_modules
- `__dirname` resolves to original path (not node_modules)
- `INIT_CWD` still points to user's project

**Why it works:** We use `INIT_CWD` instead of `__dirname`

### 3. Global Installation
**Scenario:** `npm install -g @paulojalowyj/openkit`

**Behavior:**
- `INIT_CWD` points to global node_modules
- No package.json in global scope (or it's npm's own)
- Postinstall exits silently

**Why it works:** Global installs have no user package.json to check

### 4. Workspace/Monorepo
**Scenario:** OpenKit installed in workspace package

**Behavior:**
- `INIT_CWD` points to workspace root or package dir
- Detects OpenKit in package.json
- Shows warning

**Why it works:** Same detection logic applies

## Limitations

1. **User Determination:** Advanced users can suppress warnings or ignore errors
   - Mitigation: Educational approach, not hard block

2. **CI/CD Noise:** Postinstall runs in CI if accidentally added to package.json
   - Mitigation: Warning visible in logs, easy to spot

3. **Non-Interactive Mode:** Can't prompt user for confirmation
   - Mitigation: Messages include remediation steps

4. **Language:** Messages only in English
   - Future: Could detect locale and show translated messages

## Future Enhancements

- **Telemetry:** Track how often warnings appear (opt-in)
- **Auto-fix:** Offer to remove from package.json automatically
- **npm preinstall warning:** Show message before download starts (npm feature request)
- **Localization:** Support for multiple languages
- **Smarter detection:** Recognize CI environments and adjust messaging

## References

- npm scripts lifecycle: https://docs.npmjs.com/cli/v10/using-npm/scripts
- Environment variables: https://docs.npmjs.com/cli/v10/using-npm/scripts#environment
- ANSI color codes: https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797
- Node.js process.exit: https://nodejs.org/api/process.html#processexitcode

## Related Documentation

- [ADR 0001: Prevent Incorrect Installation](./adr/ADR_0001_PREVENT_INCORRECT_INSTALLATION.md)
- [CHANGELOG.md](../CHANGELOG.md)
- [README.md](../README.md)
