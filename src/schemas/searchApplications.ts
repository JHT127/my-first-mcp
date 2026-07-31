import * as z from "zod/v4";

export const searchApplicationsInputSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(100)
    .describe("Keyword to search for in company or role names."),
});
