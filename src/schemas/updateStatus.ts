import * as z from "zod/v4";

// Schema for the update_status tool

export const updateStatusInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(100)
    .describe("The unique ID of the application to update."),

  new_status: z
    .enum([
      "applied",
      "interview",
      "offer",
      "rejected"
    ])
    .describe("The new status to set for this application (e.g.rejection)."),
}); 
