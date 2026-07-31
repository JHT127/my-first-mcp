import * as z from "zod/v4";

export const addContactInputSchema = z.object({
  person: z
    .string()
    .min(1)
    .max(100)
    .describe("Name of the recruiter or networking contact."),

  company: z
    .string()
    .min(1)
    .max(100)
    .describe("Company associated with the contact."),

  linkedin: z
    .string()
    .url()
    .optional()
    .describe("Optional LinkedIn profile URL for the contact."),

  last_message_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe("Optional date of the last message in YYYY-MM-DD format."),

  notes: z
    .string()
    .max(500)
    .optional()
    .describe("Optional notes about the contact."),
});
