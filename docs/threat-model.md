# Threat Model — Job Application Tracker MCP

## Assets

- `./data/applications.json` — application records that must not be corrupted or unexpectedly modified.
- The local filesystem — the server should only access the intended application data file.
- Tool responses — responses should remain valid and reasonably sized.
- Secrets/tokens — none are currently used because the project has no external APIs or services.

## Trust Boundaries

- Model → tool arguments: all tool inputs are untrusted and must be validated.
- Tool → filesystem: tools read/write `./data/applications.json`, so file access must stay within the intended data location.
- Tool → network: no network boundary exists in the current P0 tools because the server uses only local JSON data.

## Top 5 Risks

1. **Invalid or malicious tool input** — `add_application` and `update_status` could receive invalid values and corrupt application data.
2. **Path traversal** — future file-related inputs could be used to access files outside `./data`; current P0 tools use a fixed data path.
3. **Malformed or corrupted JSON** — a broken `applications.json` could cause tools to fail or return invalid data.
4. **Runaway responses** — `list_applications` could return too many records if the data file becomes very large.
5. **Sensitive information in logs** — unnecessary logging of tool inputs or application notes could expose user-provided information.

## Mitigations This Week

- Use Zod schemas and enum allowlists to validate all tool arguments.
- Keep the data file path fixed and reject unsafe paths if file-path handling is added.
- Validate parsed JSON before using it and return clear errors when the file is missing or malformed.
- Add reasonable response/record limits to prevent excessively large tool responses.
- Log only tool names and failure reasons; do not log unnecessary application data or secrets.

## Out of Scope

- Authentication and multi-user access — the MVP is a local, single-user MCP server.
- SSRF and external API security — P0 tools do not make network requests.
- Encryption at rest — not required for the current student MVP.
- Advanced concurrency and multi-process file locking — outside the current project scope.
- Production deployment security — this project is designed for a local educational demo.