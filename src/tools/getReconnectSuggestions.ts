import { McpServer } from "@modelcontextprotocol/server";

export function registerGetReconnectSuggestionsTool(server: McpServer) {
  server.registerTool(
    "get_reconnect_suggestions",
    {
      title: "Get Reconnect Suggestions",
      description:
        "Suggests networking contacts to reconnect with based on recent activity.",
      inputSchema: {},
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                contacts: [],
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
