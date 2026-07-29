// Schema for add_application tool

import * as z from "zod/v4";

export const addApplicationInputSchema = z.object({
  company: z
    .string()
    .min(1)
    .max(100)
    .regex(/[a-zA-Z]/, "Company name must contain letters.")
    .describe("Company name where the user applied."),

  role: z
    .string()
    .min(1)
    .max(100)
    .regex(/[a-zA-Z]/, "Job title must contain letters.")
    .describe("Job title or position the user applied for."),

  date_applied: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .describe("Application date in YYYY-MM-DD format."),

  status: z
    .enum([
      "applied",
      "interview",
      "offer",
      "rejected",
      "no_response"
    ])
    .default("applied")
    .describe("Current application status."),

  source: z
    .enum([
      "cold_apply",
      "linkedin",
      "referral",
      "company_website",
      "career_fair"
    ])
    .default("cold_apply")
    .describe("Where the application was submitted."),

  notes: z
    .string()
    .max(500)
    .optional()
    .describe("Optional notes about this application."),
});