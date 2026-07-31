import { McpServer } from "@modelcontextprotocol/server";
import { addContactInputSchema } from "../schemas/addContact.js";

export function registerAddContactTool(server: McpServer) {
  server.registerTool(
    "add_contact",
    {
      title: "Add Contact",
      description: "Adds a networking or recruiter contact record.",
      inputSchema: addContactInputSchema,
    },
    async (input) => {
      const contact = {
        id: `contact-${Date.now()}`,
        person: input.person,
        company: input.company,
        linkedin: input.linkedin ?? null,
        last_message_date: input.last_message_date ?? null,
        notes: input.notes ?? "",
        next_follow_up: null,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(contact, null, 2),
          },
        ],
      };
    },
  );
}
