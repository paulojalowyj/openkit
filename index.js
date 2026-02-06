/**
 * OpenKit - Entry Point
 * 
 * OpenKit should not be imported as a module.
 * 
 * Use the CLI via npx:
 *   npx @paulojalowyj/openkit init
 *   npx @paulojalowyj/openkit upgrade
 * 
 * Documentation: https://github.com/paulojalowyj/openkit
 */

console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OpenKit should not be imported as a module

OpenKit is a CLI tool, not a code library.

Use via npx:
  npx @paulojalowyj/openkit init      # Install in project
  npx @paulojalowyj/openkit upgrade   # Upgrade framework
  opencode                            # Start OpenCode

Documentation: https://github.com/paulojalowyj/openkit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

process.exit(1);