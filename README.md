# Job Application Tracker MCP

**NextFlow AI Internship — Submission 3 (Module 1.5 & 1.6)**

This project is a local MCP server for tracking job applications. It lets an AI assistant add applications, update their status, list records, and suggest useful next steps based on the current job-search data.

## What this server does

The server exposes a set of job-search tools that help a user stay organized and take action:

- `add_application` — add a new job application record
- `list_applications` — list applications, optionally filtered by status
- `update_status` — update an application to a new status
- `get_next_actions` — suggest follow-ups and priority actions
- `get_stale_applications` — find applications that have gone too long without updates
- `search_applications` — search by company or role keyword
- `get_conversion_stats` — summarize response/interview conversion by source
- `get_health_score` — return a simple health score and reasons
- `add_contact` — save recruiter or networking contacts
- `get_reconnect_suggestions` — suggest contacts to reconnect with

The first four tools are the core workflow, while the additional tools extend the experience with analytics and networking support.

## Tech stack

- `@modelcontextprotocol/server` — official MCP server SDK
- `zod` — schema validation for tool input
- TypeScript + `tsx` — run TypeScript directly without a separate build step

## Project structure

```text
my-first-mcp/
├── src/
│   ├── index.ts               # server setup and tool registration
│   ├── schemas/               # Zod input schemas for each tool
│   └── tools/                 # tool implementations
├── examples/                  # sample JSON payloads for Inspector testing
├── docs/                      # design and planning notes
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## Setup

```bash
npm install
```

## Running the server

```bash
npm run dev
```

If it stays running without crashing, that is expected because the server is waiting for MCP input over stdio. Stop it with `Ctrl+C`.

## Testing with MCP Inspector

Run the server through Inspector:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Then in the Inspector UI:

1. Open the **Tools** tab and confirm the listed job-tracker tools appear.
2. Try a valid payload from the `examples/` folder, such as `examples/add_application.json` or `examples/get_next_actions.json`.
3. Try an invalid payload to confirm Zod validation rejects it before the handler runs.

## Example payloads

Sample JSON inputs are available in the `examples/` folder for:

- `add_application.json`
- `list_applications.json`
- `update_status.json`
- `get_next_actions.json`
- `get_stale_applications.json`
- `search_applications.json`
- `get_conversion_stats.json`
- `get_health_score.json`
- `add_contact.json`
- `get_reconnect_suggestions.json`

## Notes

- The server uses `console.error` for logging so stdio stays clean for MCP communication.
- `node_modules/` and similar generated files are excluded via `.gitignore`.

Team:

- Taima Nazzal
- Shahd Shwekeyeh
- Joud Thaher
- Razan Froukh

Academy Website:
https://academy.nextflows.ai
