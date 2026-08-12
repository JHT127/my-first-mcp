import { McpServer } from "@modelcontextprotocol/server";
import { listApplicationsInputSchema } from "../schemas/list_applications.js";
import { listApplications } from "../lib/applications.js";

export function registerListApplicationsTool(server: McpServer) {
  server.registerTool(
    "list_applications",
    {
      title: "List Job Applications",
      description:
        "Lists job applications, optionally filtered by status. Returns at most 50 applications.",
      inputSchema: listApplicationsInputSchema,
    },
    async (input) => {
      try {
        const result = await listApplications(input.status);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  statusFilter: input.status ?? null,
                  applications: result.applications,
                  total: result.total,
                  truncated: result.truncated,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        console.error("list_applications failed");

        return {
          content: [
            {
              type: "text",
              text: "Could not read applications data.",
            },
          ],
        };
      }
    }
  );
}