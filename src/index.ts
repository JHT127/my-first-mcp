import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";


import { registerAddApplicationTool } from "./tools/addApplication.js";

function createServer(): McpServer {
const server = new McpServer({
  name: "job-application-tracker",
  version: "0.1.0",
});


registerAddApplicationTool(server);

 return server;
}

void serveStdio(createServer);
console.error("job-application-tracker MCP server running on stdio");