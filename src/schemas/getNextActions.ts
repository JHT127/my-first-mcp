import * as z from "zod/v4";

// Schema for the get_next_actions tool
export const getNextActionsInputSchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .max(10)
    .optional()
    .describe("Optional maximum number of next actions to return."),
  status: z
    .enum(["applied", "interview", "offer", "rejected", "no_response"])
    .optional()
    .describe("Optional status filter for the returned actions."),
});
