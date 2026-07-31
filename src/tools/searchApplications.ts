import { McpServer } from "@modelcontextprotocol/server";
import { searchApplicationsInputSchema } from "../schemas/searchApplications.js";

export function registerSearchApplicationsTool(server: McpServer) {
  server.registerTool(
    "search_applications",
    {
      title: "Search Applications",
      description: "Searches job applications by company or role keyword.",
      inputSchema: searchApplicationsInputSchema,
    },
    async (input) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                query: input.query,
                matches: [],
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
