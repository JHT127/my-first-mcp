import { McpServer } from "@modelcontextprotocol/server";
import { listApplicationsInputSchema } from "../schemas/list_applications.js";

export function registerListApplicationsTool(server: McpServer) {
  server.registerTool(
    "list_applications",
    {
      title: "List Job Applications",
      description:
        "Lists all job applications, optionally filtered by status.",
      inputSchema: listApplicationsInputSchema,
    },

    async (input) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                statusFilter: input.status ?? null,
                applications: [],
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}