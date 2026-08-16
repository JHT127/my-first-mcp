
# Test Plan — Job Application Tracker MCP (Week 5)

**Tools covered:** `add_application`, `list_applications`, `update_status`, `get_next_actions`
**Test environment:** MCP Inspector, local `./data/applications.json`
**Happy-path inputs:** reused from `examples/*.json`

## 5.1 — Test Plan

| id | tool | setup | input | expected | result | evidence |
|----|------|-------|-------|----------|--------|----------|
| TC-01 | add_application | Inspector connected, current fixture in `./data/applications.json` unchanged | `examples/add_application.json` → `{company:"Google", role:"Frontend Developer", date_applied:"2026-07-30", status:"applied", source:"linkedin", notes:"Applied through LinkedIn."}` | "Application added successfully." + new record added with a new `id` | | |
| TC-02 | add_application | Same setup | Same as `examples/add_application.json` but `date_applied` changed to an invalid format: `"30-07-2026"` | Zod rejects before the handler runs: `"date_applied: Date must be in YYYY-MM-DD format."` | | |
| TC-03 | list_applications | Fixture contains at least one application with status "applied" | `examples/list_applications.json` → `{status:"applied"}` | Returns only matching applications, with `total` and `truncated:false` | | |
| TC-04 | list_applications | Same setup | Same shape as `examples/list_applications.json` but `status` changed to a value not in the enum: `{status:"pending"}` | Zod rejects before the handler runs, with a clear enum validation error | | |
| TC-05 | update_status | **Note:** `examples/update_status.json` uses `id:"123-off"` — before running, confirm this id actually exists in the fixture, or replace it with a real existing id (e.g. an id from an application added in TC-01). Back up the fixture first: `cp data/applications.json data/applications.backup.json` | `examples/update_status.json` → `{id:"<existing id>", new_status:"applied"}` | "Application updated successfully", status field changes to "applied" | | |
| TC-06 | update_status | Same setup; restore original fixture after TC-05 if needed: `cp data/applications.backup.json data/applications.json` | `{id:"app-999"}` (id does not exist) | Clear, short error: `"No application found with id: app-999"` — no stack trace | | |
| TC-07 | update_status | Same setup | `{id:""}` (empty) | Zod rejects: `"id: Too small: expected string to have >=1 characters"` | | |
| TC-08 | get_next_actions | Fixture contains a stale application (no update for a long time) | `examples/get_next_actions.json` → `{limit:3, status:"applied"}` | Returns one or more actions with a clear reason (e.g. stale application), correct `total`/`truncated` | | |
| TC-09 | get_next_actions | Same setup | `{limit:0}` | Invalid input — Zod rejects because `limit` must be a positive integer (0 not allowed) | | |
| TC-10 | get_next_actions | Same setup | `{limit:50}` (above the max allowed of 10) | Either Zod rejects the value, or the handler safely clamps it to 10, with correct `total`/`truncated` | | |
| TC-11 | list_applications | Back up the fixture: `cp data/applications.json data/applications.backup.json`, then temporarily replace it with an empty array `[]` | `{}` (no filter) | Valid empty-data state (not an error): `applications: [], total:0, truncated:false` | | |
| TC-12 | list_applications | Back up the fixture, then temporarily rename the file: `mv data/applications.json data/applications.json.bak` (simulates data unavailable) | `{}` | Short, generic error message: `"Could not read applications data."` — no stack trace or internal details | | |

**Fixture reset notes:**
- TC-05 and TC-06 modify an existing application's status — back up before, and restore after if later tests depend on the original state.
- TC-11 and TC-12 replace/hide the data file entirely — `data/applications.json` must be restored to its original state after each one before continuing.
