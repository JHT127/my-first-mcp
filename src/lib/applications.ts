import { promises as fs } from "node:fs";
import * as path from "node:path";

import {
  applicationsDataSchema,
  ApplicationData,
} from "../schemas/applicationData.js";

const DATA_PATH = path.resolve("data", "applications.json");

export async function loadApplications(): Promise<ApplicationData[]> {
  const file = await fs.readFile(DATA_PATH, "utf8");

  const data = JSON.parse(file);

  return applicationsDataSchema.parse(data);
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

  applications.push(application);

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