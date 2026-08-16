import { McpServer } from "@modelcontextprotocol/server";
import { listApplicationsInputSchema } from "../schemas/list_applications.js";
import { listApplications } from "../lib/applications.js";

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
      try {
        const allMatching = await listApplications(input.status);

        const CAP = 50;
        const total = allMatching.length;
        const truncated = total > CAP;
        const applications = allMatching.slice(0, CAP);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  statusFilter: input.status ?? null,
                  applications,
                  total,
                  truncated,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        console.error("list_applications failed:", error);

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