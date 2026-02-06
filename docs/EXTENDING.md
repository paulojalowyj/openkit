# Extending OpenKit

> How to create custom agents, skills, and commands for the OpenKit system.

---

## Table of Contents

| Topic | Description |
|--------|-------------|
| **[Architecture Overview](#architecture-overview)** | How OpenKit system works |
| **[Creating Custom Agents](#creating-custom-agents)** | How to add new agents |
| **[Creating Custom Skills](#creating-custom-skills)** | How to add new domain skills |
| **[Creating Custom Commands](#creating-custom-commands)** | How to add new slash commands |
| **[Creating Custom Blueprints](#creating-custom-blueprints)** | How to add project blueprints |
| **[Integration Testing](#integration-testing)** | Testing custom additions |
| **[Best Practices](#best-practices)** | Guidelines for quality |

---

## Architecture Overview

OpenKit follows a modular architecture:

```
OpenKit System
├── Agents (15)           - Specialized personas with domains
├── Skills (33+)          - Knowledge modules loaded on-demand
├── Commands (13)          - Slash commands for task orchestration
├── Master Ruleset          - Universal quality rules
└── Scripts                - Validation and utility tools
```

### How Components Interact

1. **User invokes command** (e.g., `/plan`)
2. **Command loads required agents**
3. **Agents load relevant skills** (based on domain)
4. **Skills provide knowledge** (decision trees, patterns, principles)
5. **Agents execute tasks** (following Master Ruleset)
6. **Validation scripts** run quality checks

### Key Principles

- **Modularity**: Each component is independent
- **On-demand loading**: Skills loaded only when needed
- **Single source of truth**: Keep runtime settings centralized
- **Universal rules**: All agents follow MASTER.md

---

## Creating Custom Agents

### Agent Structure

An agent prompt file (`prompts/<agent-name>.md`) contains:

```markdown
# Agent Name

## Your Philosophy
[Brief description of agent's approach]

## Your Mindset
[How agent thinks about problems]

## Your Expertise Areas
[Technical knowledge and capabilities]

## What You Do
[Specific responsibilities]

## When You Should Be Used
[When to invoke this agent]
```

### Step-by-Step: Creating an Agent

1. **Define the domain**
   - What problem does this agent solve?
   - What specialized knowledge does it need?

2. **Write the philosophy**
   - How does this agent approach problems?
   - What makes it unique?

3. **List expertise areas**
   - Technical skills
   - Knowledge domains
   - Tools and frameworks

4. **Define responsibilities**
   - What does this agent do?
   - What are its boundaries?

5. **Identify skills to load**
   - Which skills provide needed knowledge?
   - List in frontmatter: `SKILL.md` files

6. **Configure runtime settings**
   - Register the agent in `opencode.json` (models/providers are runtime-managed)

7. **Test the agent**
   - Verify it works correctly
   - Check interactions with other agents

### Example: Creating a DevRel Agent

```markdown
# Developer Relations Agent

## Your Philosophy

**DevRel is about building community and trust.** Every interaction should be helpful, welcoming, and focused on empowering developers.

## Your Mindset

When working with the community, I think:
- **Empathy first**: Understand developer pain points
- **Transparency builds trust**: Be open about process
- **Education over selling**: Teach, don't just promote
- **Feedback is gold**: Listen and act on feedback
- **Celebrate contributions**: Recognize and highlight community work

## Your Expertise Areas

### Communication
- Writing blog posts and documentation
- Creating video tutorials
- Community moderation
- Social media engagement

### Technical
- API documentation
- Sample code and tutorials
- Integration guides
- Troubleshooting

### Community
- Running events and webinars
- Managing open source projects
- Mentorship programs
- Contributor recognition

## What You Do

 Write clear, engaging content
 Create educational materials (tutorials, guides)
 Respond to community questions and issues
 Highlight community contributions
 Organize events and initiatives
 Gather and act on feedback

 Don't:
- Use jargon without explanation
- Ignore critical feedback
- Over-promote without providing value
- Be dismissive or condescending

## When You Should Be Used

- Writing community content (blog posts, tutorials)
- Creating educational materials
- Engaging with community (GitHub, Discord, etc.)
- Responding to community questions
- Planning community initiatives
- Creating contributor recognition programs

---

> Note: This agent loads relevant skills (writing, documentation, etc.) for detailed guidance.
```

### Frontmatter Configuration

Agent files should include frontmatter with skills:

```markdown
---
name: devrel-agent
description: Developer relations and community engagement
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Developer Relations Agent
```

### Runtime Configuration

Register the agent in `opencode.json` (models/providers are runtime-managed).

---

## Creating Custom Skills

### Skill Structure

A skill directory (`skills/<skill-name>/`) contains:

```
skills/<skill-name>/
├── SKILL.md              # Main skill file
├── topic1.md            # Supporting topic
├── topic2.md            # Supporting topic
└── scripts/              # Optional utility scripts
    ├── script1.py
    └── script2.py
```

### Main Skill File Structure

```markdown
---
name: skill-name
description: Brief description
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Skill Name

> Description of what this skill teaches.

---

## When to Use This Skill

Use this skill when:
- [Use case 1]
- [Use case 2]
- [Use case 3]

---

## Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `topic1.md` | Description | When to read |
| `topic2.md` | Description | When to read |
```

### Step-by-Step: Creating a Skill

1. **Define the domain**
   - What knowledge does this skill provide?
   - What problems does it solve?

2. **Structure content**
   - What topics need to be covered?
   - What supporting files are needed?

3. **Write the main skill file**
   - Frontmatter with name, description, tools
   - When to use section
   - Content map
   - Principles and patterns
   - Examples and templates

4. **Create supporting files**
   - Each topic in its own file
   - Focused, actionable content
   - Include examples

5. **Create utility scripts** (optional)
   - Python scripts for validation/automation
   - Make executable
   - Add error handling

6. **Update ARCHITECTURE.md**
   - Add skill to skills list

7. **Test the skill**
   - Verify agents can load it correctly
   - Check examples work
   - Validate scripts run

### Example: Creating a Data Science Skill

```markdown
---
name: data-science
description: Machine learning and data analysis principles
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Data Science

> ML and data analysis principles.
> **Teaches thinking, not just algorithms.**

---

## When to Use This Skill

Use this skill when:
- Analyzing datasets
- Building ML models
- Creating data visualizations
- Feature engineering
- Model evaluation
- Deploying ML systems

---

## Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `exploratory-analysis.md` | Data exploration and cleaning | Understanding data |
| `feature-engineering.md` | Creating features from raw data | Preparing data |
| `model-selection.md` | Choosing appropriate algorithms | Building models |
| `evaluation.md` | Model evaluation metrics | Validating models |
| `visualization.md` | Data visualization techniques | Communicating insights |
| `deployment.md` | Deploying ML models | Production systems |

---

# Exploratory Analysis

## Principles

1. **Understand the problem** - What question are we answering?
2. **Know your data** - Distribution, outliers, missing values
3. **Clean before analyze** - Garbage in, garbage out
4. **Document everything** - Keep track of assumptions and decisions

## Process

```
1. Load Data
   ├── Check format (CSV, JSON, database)
   ├── Verify schema
   └── Handle missing values

2. Explore Data
   ├── Summary statistics
   ├── Distributions (histograms, box plots)
   ├── Correlations
   └── Outliers

3. Clean Data
   ├── Handle missing values
   ├── Remove duplicates
   ├── Fix types
   └── Normalize values

4. Document
   ├── Record assumptions
   ├── Note transformations
   └── Track data quality issues
```

## Example

```python
import pandas as pd
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('data.csv')

# Explore
print(df.describe())
df.hist(bins=20)
plt.show()

# Clean
df = df.dropna()
df = df.drop_duplicates()

# Document
# Save data profile
df.to_csv('data_profile.csv')
```

---

# Feature Engineering

## Principles
...
```

### Utility Scripts

Skills can include Python scripts for validation:

```python
#!/usr/bin/env python3
"""
Validate data science practices in codebase.
"""

import sys
import os
import argparse
from pathlib import Path

def validate_data_files(directory):
    """Check if data files are properly documented."""
    # Implementation here
    pass

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Validate data science practices")
    parser.add_argument("directory", help="Directory to validate")
    args = parser.parse_args()

    validate_data_files(args.directory)
```

---

## Creating Custom Commands

### Command Structure

A command file (`commands/<command>.md`) contains:

```markdown
---
description: Brief description
subtask: false/true
---

# COMMAND NAME ACTIVATED

**User input:** $ARGUMENTS

## Workflow

[Step-by-step workflow]

## Examples

[Bash examples]
```

### Step-by-Step: Creating a Command

1. **Define the purpose**
   - What does this command do?
   - What problem does it solve?

2. **Design the workflow**
   - What steps should it follow?
   - What agents should it invoke?
   - Where are the stop points?

3. **Write the command file**
   - Frontmatter with description
   - Workflow section
   - Examples section
   - Error handling

4. **Set `subtask` flag**
   - `false`: Independent command
   - `true`: Sub-command (invoked by other commands)

5. **Update ARCHITECTURE.md**
   - Add command to commands list

6. **Test the command**
   - Verify workflow completes
   - Check stop points work
   - Validate error handling

### Example: Creating a /refactor Command

```markdown
---
description: Refactor code following clean-code principles
subtask: false
---

# /refactor - Code Refactoring

**User input:** $ARGUMENTS

**If $ARGUMENTS is empty:**
Use the question tool to ask: "What do you want to refactor?"

## Workflow

1. **Analysis**
   ├── Read specified file/directory
   ├── Analyze for code smells
   ├── Identify violations of clean-code principles
   └── Generate refactoring suggestions

2. **Planning**
   ├── Present findings to user
   ├── Use question tool to confirm approach
   └── Get approval before refactoring

3. **Execution**
   ├── Apply refactoring changes
   ├── Ensure functionality is preserved
   ├── Add tests if needed
   └── Update documentation

4. **Verification**
   ├── Run existing tests
   ├── Add new tests for refactored code
   └── Verify all tests pass

## Examples

```bash
# Refactor entire file
/refactor src/components/UserCard.tsx

# Refactor specific function
/refactor refactor validateUser in src/utils/validation.ts

# Refactor directory
/refactor src/services/

# Refactor with specific rule
/refactor src/utils/ --rule "max-function-length"
```

## Refactoring Rules

Check for:
- Functions > 20 lines
- Functions > 3 arguments
- Duplicate code
- Complex nesting
- Poor naming
- Missing error handling
- Inconsistent patterns
```

### JavaScript Implementation

Commands are executed by JavaScript files in `bin/`:

```javascript
// bin/cli.js
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

async function executeCommand(commandName, args) {
  const commandPath = path.join(__dirname, '..', '.opencode', 'commands', `${commandName}.md`);
  const commandContent = fs.readFileSync(commandPath, 'utf8');

  // Parse and execute command logic
  // ...

  console.log(chalk.green(`Command ${commandName} executed`));
}

module.exports = { executeCommand };
```

---

## Creating Custom Blueprints

### Blueprint Structure

```
blueprints/<name>/
├── README.md          # Overview and quick start
├── backend/           # Backend template
│   ├── app/
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/          # Frontend template
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.ts
├── docker-compose.dev.yml
├── docker-compose.prod.yml
```

### Step-by-Step: Creating a Blueprint

1. **Define the use case**
   - What type of project is this for?
   - What stack does it use?

2. **Create the structure**
   - Backend template files
   - Frontend template files
   - Infrastructure configuration

3. **Use placeholders**
   - `{{PROJECT_NAME}}` for project name
   - `{{PROJECT_IDENTIFIER}}` for identifier
   - `{{VERSION}}` for version

4. **Write README.md**
   - Overview
   - Stack details
   - Quick start
   - Features included
   - Customization guide

5. **Test the blueprint**
   - Initialize project with blueprint
   - Verify all services start
   - Check documentation

6. **Update BLUEPRINTS.md**
   - Add blueprint to the list

### Example: Blueprint Template

```markdown
# {{PROJECT_NAME}} Blueprint

Template for {{PROJECT_TYPE}} applications.

## Stack

- **Frontend**: {{FRONTEND_FRAMEWORK}}
- **Backend**: {{BACKEND_FRAMEWORK}}
- **Database**: {{DATABASE}}
- **Infrastructure**: {{INFRASTRUCTURE}}

## Quick Start

```bash
npx @paulojalowyj/openkit init --blueprint {{BLUEPRINT_NAME}} \
  --project-name "{{PROJECT_NAME}}" \
  --project-identifier "{{PROJECT_IDENTIFIER}}"
```

## Features

- [Feature 1]
- [Feature 2]
- [Feature 3]

## Customization

[How to customize the blueprint]
```

---

## Integration Testing

### Testing Agents

```bash
# Create test scenario
echo "Test agent behavior" > test_agent.md

# Invoke agent
opencode chat "Act as backend-specialist. Review this file: test_agent.md"

# Verify output
# Check response aligns with agent philosophy
```

### Testing Skills

```bash
# Create test case
# Test that skill is loaded correctly
# Verify knowledge is provided
# Check examples work

# Run validation scripts
python .opencode/skills/<skill-name>/scripts/validate.py
```

### Testing Commands

```bash
# Test command workflow
opencode plan "test feature"

# Verify each step completes
# Check stop points work
# Validate error handling
```

---

## Best Practices

### For Agents

**Do:**
- Define clear philosophy
- List specific expertise
- Provide examples
- Set boundaries of responsibility
- Test with different scenarios

**Don't:**
- Be too broad
- Overlap with other agents
- Lack clear boundaries
- Skip testing

### For Skills

**Do:**
- Teach thinking, not patterns
- Provide decision frameworks
- Include practical examples
- Organize with content maps
- Make scripts robust

**Don't:**
- Provide only patterns
- Skip explanations
- Be too theoretical
- Lack examples
- Ignore error handling

### For Commands

**Do:**
- Clear workflow definition
- Use stop points appropriately
- Provide helpful examples
- Handle errors gracefully
- Test all scenarios

**Don't:**
- Skip stop points
- Be ambiguous
- Lack error handling
- Ignore edge cases
- Skip documentation

### For Blueprints

**Do:**
- Provide working setup
- Use clear placeholders
- Document customization
- Test thoroughly
- Include examples

**Don't:**
- Use hardcoded values
- Skip README
- Leave TODOs
- Assume user expertise
- Skip testing

---

## Related Documentation

- [Architecture](ARCHITECTURE.md) - System architecture
- [Agents Reference](AGENTS.md) - Agent structure and examples
- [Skills Reference](SKILLS.md) - Skill structure and examples
- [Commands Reference](COMMANDS.md) - Command structure and examples
- [Contributing](CONTRIBUTING.md) - Contribution guidelines

---

## Need Help?

- **GitHub Issues**: [github.com/paulojalowyj/openkit/issues](https://github.com/paulojalowyj/openkit/issues)
- **Discussions**: [github.com/paulojalowyj/openkit/discussions](https://github.com/paulojalowyj/openkit/discussions)

---

## Example: Complete Extension

Let's say you want to add a **Machine Learning Engineer** agent.

### 1. Create the Agent

`prompts/ml-engineer.md`:
```markdown
# ML Engineer

## Your Philosophy
**ML is about solving business problems with data.** Models are tools, not the goal.

## Your Mindset
When building ML systems, I think:
- **Problem first**: What are we trying to predict/classify?
- **Data quality**: Garbage in, garbage out
- **Model simplicity**: Start simple, add complexity only if needed
- **Validation is critical**: Never deploy without testing

## Your Expertise Areas
- Exploratory data analysis
- Feature engineering
- Model selection and training
- Model evaluation
- Deployment and monitoring

## What You Do
 Analyze data quality
 Engineer relevant features
 Select appropriate models
 Train and evaluate models
 Deploy to production
 Monitor model performance

## When You Should Be Used
- Building ML models
- Analyzing datasets
- Feature engineering
- Model deployment
```

### 2. Create Supporting Skills

`skills/data-science/SKILL.md` (see previous example)

### 3. Update Runtime Configuration

Register `ml-engineer` in `opencode.json`.

### 4. Update Architecture

`ARCHITECTURE.md`: Add to agents list

### 5. Test

```bash
# Test agent invocation
opencode chat "Act as ml-engineer. Analyze this dataset..."

# Test skill loading
# Verify data-science skill is loaded

# Validate outputs
# Check results match ML best practices
```

### 6. Document

Update `docs/AGENTS.md` and `docs/SKILLS.md`

---

## Extension Checklist

Before submitting your extension:

- [ ] **Purpose is clear** - What problem does this solve?
- [ ] **Structure follows conventions** - Matches existing patterns
- [ ] **Documentation is complete** - README, examples, usage
- [ ] **Code is tested** - Works correctly in various scenarios
- [ ] **Quality is high** - Follows best practices
- [ ] **Integration works** - Works with existing system
- [ ] **Documentation updated** - Arch, AGENTS, SKILLS updated

---

## Thank You for Extending OpenKit!

Custom extensions make OpenKit more powerful for everyone. Thank you for your contribution!
