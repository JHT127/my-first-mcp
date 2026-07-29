// Schema for list_applications tool

import * as z from "zod/v4";

export const listApplicationsInputSchema = z.object({
  status: z
    .enum([
      "applied",
      "interview",
      "offer",
      "rejected",
      "no_response",
    ])
    .optional()
    .describe(
      "Optional application status to filter the returned applications. If omitted, all applications are returned."
    ),
});