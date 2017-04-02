import { isArray, isPlainObject, uniqBy, uniqueId } from "lodash";
import * as moment from "moment";
import { Status, Project, Label, statusIds } from "./types";
import { Result, Err, Ok, fromList as resultFromList } from "./result";

export type ImportError = string | string[];
export type Store = {
  title?: string;
  projects: Project[];
  labels: Label[];
}

export function importFile(fileContents: string): Result<Store, ImportError> {
  return parseFile(fileContents)
    .mapErr(e => `File ${e}`)
    .andThen(data =>
      resultFromList(data.map(validateProject)).mapErr(badProjects =>
        badProjects.map((badProject, i) => `Project ${i + 1} ${badProject}`)))
    .map(projects => ({ projects, labels: generateLabels(projects) }))
    .map(({ projects, labels }) => ({
      title: undefined,
      projects: projects.map(project => {
        const { title, person, health, progress, date, tags = [] } = project;
        return {
          id: uniqueId(),
          title,
          person,
          status: health,
          progress,
          time: moment(date, "YYYY-MM-DD").format(),
          labels: findLabelIds(labels, tags).unsafeUnwrap()
        };
      }),
      labels
    }));
}

interface ImportProject {
  title: string;
  person: string;
  health: Status;
  date: string;
  progress: number;
  tags?: string[];
}

export function validateProject(project: any): Result<ImportProject, string> {
  if (!isPlainObject(project)) return Err("is not a JSON object");
  if (typeof project.title !== "string")
    return Err("has an invalid/missing title field");
  if (typeof project.person !== "string")
    return Err("has an invalid/missing person field");
  if (statusIds.indexOf(project.health) === -1)
    return Err(
      `has an invalid/missing health field, it must be one of: ${statusIds.join(", ")}`
    );
  if (
    typeof project.date !== "string" ||
    !/^\d\d\d\d-\d\d-\d\d$/.test(project.date)
  )
    return Err(
      "has an invalid/missing date field, it must be in the YYYY-MM-DD format"
    );
  if (
    typeof project.progress !== "number" ||
    project.progress < 0 ||
    project.progress > 100
  )
    return Err("has an invalid/missing, it must be a number between 0 and 100");
  if (
    project.tags !== undefined &&
    (!isArray(project.tags) || project.tags.some((t: any) => typeof t !== "string"))
  )
    return Err("has an invalid tags list, it must be an array of strings");

  return Ok(project);
}

function parseFile(fileContents: string): Result<any[], string> {
  try {
    const asObj = JSON.parse(fileContents);
    return isArray(asObj) ? Ok(asObj) : Err("isn't a JSON array");
  } catch (e) {
    return Err("is not valid JSON");
  }
}

function generateLabels(projects: ImportProject[]): Label[] {
  return uniqBy(
    projects
      .reduce((memo, { tags = [] }) => [...memo, ...tags], [] as string[])
      .map(label => ({ title: label, id: uniqueId() })),
    "title"
  );
}

function findLabelIds(labels: Label[], projectTags: string[]): Result<string[], string[]> {
  return resultFromList(projectTags.map(tag =>
    find(labels, l => l.title === tag).map(({ id }) => id)
  ));
}

function find<T>(arr: T[], f: (t: T) => boolean): Result<T, string> {
  const result = arr.find(f);
  if (result === undefined)
    return Err("Couldn't item in array");
  else
    return Ok(result);
}
