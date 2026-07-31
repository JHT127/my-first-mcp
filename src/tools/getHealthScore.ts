import { McpServer } from "@modelcontextprotocol/server";
import { getHealthScoreInputSchema } from "../schemas/getHealthScore.js";

export function registerGetHealthScoreTool(server: McpServer) {
  server.registerTool(
    "get_health_score",
    {
      title: "Get Health Score",
      description:
        "Computes a simple health score for the job search based on recent activity.",
      inputSchema: getHealthScoreInputSchema,
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                score: 0,
                reasons: ["No applications tracked yet."],
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
