import * as z from "zod/v4";

export const applicationDataSchema = z.object({
  id: z
    .string()
    .regex(/^app-\d+$/, "Invalid application ID."),

  company: z
    .string()
    .min(1)
    .max(100),

  role: z
    .string()
    .min(1)
    .max(100),

  date_applied: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/),

  status: z.enum([
    "applied",
    "interview",
    "offer",
    "rejected",
    "no_response",
  ]),

  source: z.enum([
    "cold_apply",
    "linkedin",
    "referral",
    "company_website",
    "career_fair",
  ]),

  notes: z
    .string()
    .max(500),
});

export const applicationsDataSchema = z.array(applicationDataSchema);

export type ApplicationData = z.infer<typeof applicationDataSchema>;