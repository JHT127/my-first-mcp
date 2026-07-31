import * as z from "zod/v4";

export const getStaleApplicationsInputSchema = z.object({
  days_threshold: z
    .number()
    .int()
    .positive()
    .max(365)
    .optional()
    .default(14)
    .describe(
      "Optional number of days without an update before an application is considered stale.",
    ),
});
