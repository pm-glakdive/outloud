# Project: Math Learning App

A math app focused on teaching basics, mental calculation, and techniques.

## gstack

This project uses [gstack](https://github.com/garrytan/gstack) for AI-assisted development.

**Web browsing:** Always use the `/browse` skill from gstack for all web browsing tasks. Never use `mcp__claude-in-chrome__*` tools.

**Available skills:**

- `/office-hours` — product interrogation, refines the idea before planning
- `/plan-ceo-review` — strategic plan review
- `/plan-eng-review` — engineering architecture review
- `/plan-design-review` — design review of the plan
- `/design-consultation` — design guidance
- `/design-shotgun` — generate multiple design directions
- `/design-html` — produce HTML mockups
- `/review` — code review of the current branch
- `/ship` — finalize and create a PR
- `/land-and-deploy` — merge and deploy
- `/canary` — canary release flow
- `/benchmark` — performance benchmarking
- `/browse` — web browsing (preferred over MCP browser tools)
- `/connect-chrome` — connect a real Chrome session
- `/qa` — automated QA against a URL
- `/qa-only` — QA without auto-fix
- `/design-review` — design review of shipped UI
- `/setup-browser-cookies` — configure browser auth
- `/setup-deploy` — configure deployment
- `/setup-gbrain` — configure GBrain persistent knowledge
- `/retro` — engineering retrospective
- `/investigate` — root-cause debugging
- `/document-release` — produce release docs
- `/codex` — codex methodology
- `/cso` — security review (OWASP + STRIDE)
- `/autoplan` — automated planning pipeline
- `/plan-devex-review` — developer experience plan review
- `/devex-review` — developer experience review
- `/careful` — slow, careful mode
- `/freeze` — freeze a file from edits
- `/guard` — guard a region of code
- `/unfreeze` — release a freeze
- `/gstack-upgrade` — update gstack to latest
- `/learn` — learn from a session

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
