````markdown
# Job Application Tracker MCP

A Model Context Protocol (MCP) server for managing job application records.

The project allows an MCP client such as MCP Inspector to add applications, list applications, update application statuses, and get suggested next actions.

## Overview

This project was developed as part of the NextFlow AI Internship.

The server provides four main tools:

- `add_application` — Add a new job application.
- `list_applications` — List stored job applications.
- `update_status` — Update the status of an existing application.
- `get_next_actions` — Get suggested next actions based on application data.

Application data is stored locally in:

```text
./data/applications.json
````

The project does not use external APIs or require API keys.

## Tech Stack

* TypeScript
* Node.js
* `@modelcontextprotocol/server` — MCP server implementation
* `zod` — Input and data validation
* `tsx` — Run TypeScript directly during development
* MCP Inspector — Test and verify MCP tools

## Project Structure

```text
my-first-mcp/
├── data/
│   └── applications.json
│
├── docs/
│   ├── data-plan.md
│   ├── design.md
│   ├── project-choice.md
│   ├── review-checklist.md
│   └── threat-model.md
│
├── examples/
│   ├── add_application.json
│   ├── get_next_actions.json
│   ├── list_applications.json
│   └── update_status.json
│
├── src/
│   ├── lib/
│   │   └── applications.ts
│   │
│   ├── schemas/
│   │   ├── addApplication.ts
│   │   ├── applicationData.ts
│   │   ├── getNextActions.ts
│   │   ├── listApplications.ts
│   │   └── updateStatus.ts
│   │
│   ├── tests/
│   │   └── listApplications.test.ts
│   │
│   ├── tools/
│   │   ├── addApplication.ts
│   │   ├── getNextActions.ts
│   │   ├── getNextActions.test.ts
│   │   ├── listApplications.ts
│   │   ├── updateStatus.ts
│   │   └── ...
│   │
│   └── index.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── SECURITY.md
└── tsconfig.json
```

## Requirements

Make sure Node.js and npm are installed.

Check the installed versions:

```bash
node --version
npm --version
```

## Installation

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd my-first-mcp
```

Install the dependencies:

```bash
npm install
```

## Running the Server

Start the MCP server with:

```bash
npm run dev
```

The server communicates over stdio, so it may appear to stay running without displaying normal output.

Stop the server with:

```text
Ctrl+C
```

## Available Commands

### Start the development server

```bash
npm run dev
```

### Open MCP Inspector

```bash
npm run inspect
```

### Run tests

```bash
npm test
```

> The current project does not yet define a full test runner in the `test` script. Individual test files are available under `src/tests` and `src/tools`.

## Available MCP Tools

### 1. `add_application`

Adds a new job application to the tracker.

Example input:

```json
{
  "company": "Google",
  "role": "Software Engineer",
  "date_applied": "2026-08-12",
  "status": "applied",
  "source": "linkedin",
  "notes": "Applied through the company job portal."
}
```

The tool validates the input using Zod before creating the application.

Validation includes:

* Company name is required.
* Role is required.
* Company and role are limited to 100 characters.
* Company and role must contain letters.
* `date_applied` must use `YYYY-MM-DD`.
* `status` must be one of the allowed values.
* `source` must be one of the allowed values.
* `notes` is optional and limited to 500 characters.

A new application ID is generated and the record is stored in:

```text
./data/applications.json
```

### 2. `list_applications`

Returns stored job applications from the local JSON data file.

The tool validates application data before returning it and uses an output limit to prevent excessively large responses.

### 3. `update_status`

Updates the status of an existing application.

The new status is restricted to the allowed application statuses.

If the application ID does not exist, the tool returns a clear error instead of exposing internal details.

### 4. `get_next_actions`

Provides suggested next actions based on the stored job application data.

The tool reads application information from the local JSON data file and applies the project's defined logic to determine the next actions.

## Application Status Values

The supported application statuses are:

```text
applied
interview
offer
rejected
no_response
```

## Application Sources

The supported application sources are:

```text
cold_apply
linkedin
referral
company_website
career_fair
```

## Data Storage

The project uses a local JSON file instead of an external database or API:

```text
./data/applications.json
```

Example application:

```json
{
  "id": "app-001",
  "company": "Example Company",
  "role": "Software Engineer",
  "date_applied": "2026-08-12",
  "status": "applied",
  "source": "linkedin",
  "notes": ""
}
```

No external API is required to run the project.

## Environment Variables and Secrets

The project currently does not require API keys, tokens, or other secrets.

Environment files are excluded from Git:

```text
.env
.env.local
```

A `.env.example` file is included only as a placeholder for good practice.

No secret values should be placed in the repository.

## Security Hardening

Security hardening was performed during Week 4.

The project includes:

* Zod input validation.
* Length limits on user-provided fields.
* Allowlisted status and source values.
* Local file access restricted to the project's data file.
* Output limits for tools that return multiple records.
* Short error messages without raw stack traces.
* `.env` and `.env.local` excluded through `.gitignore`.
* No external APIs or API keys are required.

More details are available in:

```text
docs/threat-model.md
SECURITY.md
```

## Testing with MCP Inspector

The project can be tested using MCP Inspector.

Start Inspector with:

```bash
npm run inspect
```

In MCP Inspector:

1. Open the Tools section.
2. Confirm the four tools are listed:

   * `add_application`
   * `list_applications`
   * `update_status`
   * `get_next_actions`
3. Test each tool with valid input.
4. Test invalid input and confirm that validation rejects it.

### Example validation test

For `add_application`, an empty role should be rejected:

```json
{
  "company": "Google",
  "role": "",
  "date_applied": "2026-08-12",
  "status": "applied",
  "source": "linkedin"
}
```

The validation should reject the request instead of creating an invalid application.

## Documentation

Additional project documentation is available in the `docs` directory:

* `project-choice.md` — Project selection and scope.
* `design.md` — Tool and server design.
* `data-plan.md` — Data storage and data handling plan.
* `threat-model.md` — Security threats and mitigations.
* `review-checklist.md` — Peer review results and action items.

## Team

* Taima Nazzal
* Shahd Raed Shwekeyeh
* Joud Thaher
* Razan Froukh

## References

* [Model Context Protocol](https://modelcontextprotocol.io/)
* [Zod](https://zod.dev/)



