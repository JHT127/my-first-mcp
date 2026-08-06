import * as z from "zod/v4";

export const applicationDataSchema = z.object({
  id: z.string(),

  company: z.string(),

  role: z.string(),

  date_applied: z.string(),

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

  notes: z.string(),
});

export const applicationsDataSchema = z.array(applicationDataSchema);

export type ApplicationData = z.infer<typeof applicationDataSchema>;