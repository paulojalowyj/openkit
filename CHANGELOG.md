# Changelog

All notable changes to OpenKit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-02-06

### Fixed
- Fix npm publish metadata so the `openkit` binary is published correctly.

---

## [0.1.0] - 2026-02-06

### Changed
- Repository-wide removal of emojis from prompts, commands, skills, rules, docs, and scripts
- Standardized references to `.opencode/prompts/` and corrected broken paths
- Updated CLI messages and package metadata to remove stale model-env guidance
- Reinforced `question` tool enforcement for multi-option user choices
- Fixed `prepublishOnly` packaging check to validate `.opencode/prompts/` instead of legacy `.opencode/agents/`

---

## [1.3.2] - 2025-02-04

### Changed
- **Documentation** - Removed emojis from all README files and documentation
  - Improved compatibility with various Markdown renderers
  - Cleaner, more professional documentation appearance
  - Emojis retained in CLI output for better user experience

- **Model Configuration** - Removed environment variable tiered system
  - Models are configured via runtime settings (per agent)
  - Removed `.env.example.openkit` template file
  - Updated all documentation to reflect new configuration method
  - Added agent-specific model recommendations
  - Simpler configuration with no need for model env vars

- **CLI Commands** - Removed `.env.example` references from context command

---

## [1.3.1] - 2025-02-04

### Changed
- **Package Description** - Improved quick start text and links
  - Users can see setup instructions before installing
  - Links to OpenCode documentation

---

## [1.3.0] - 2025-02-04

### Added
- **Model Configuration System** - Runtime model configuration support
  - Agent-level model and provider configuration support
  - Recommendations for each of the 15 specialized agents
  - Informative messages during initialization about model setup

- **Documentation** - Comprehensive model configuration documentation
  - New "Model Configuration" section in `docs/README.md`
  - Expanded FAQ in `docs/FAQ.md` with model selection guide
  - Links to OpenCode provider and model documentation
  - Agent-specific recommendations in `docs/AGENTS.md`

### Changed
- **Model Configuration** - Moved from environment variables to direct configuration
  - Models are defined per agent via runtime settings
  - Configuration is more straightforward and explicit

- **Init Command** - Enhanced user experience
  - Displays setup instructions with links to OpenCode documentation
  - Warns if file already exists to prevent overwrites

### Security
- No security vulnerabilities introduced in this release

---

## [1.2.0] - 2025-02-04

### Added
- **Stack Selection Skill** - New skill for flexible tech stack selection
  - Decision trees for backend (framework, database, ORM)
  - Decision trees for frontend (framework, state management, UI library)
  - User preference gathering via `question` tool
  - Trade-off explanations for different options
  - TechStack.md template for documenting decisions
  - No hardcoded stacks - always user-driven

- **Complete Documentation** - New documentation structure in `docs/` directory
  - `docs/README.md` - Main documentation index
  - `docs/ARCHITECTURE.md` - Technical framework details
  - `docs/AGENTS.md` - Guide to all 15 specialized agents
  - `docs/SKILLS.md` - Complete reference to 33+ domain skills
  - `docs/COMMANDS.md` - All 18 slash commands
  - `docs/WORKFLOW.md` - Development workflows
  - `docs/BLUEPRINTS.md` - Project blueprints reference
  - `docs/CONTRIBUTING.md` - How to contribute
  - `docs/EXTENDING.md` - How to extend OpenKit
  - `docs/FAQ.md` - Frequently asked questions

### Changed

- **Frontend Agent** - Removed extremist rules, now pragmatic
  - Removed Purple Ban (roxo now allowed when brand-appropriate)
  - Removed Standard Split prohibition (splits allowed when they serve purpose)
  - Refined "Design Unique" to "Brand Identity" (coherent per project, not forced geometry)
  - Updated Maestro Auditor to quality questions instead of automatic rejection
  - Updated Reality Check to "Honest Assessment"

- **Backend Agent** - Implemented stack selection
  - Removed hardcoded framework tables
  - Added Phase 0: Stack Selection (MANDATORY for new projects)
  - Added instructions to use stack-selection skill
  - Simplified to ask user preferences instead of suggesting frameworks

- **Commands** - Removed hardcoded tech stacks
  - `/plan` - Added stack selection phase for new projects
  - `/impl` - Updated to use stack defined in docs, not hardcoded
  - Removed specific framework mentions (TanStack, Pydantic, etc.)

- **Master Ruleset** - Flexible approach
  - Removed "React + TanStack + Tailwind" requirement
  - Removed "FastAPI + SQLAlchemy" requirement
  - Changed to "Use stack defined in project (check existing code or docs/requirements/)"
  - Added reference to stack-selection skill

### Fixed

- **Documentation Paths** - All README files now correctly reference new `docs/` structure
- **Package Files** - `docs/` directory correctly excluded from npm package (not copied to user projects)

### Removed

- **Hardcoded Stack Rules** - No more forced tech stacks anywhere in the system
- **Extremist Design Rules** - Removed "anti-safe harbor" mandatory bans

### Security

- No security vulnerabilities introduced in this release

---

## [1.1.23] - Previous Release

### Added
- Initial version of OpenKit
- 15 specialized agents
- 33+ domain skills
- 18 slash commands
- Master ruleset
- Fullstack blueprint
