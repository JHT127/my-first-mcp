# Design Doc — Job Application Tracker MCP
*Part of the [NextFlows Academy](https://nextflows.ai/academy/ ) MCP Server Development.*

## Team Members

- Taima Nazal
- Shahd Shwekeyeh
- Joud Thahe
- Razan Froukh

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

Shahd, Taima, and Joud are three Computer Engineering students who built
this MCP to help manage job applications. During the demo, Shahd uses
the assistant to track her own job search — a mix of local tech
companies like **Exalt Technologies** and **Orion VLSI Technologies**,
and remote roles at international companies that hire Palestinian
talent. She has applied to 22 companies over the last month, hasn't
heard back from most of them, and has lost track of who needs a
follow-up. She opens Claude and asks: **"What should I focus on
today?"** Claude calls `get_next_actions`, which reads her application
history, flags that Orion VLSI has been silent for 18 days (worth a
follow-up email), notices an Exalt Technologies interview is coming up
based on a status change three days ago, and lists two other
applications stuck in "applied" for over three weeks. Claude turns this
into a short, prioritized to-do list in plain language. Shahd then says
**"I just heard back from Exalt, move them to interview stage,"** and
Claude calls `update_status` to update the record live, on stage.

## Tool Inventory

*Approved by mentor (1:1) to exceed 7 tools and use more than two
priority tiers.*

| tool_name | description (1 line) | inputs | output (shape) | priority |
|---|---|---|---|---|
| `add_application` | Adds a new job application record. Use when the user says they applied somewhere. | `company` (string), `role` (string), `date_applied` (ISO date), `status` (enum, default "applied"), `source` (enum, default "cold_apply"), `notes` (string, optional) | `{ id, company, role, status, date_applied, source, notes }` | P0 |
| `update_status` | Updates the status of an existing application. Use when the user reports a change (interview, rejection, offer). | `id` (string), `new_status` (enum) | updated record object | P0 |
| `list_applications` | Lists all applications, optionally filtered by status. Read-only, no side effects. | `status` (enum, optional) | array of application records | P0 |
| `get_next_actions` | Returns a prioritized list of suggested actions: stale applications needing follow-up, upcoming interviews, and recent status changes. Read-only. | none | array of `{ action, application_id, reason }` | P1 |
| `get_stale_applications` | Flags applications with no status change in N days. Read-only. | `days_threshold` (number, default 14) | array of records + `days_since_update` | P2 |
| `search_applications` | Searches applications by company or role keyword. Read-only. | `query` (string) | array of matching records | P2 |
| `get_conversion_stats` | Breaks down response/interview rate by application source (referral, cold apply, LinkedIn, etc.). Read-only. | none | `{ source: { applied, responded, rate } }` | P2 |
| `get_health_score` | Computes an overall job-search health score with human-readable reasons (consistency, response rate, follow-up gaps). Read-only. | none | `{ score: number, reasons: string[] }` | P3 |
| `add_contact` | Adds a networking/recruiter contact record. Use when the user mentions a recruiter or networking contact. | `person` (string), `company` (string), `linkedin` (string, optional), `last_message_date` (ISO date, optional), `notes` (string, optional) | `{ id, person, company, linkedin, last_message_date, next_follow_up }` | P3 |
| `get_reconnect_suggestions` | Suggests which networking contacts to reconnect with this week, based on last message date. Read-only. | none | array of `{ contact_id, person, reason }` | P3 |

## Out of Scope

- No authentication or multi-user accounts — this is single-user, local
  data only.
- No integration with job boards, email, or LinkedIn scraping to
  auto-detect applications.
- No paid APIs or external services of any kind — all data lives in a
  local JSON file.
- No mobile app or web UI — interaction happens entirely through the AI
  chat interface.
- No calendar integration for interview scheduling in the MVP (planned
  as a future enhancement).
- No email/WhatsApp notifications, Notion integration, or CV parsing in
  the MVP. These features may be considered in future versions.

## Success Criteria

- [ ] `add_application` and `update_status` correctly write to and persist
      in the local JSON data file, verified by re-reading the file after
      each call.
- [ ] `get_next_actions`, run against a seeded fixture of ~15 applications,
      correctly flags at least one stale application and one recent status
      change with a human-readable reason.
- [ ] A live demo conversation (add an application, update a status, ask
      "what should I focus on today?") runs end-to-end in Claude with no
      manual data editing, using Shahd's seeded application data.

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
3. **P3 tools delaying P0/P1 delivery.** Now that scope includes more
   tools, there's a risk of building `get_health_score` / networking
   tools before P0 is proven stable. *Mitigation:* P0 → P1 → P2 → P3,
   strictly in order; P3 tools may remain stubs for Demo Day if time
   runs short.
