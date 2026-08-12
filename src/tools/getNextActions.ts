import { McpServer } from "@modelcontextprotocol/server";

import { getNextActionsInputSchema } from "../schemas/getNextActions.js";
import { loadApplications } from "../lib/applications.js";
import type { ApplicationData } from "../schemas/applicationData.js";

export function buildNextActions(applications: ApplicationData[]) {
  const today = new Date("2026-07-31T00:00:00.000Z");

  return applications
    .map((application) => {
      const appliedDate = new Date(`${application.date_applied}T00:00:00.000Z`);
      const daysSinceApplied = Math.floor(
        (today.getTime() - appliedDate.getTime()) / 86_400_000,
      );
      const isStale = daysSinceApplied >= 14;
      const recentlyUpdated = daysSinceApplied <= 3;

      if (isStale) {
        return {
          action: `Follow up with ${application.company}`,
          application_id: application.id,
          reason: `stale application: ${daysSinceApplied} days without an update.`,
        };
      }

      if (recentlyUpdated) {
        return {
          action: `Prepare for ${application.company}`,
          application_id: application.id,
          reason: `recently updated to ${application.status}.`,
        };
      }

      return null;
    })
    .filter((action): action is NonNullable<typeof action> => action !== null);
}

export function registerGetNextActionsTool(server: McpServer) {
  server.registerTool(
    "get_next_actions",
    {
      title: "Get Next Actions",
      description:
        "Returns prioritized next actions for stale applications and recent status changes.",
      inputSchema: getNextActionsInputSchema,
    },
    async (input) => {
      try {
        let applications = await loadApplications();

        if (input.status) {
          applications = applications.filter(
            (app) => app.status === input.status,
          );
        }

        let actions = buildNextActions(applications);

        const requestedLimit = input.limit ?? 10;
        // Enforce schema-level cap and ensure a sensible lower bound.
        const limit = Math.min(Math.max(1, requestedLimit), 10);

        const total = actions.length;
        const truncated = total > limit;

        actions = actions.slice(0, limit);

        if (actions.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "No next actions right now — nothing stale or recently updated.",
              },
            ],
          };
        }

        const response = {
          statusFilter: input.status ?? null,
          total,
          truncated,
          limit,
          actions,
        };

        // If we truncated the results, be explicit about it in the returned text.
        const text = JSON.stringify(response, null, 2) + (truncated ? "\n\n(Note: results truncated to the requested limit)" : "");

        return {
          content: [
            {
              type: "text",
              text,
            },
          ],
        };
      } catch (err: any) {
        console.error("[get_next_actions] error", err);

        return {
          content: [
            {
              type: "text",
              text: "Unable to compute next actions.",
            },
          ],
        };
      }
    },
  );
}
