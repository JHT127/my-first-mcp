# Example Conversations

These conversations show how a person actually talks to a model connected to
this MCP server, and how the model turns that plain-language request into
tool calls. All three run through Claude Desktop (or any MCP client) with the
Job Application Tracker server connected.

Together they exercise all four tools: `add_application`, `list_applications`,
`update_status`, and `get_next_actions`.

---

## Conversation A — Adding an application

**User prompt:**

> I just applied to Google for a Frontend Developer role through LinkedIn. Can you log it?

**Expected tool call:**

1. `add_application`
   ```json
   {
     "company": "Google",
     "role": "Frontend Developer",
     "date_applied": "2026-08-17",
     "status": "applied",
     "source": "linkedin"
   }
   ```

**Good final answer:**

> Logged it — Google, Frontend Developer, applied today via LinkedIn. I've marked the status as "applied." Let me know if you want to add any notes.

---

## Conversation B — Filtering applications

**User prompt:**

> What have I applied to so far that I haven't heard back from?

**Expected tool call:**

1. `list_applications`
   ```json
   {
     "status": "applied"
   }
   ```

**Good final answer:**

> You've got 3 applications sitting at "applied" with no response yet: Google (Frontend Developer, Aug 17), Orion VLSI Technologies (Software Engineer, Jul 1), and Exalt Technologies (Backend Engineer, Jul 28). Want me to check which ones are worth following up on?

---

## Conversation C — Getting next actions and acting on one

**User prompt:**

> What should I be doing next on my job search?

**Expected tool calls, in order:**

1. `get_next_actions`
   ```json
   {}
   ```
2. `update_status`
   ```json
   {
     "id": "app-002",
     "new_status": "interview"
   }
   ```
   *(This second call only happens after the user follows up — see below — not as part of the first response.)*

**Good final answer (after step 1):**

> A couple of things stand out: it's been 30 days since you applied to Orion VLSI Technologies with no update, so a follow-up email is probably worth sending. Separately, I see Exalt Technologies recently moved you to "interview" — want me to update that in the tracker?

**User follow-up:**

> Yes, update Exalt to interview status.

**Good final answer (after step 2):**

> Done — Exalt Technologies is now marked as "interview" in your tracker.

---

*Raw request/response JSON for each tool is in this same `examples/` directory
(`add_application.json`, `list_applications.json`, `update_status.json`,
`get_next_actions.json`) if you want to test them directly in MCP Inspector.*
