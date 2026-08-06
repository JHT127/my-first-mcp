import { McpServer } from "@modelcontextprotocol/server";
import {addApplication,generateApplicationId,} from "../lib/applications.js";
import { addApplicationInputSchema } from "../schemas/addApplication.js";

export function registerAddApplicationTool(server: McpServer) {
  server.registerTool(
    "add_application",
    {
      title: "Add Job Application",
      description: "Add a new job application record to the tracker.",
      inputSchema: addApplicationInputSchema,
    },

    async (input) => {
      try {
        const newId = await generateApplicationId();

        const application = await addApplication({
          id: newId,
          company: input.company,
          role: input.role,
          date_applied: input.date_applied,
          status: input.status,
          source: input.source,
          notes: input.notes ?? "",
        });

        return {
          content: [
            {
              type: "text",
              text: `Application added successfully.\n\n${JSON.stringify(
                application,
                null,
                2
              )}`,
            },
          ],
        };
      } catch (error) {
        console.error("[add_application]", error);

        return {
          content: [
            {
              type: "text",
              text: "Unable to add the application.",
            },
          ],
        };
      }
    }
  );
}