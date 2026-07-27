# Design Doc — Job Application Tracker MCP

## Pitch

Job hunting generates a lot of data and very little clarity — dozens of
applications, silent recruiters, and no easy way to know what to do next.
This MCP server turns a simple local record of job applications into an
assistant that can answer two questions humans actually care about: "where
do things stand?" and "what should I do today?" It exposes tools to add and
update applications, and a reasoning tool that surfaces stale applications
and next actions, so the AI isn't just storing data — it's helping the user
act on it.

## User & Demo Story

Joud has applied to 22 companies over the last month — a mix of local
tech companies like **Exalt Technologies** and **Orion VLSI Technologies**,
and remote roles at international companies that hire Palestinian talent.
She hasn't heard back from most of them and has lost track of who needs a
follow-up. During the demo, she opens Claude and asks: **"What should I
focus on today?"** Claude calls `get_next_actions`, which reads her
application history, flags that Orion VLSI has been silent for 18 days
(worth a follow-up email), notices an Exalt Technologies interview is
coming up based on a status change three days ago, and lists two other
applications stuck in "applied" for over three weeks. Claude turns this
into a short, prioritized to-do list in plain language. Joud then says
**"I just heard back from Exalt, move them to interview stage,"** and
Claude calls `update_status` to update the record live, on stage.

## Tool Inventory

| tool_name | description (1 line) | inputs | output (shape) | priority |
|---|---|---|---|---|
| `add_application` | Adds a new job application record. Use when the user says they applied somewhere. | `company` (string), `role` (string), `date_applied` (ISO date), `status` (enum, default "applied"), `notes` (string, optional) | `{ id, company, role, status, date_applied, notes }` | P0 |
| `update_status` | Updates the status of an existing application. Use when the user reports a change (interview, rejection, offer). | `id` (string), `new_status` (enum) | updated record object | P0 |
| `list_applications` | Lists all applications, optionally filtered by status. Read-only, no side effects. | `status` (enum, optional) | array of application records | P0 |
| `get_next_actions` | Returns a prioritized list of suggested actions: stale applications needing follow-up, upcoming interviews, and recent status changes. Read-only. | none | array of `{ action, application_id, reason }` | P1 |
| `get_stale_applications` | Flags applications with no status change in N days. Read-only. | `days_threshold` (number, default 14) | array of records + `days_since_update` | P2 |
| `search_applications` | Searches applications by company or role keyword. Read-only. | `query` (string) | array of matching records | P2 |
| `get_conversion_stats` | Breaks down response/interview rate by application source (referral, cold apply, LinkedIn, etc.). Read-only. | none | `{ source: { applied, responded, rate } }` | P2 |

## Out of Scope

- No authentication or multi-user accounts — this is single-user, local
  data only.
- No integration with job boards, email, or LinkedIn scraping to
  auto-detect applications.
- No paid APIs or external services of any kind — all data lives in a
  local JSON file.
- No mobile app or web UI — interaction happens entirely through the AI
  chat interface.
- No calendar sync for interview scheduling (may revisit as a future P1).

## Success Criteria

- [ ] `add_application` and `update_status` correctly write to and persist
      in the local JSON data file, verified by re-reading the file after
      each call.
- [ ] `get_next_actions`, run against a seeded fixture of ~15 applications,
      correctly flags at least one stale application and one recent status
      change with a human-readable reason.
- [ ] A live demo conversation (add an application, update a status, ask
      "what should I focus on today?") runs end-to-end in Claude with no
      manual data editing, using Joud's seeded application data.

## Risks

1. **`get_next_actions` logic scope creep.** "What counts as a good next
   action" could balloon into a complex rules engine. *Mitigation:* fix
   the rule set early — 3 simple, hard-coded heuristics (stale threshold,
   status changed in last 3 days, no status update at all) — and resist
   adding more until P0s are proven stable.
2. **Data corruption from concurrent or malformed writes.** A bad date
   format or duplicate ID could silently break `list_applications` /
   `get_next_actions`. *Mitigation:* validate all inputs with Zod schemas
   (Section 2.4) and fail loudly with a clear error message rather than
   writing bad data.
