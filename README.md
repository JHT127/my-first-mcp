# Job Application Tracker MCP

A Model Context Protocol (MCP) server for managing job application records.

The server allows an MCP client such as MCP Inspector to:

* Add job applications.
* List stored applications.
* Update application statuses.
* Get suggested next actions.

Application data is stored locally in:

```text
./data/applications.json
```

The project does not require external APIs, databases, API keys, or network services.

## Requirements

Before installing the project, make sure you have:

* Node.js
* npm

Check your installed versions:

```bash
node --version
npm --version
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd my-first-mcp
```

Install the project dependencies:

```bash
npm install
```

## Run the Server

Start the MCP server with:

```bash
npm run dev
```

The server communicates over stdio, so it may continue running without displaying normal terminal output.

To stop the server:

```text
Ctrl+C
```

## Run MCP Inspector

MCP Inspector can be used to connect to the server and test its tools.

Run:

```bash
npm run inspect
```

The direct Inspector command is:

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

After Inspector starts:

1. Open the Tools section.
2. Confirm that the four MCP tools are available.
3. Call the tools with valid inputs.
4. Test invalid inputs and confirm that validation errors are returned.

## Available Tools

| Tool                | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `add_application`   | Adds a new job application to the tracker.                |
| `list_applications` | Lists stored job applications.                            |
| `update_status`     | Updates the status of an existing application.            |
| `get_next_actions`  | Returns suggested next actions based on application data. |

### `add_application`

Adds a new job application.

The input is validated using Zod before the application is stored.

Validation includes:

* Company name is required.
* Role is required.
* Company and role are limited to 100 characters.
* Company and role must contain letters.
* `date_applied` must use `YYYY-MM-DD`.
* `status` must be one of the supported values.
* `source` must be one of the supported values.
* `notes` is optional and limited to 500 characters.

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

### `list_applications`

Returns stored job applications from:

```text
./data/applications.json
```

The tool validates application data before returning it and limits the amount of output returned.

### `update_status`

Updates the status of an existing application.

Supported statuses are:

```text
applied
interview
offer
rejected
no_response
```

If the application ID does not exist, the tool returns a clear error.

### `get_next_actions`

Provides suggested next actions based on the stored job application data.

## Example Prompts

The following prompts can be used when testing the server through an MCP client:

```text
Add a job application for Google for the Software Engineer role.
The application date is 2026-08-12, the status is applied, and the source is linkedin.
```

```text
List all my job applications.
```

```text
Update application app-001 to interview status.
```

```text
What are my next actions for my job applications?
```

## Application Statuses

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

Application data is stored in a local JSON file:

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

The project does not use an external database or API.

## Troubleshooting

### 1. `npm` or `node` is not recognized

**Cause:** Node.js or npm is not installed or is not available in the system PATH.

**Solution:** Install Node.js, restart the terminal, and verify:

```bash
node --version
npm --version
```

### 2. `Cannot find module` or missing dependency errors

**Cause:** Project dependencies have not been installed.

**Solution:** From the project directory, run:

```bash
npm install
```

Then start the server again:

```bash
npm run dev
```

### 3. MCP tool input validation error

**Cause:** The supplied tool input does not match the required schema. For example, a required field such as `role` may be empty or a status/source value may not be supported.

**Solution:** Check the tool requirements and provide valid values.

For example, this invalid input:

```json
{
  "company": "Google",
  "role": "",
  "date_applied": "2026-08-12",
  "status": "applied",
  "source": "linkedin"
}
```

should be rejected because the role is empty.

## Security

Security hardening was performed during Week 4.

The project includes:

* Zod input validation.
* Length limits on user-provided fields.
* Allowlisted status and source values.
* Restricted local file access.
* Output limits for tools that return multiple records.
* Short error messages without raw stack traces.
* `.env` and `.env.local` excluded through `.gitignore`.
* No external APIs or API keys are required.

Additional security details are available in:

```text
docs/threat-model.md
SECURITY.md
```

## Project Documentation

Additional documentation is available in the `docs` directory:

* `project-choice.md` — Project selection and scope.
* `design.md` — Tool and server design.
* `data-plan.md` — Data storage and data handling plan.
* `threat-model.md` — Security threats and mitigations.
* `review-checklist.md` — Peer review results and action items.

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
│   ├── test-plan.md
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

## Team

* Taima Nazzal
* Shahd Raed Shwekeyeh
* Joud Thaher
* Razan Froukh

## License

This project is licensed under the ISC License.
