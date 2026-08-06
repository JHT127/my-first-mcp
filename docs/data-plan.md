# Week 3 Data Plan — Job Application Tracker

Written before any handler is wired to real data, per the Week 3 task rule:
*"Do not implement all handlers until this file exists."*

## Why this looks different from the starter mapping

The Week 3 brief's starter mapping (Notes → markdown, Weather → Open-Meteo,
Quotes → Quotable, etc.) assumes each tool talks to a different kind of
source. Our P0 tools don't — `docs/design.md` already commits us to **"No
paid APIs or external services of any kind — all data lives in a local JSON
file."** So all four P0 tools share one fixture: `./data/applications.json`.
There's no network call to lose on Demo Day, which trivially satisfies the
"must work if Wi-Fi dies" rule — but we still document failure modes below,
since a local file can still be missing, empty, or malformed.

We have **4 P0 tools**, not 3 (`add_application`, `update_status`,
`list_applications`, `get_next_actions`), matching the Tool Inventory table
in `docs/design.md`.

## Data Plan Table

| tool | source | fixture path | auth | failure modes |
|---|---|---|---|---|
| `add_application` | Local file (JSON) | `./data/applications.json` | none | file missing/unreadable; file contains invalid JSON; duplicate `id` generated; `date_applied` not a valid ISO date; write succeeds but re-read shows stale data (race) |
| `update_status` | Local file (JSON) | `./data/applications.json` | none | `id` not found in file; `new_status` not one of the allowed enum values; file empty (nothing to update); file locked/being written by a concurrent call; JSON parse error on read-before-write |
| `list_applications` | Local file (JSON) | `./data/applications.json` | none | file missing → should return `[]`, not crash; empty file; malformed JSON (trailing comma, bad row); `status` filter value not in enum; one bad record in an otherwise-valid array shouldn't break the whole list |
| `get_next_actions` | Local file (JSON) | `./data/applications.json` | none | file missing/empty → return `[]`, not an error; malformed `date_applied` breaks the days-since-applied calc; timezone/date-parsing edge case at midnight; every application already actioned (empty output is a valid, not a failure, state); large file (100+ rows) should degrade gracefully, not time out |

## Example Responses (happy path)

### `add_application`

```json
{
  "id": "app-3",
  "company": "Taskera Labs",
  "role": "Backend Engineer",
  "date_applied": "2026-07-31",
  "status": "applied",
  "source": "referral",
  "notes": "Referred by a friend from university"
}
```

### `update_status`

```json
{
  "id": "app-2",
  "company": "Exalt Technologies",
  "role": "Frontend Developer",
  "date_applied": "2026-07-28",
  "status": "interview",
  "source": "referral",
  "notes": "Interview scheduled"
}
```

### `list_applications`

```json
{
  "statusFilter": "applied",
  "applications": [
    {
      "id": "app-1",
      "company": "Orion VLSI Technologies",
      "role": "Software Engineer",
      "date_applied": "2026-07-01",
      "status": "applied",
      "source": "linkedin",
      "notes": "No response yet"
    }
  ]
}
```

### `get_next_actions`

```json
[
  {
    "action": "Follow up with Orion VLSI Technologies",
    "application_id": "app-1",
    "reason": "stale application: 30 days without an update."
  },
  {
    "action": "Prepare for Exalt Technologies",
    "application_id": "app-2",
    "reason": "recently updated to interview."
  }
]
```

## Fixture Plan

- `./data/applications.json` will be committed to the repo and seeded with
  the same sample records already used in `getNextActions.test.ts` (Orion
  VLSI Technologies, Exalt Technologies), so tests, the fixture, and the
  demo story in `docs/design.md` all stay consistent.
- Every P0 handler reads from (and `add_application` / `update_status`
  write to) this one file — no per-tool fixture needed, since there's a
  single data source for the whole server.

## Fallback Plan (not yet implemented)

Since there's no external API in P0, there's no "cache the last good API
response" fallback to build. The equivalent risk for us is a corrupted or
missing `applications.json` on Demo Day. Planned fallback, to be built
**after** this plan is approved:

- On startup, if `./data/applications.json` is missing or fails to parse,
  fall back to an in-memory copy of the same seed data (the array already
  hardcoded in `getNextActions.ts`) instead of crashing the server.
- Handlers catch JSON parse errors and return a clear tool error message
  ("could not read applications data") rather than failing silently, per
  the MCP README note already captured in `docs/design.md`.
- This fallback is **not implemented yet** — intentionally, per the Week 3
  rule not to build handlers before this plan is committed. Tracked as a
  follow-up in the Week 3 GitHub Issue.

