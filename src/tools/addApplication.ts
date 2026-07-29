import { McpServer } from "@modelcontextprotocol/server";

import { addApplicationInputSchema } from "../schemas/addApplication.js";


export function registerAddApplicationTool(server: McpServer) {

  server.registerTool(
    "add_application",
    {
      title: "Add Job Application",

      description:
        "Add a new job application record to the tracker.",

      inputSchema: addApplicationInputSchema,
    },


    async (input) => {

      const application = {
        id: `app-${Date.now()}`,

        company: input.company,
        role: input.role,
        date_applied: input.date_applied,
        status: input.status,
        source: input.source,
        notes: input.notes ?? "",
      };


      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(application, null, 2),
          },
        ],
      };

    }
  );

}