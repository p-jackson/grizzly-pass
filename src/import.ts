import moment from "moment";
import { uniqueId } from "./unique-id";
import { ok, err, fromList, type Result } from "./result";
import { statusIds } from "./types";
import type { Project, Label, Status } from "./types";

type ImportProject = {
  title: string;
  person: string;
  date: string;
  progress: number;
  health: Status;
  tags: string[];
};

type Output = {
  title?: string;
  projects: Project[];
  labels: Label[];
};

export function importFile(
  fileContents: string,
): Result<Output, string | string[]> {
  return parseFile(fileContents)
    .mapErr((e) => `File ${e}`)
    .andThen((data) =>
      fromList(data.map(validateProject)).mapErr((badProjects) =>
        badProjects.map((badProject, i) => `Project ${i + 1} ${badProject}`),
      ),
    )
    .map((projects) => [projects, generateLabels(projects)])
    .map(([projects, labels]: [ImportProject[], Label[]]) => ({
      title: undefined,
      projects: projects.map((project) => {
        const { title, person, health, progress, date, tags = [] } = project;
        return {
          id: uniqueId(),
          title,
          person,
          status: health,
          progress,
          time: moment(date, "YYYY-MM-DD").format(),
          labels: findLabelIds(labels, tags),
        };
      }),
      labels,
    }));
}

export function validateProject(project: any): Result<ImportProject, string> {
  if (
    typeof project !== "object" ||
    Object.prototype.toString.call(project) !== "[object Object]"
  )
    return err("is not a JSON object");
  if (typeof project.title !== "string")
    return err("has an invalid/missing title field");
  if (typeof project.person !== "string")
    return err("has an invalid/missing person field");
  if (!statusIds.includes(project.health))
    return err(
      `has an invalid/missing health field, it must be one of: ${statusIds.join(
        ", ",
      )}`,
    );
  if (
    typeof project.date !== "string" ||
    !/^\d\d\d\d-\d\d-\d\d$/.test(project.date)
  )
    return err(
      "has an invalid/missing date field, it must be in the YYYY-MM-DD format",
    );
  if (
    typeof project.progress !== "number" ||
    project.progress < 0 ||
    project.progress > 100
  )
    return err("has an invalid/missing, it must be a number between 0 and 100");
  if (
    project.tags !== undefined &&
    (!Array.isArray(project.tags) ||
      project.tags.some((t: any) => typeof t !== "string"))
  )
    return err("has an invalid tags list, it must be an array of strings");

  return ok(project);
}

function parseFile(fileContents: string): Result<any[], string> {
  try {
    const asObj = JSON.parse(fileContents);
    return Array.isArray(asObj) ? ok(asObj) : err("isn't a JSON array");
  } catch {
    return err("is not valid JSON");
  }
}

function generateLabels(projects: ImportProject[]): Label[] {
  return projects
    .reduce((memo, { tags = [] }) => [...memo, ...tags], [])
    .map((label) => ({ title: label, id: uniqueId() }))
    .filter((x, i, self) => i === self.findIndex((y) => x.title === y.title));
}

function findLabelIds(labels: Label[], projectTags: string[]) {
  return projectTags.map(
    (tag) => (labels.find((l) => l.title === tag) as any).id,
  );
}
