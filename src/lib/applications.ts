import { promises as fs } from "node:fs";
import * as path from "node:path";

import {
  applicationsDataSchema,
  ApplicationData,
} from "../schemas/applicationData.js";

const DATA_PATH = path.resolve("data", "applications.json");

// Maximum number of applications returned by listApplications.
const MAX_APPLICATIONS = 50;

export async function loadApplications(): Promise<ApplicationData[]> {
  try {
    const file = await fs.readFile(DATA_PATH, "utf8");

    const data = JSON.parse(file);

    return applicationsDataSchema.parse(data);
  } catch { 
    console.error("Failed to load applications data.");
    throw new Error("Could not read applications data.");
  }
}

export async function saveApplications(
  applications: ApplicationData[]
): Promise<void> {
  await fs.writeFile(
    DATA_PATH,
    JSON.stringify(applications, null, 2),
    "utf8"
  );
}

export async function addApplication(
  application: ApplicationData
): Promise<ApplicationData> {
  const applications = await loadApplications();

  const duplicate = applications.some(
    (app) => app.id === application.id
  );

  if (duplicate) {
    throw new Error(
      `Application with id ${application.id} already exists.`
    );
  }

  applications.push(application);

  applications.sort(
    (a, b) =>
      new Date(a.date_applied).getTime() -
      new Date(b.date_applied).getTime()
  );

  await saveApplications(applications);

  return application;
}

export async function generateApplicationId(): Promise<string> {
  const applications = await loadApplications();

  if (applications.length === 0) {
    return "app-001";
  }

  const lastId = applications[applications.length - 1].id;

  const lastNumber = Number(lastId.replace("app-", ""));

  const nextNumber = lastNumber + 1;

  return `app-${String(nextNumber).padStart(3, "0")}`;
}

const VALID_STATUSES: ApplicationData["status"][] = [
  "applied",
  "interview",
  "offer",
  "rejected",
  "no_response",
];

export async function updateApplicationStatus(
  id: string,
  newStatus: ApplicationData["status"]
): Promise<ApplicationData> {
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  const applications = await loadApplications();
  const application = applications.find((app) => app.id === id);
  if (!application) {
    throw new Error(`No application found with id: ${id}`);
  }
  application.status = newStatus;
  await saveApplications(applications);
  return application;
}

export async function listApplications(
  status?: ApplicationData["status"]
): Promise<{
  applications: ApplicationData[];
  total: number;
  truncated: boolean;
}> {
  const applications = await loadApplications();

  const filteredApplications = status
    ? applications.filter((app) => app.status === status)
    : applications;

  const total = filteredApplications.length;

  const truncated = total > MAX_APPLICATIONS;

  return {
    applications: filteredApplications.slice(0, MAX_APPLICATIONS),
    total,
    truncated,
  };
}