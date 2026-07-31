import { McpServer } from "@modelcontextprotocol/server";
import { getConversionStatsInputSchema } from "../schemas/getConversionStats.js";

export function registerGetConversionStatsTool(server: McpServer) {
  server.registerTool(
    "get_conversion_stats",
    {
      title: "Get Conversion Stats",
      description:
        "Returns response and interview conversion statistics by application source.",
      inputSchema: getConversionStatsInputSchema,
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                source: {
                  applied: 0,
                  responded: 0,
                  rate: 0,
                },
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
