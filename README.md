# My First MCP

**NextFlow AI Internship — Submission 3 (Module 1.5 & 1.6)**

This is my first working MCP (Model Context Protocol) server. The goal of this
submission is to build the smallest possible end-to-end MCP pipeline — one
server, one tool — and prove it actually works by connecting to it with MCP
Inspector.

## What this server does

The server exposes a single tool called `greet`:

- **`greet(name)`** — takes a person's name as input and returns a friendly
  greeting, e.g. `Hello, Ada!`

It's intentionally simple. The point of this step isn't a useful tool — it's
confirming that the server starts, registers a tool correctly, validates
input with Zod, and responds over stdio the way a real MCP host would expect.

## Tech stack

- [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk) — official MCP server SDK
- [`zod`](https://www.npmjs.com/package/zod) — schema validation for tool input
- TypeScript + [`tsx`](https://www.npmjs.com/package/tsx) — run TS directly without a separate build step

## Project structure

```
my-first-mcp/
├── src/
│   └── index.ts      # server setup + the "greet" tool
├── package.json
├── package-lock.json
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

If it stays running with no crash and no visible output, that's expected —
the server is just waiting for input over stdio. Stop it with `Ctrl+C`.

## Testing with MCP Inspector

Since this server talks over stdio, it needs a host or inspector to actually
call it. To verify it manually:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Then, in the browser UI that opens:

1. Go to the **Tools** tab and confirm `greet` is listed with its description
   and input schema.
2. Call it with valid input (`name: "Ada"`) → returns `Hello, Ada!`.
3. Call it with invalid input (empty or wrong type) → rejected by Zod
   _before_ the handler code runs, confirming input validation is working.

A screenshot of both the tool listing and a successful call is included with
this submission.

## Notes

- All logging in this server uses `console.error`, never `console.log` or
  `process.stdout.write` — the stdio transport uses standard output to talk
  to the host, so anything else written there would corrupt the connection.
- `node_modules/` and `dist/` are excluded via `.gitignore` and are not part
  of this repo.

Team 
Taima Nazzal
Shahd Shwekeyeh
Joud Thaher

Academy Website
https://academy.nextflows.ai

