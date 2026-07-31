import { McpServer } from "@modelcontextprotocol/server";

import { getNextActionsInputSchema } from "../schemas/getNextActions.js";

export interface ApplicationRecord {
  id: string;
  company: string;
  role: string;
  date_applied: string;
  status: "applied" | "interview" | "offer" | "rejected" | "no_response";
  source:
    | "cold_apply"
    | "linkedin"
    | "referral"
    | "company_website"
    | "career_fair";
  notes?: string;
}

export function buildNextActions(applications: ApplicationRecord[]) {
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
    async () => {
      const applications: ApplicationRecord[] = [
        {
          id: "app-1",
          company: "Orion VLSI Technologies",
          role: "Software Engineer",
          date_applied: "2026-07-01",
          status: "applied",
          source: "linkedin",
          notes: "No response yet",
        },
        {
          id: "app-2",
          company: "Exalt Technologies",
          role: "Frontend Developer",
          date_applied: "2026-07-28",
          status: "interview",
          source: "referral",
          notes: "Interview scheduled",
        },
      ];

      const actions = buildNextActions(applications);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(actions, null, 2),
          },
        ],
      };
    },
  );
}
