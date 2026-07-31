import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerAddApplicationTool } from "./tools/addApplication.js";
import { registerAddContactTool } from "./tools/addContact.js";
import { registerGetConversionStatsTool } from "./tools/getConversionStats.js";
import { registerGetHealthScoreTool } from "./tools/getHealthScore.js";
import { registerGetNextActionsTool } from "./tools/getNextActions.js";
import { registerGetReconnectSuggestionsTool } from "./tools/getReconnectSuggestions.js";
import { registerGetStaleApplicationsTool } from "./tools/getStaleApplications.js";
import { registerListApplicationsTool } from "./tools/listApplications.js";
import { registerSearchApplicationsTool } from "./tools/searchApplications.js";
import { registerUpdateStatusTool } from "./tools/updateStatus.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: "job-application-tracker",
    version: "0.1.0",
  });

  registerAddApplicationTool(server);
  registerListApplicationsTool(server);
  registerUpdateStatusTool(server);
  registerGetNextActionsTool(server);
  registerGetStaleApplicationsTool(server);
  registerSearchApplicationsTool(server);
  registerGetConversionStatsTool(server);
  registerGetHealthScoreTool(server);
  registerAddContactTool(server);
  registerGetReconnectSuggestionsTool(server);

  return server;
}

void serveStdio(createServer);
console.error("job-application-tracker MCP server running on stdio");
