---
name: Workshop reuse boundaries
description: Preserve separate client access when extracting shared presentation assets.
---
When sharing presentation CSS or controllers, verify every entry point, not just the canonical admin URL.

**Why:** A deck may also be served under a client-only alias with different credentials. Relative asset paths resolve under that alias; pointing them at admin-protected assets silently breaks client viewing.

**How to apply:** Keep assets available within the appropriate authentication boundary and test alias asset paths alongside navigation. Never grant client credentials access to unrelated decks to solve an asset-routing issue.