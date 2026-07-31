import { McpServer } from "@modelcontextprotocol/server";
import { getStaleApplicationsInputSchema } from "../schemas/getStaleApplications.js";

export function registerGetStaleApplicationsTool(server: McpServer) {
  server.registerTool(
    "get_stale_applications",
    {
      title: "Get Stale Applications",
      description:
        "Returns applications that have gone without a status update for a given number of days.",
      inputSchema: getStaleApplicationsInputSchema,
    },
    async (input) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                threshold: input.days_threshold ?? 14,
                applications: [],
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}
