import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listApplicationsInputSchema } from "../schemas/list_applications.js";

export function registerListApplicationsTool(server: McpServer) {
  server.registerTool(
    "list_applications",
    {
      description:
        "Lists all job applications, optionally filtered by status.",
      inputSchema: listApplicationsInputSchema,
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: true,
                stub: true,
                tool: "list_applications",
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