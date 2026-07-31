import { McpServer } from "@modelcontextprotocol/server";
import { updateStatusInputSchema } from "../schemas/updateStatus.js";

export function registerUpdateStatusTool(server: McpServer) {
  server.registerTool(
    "update_status",
    {
      description: "Updates the status of an existing application. Use when the user reports a change (interview, rejection, offer).",
      inputSchema: updateStatusInputSchema,
    },
    async (input) => {
    
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { ok: true, stub: true, tool: "update_status", id: input.id, new_status: input.new_status },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}