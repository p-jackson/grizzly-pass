import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import uniqueId from "lodash/uniqueId";
import uniqBy from "lodash/uniqBy";
import moment from "moment";
import { Err, Ok, fromList as resultFromList } from "./result";

export function importFile(fileContents) {
  return parseFile(fileContents)
    .mapErr(e => `File ${e}`)
    .flatMap(data => resultFromList(data.map(validateProject)))
    .map(projects => [projects, generateLabels(projects)])
    .map(([projects, labels]) => ({
      title: null,
      projects: projects.map(project => {
        const { title, person, health, progress, date, tags = [] } = project;
        return {
          id: uniqueId(),
          title,
          person,
          status: health,
          progress,
          time: moment(date, "YYYY-MM-DD").format(),
          labels: findLabelIds(labels, tags)
        };
      }),
      labels
    }));
}

export function validateProject(project) {
  if (!isPlainObject(project)) return Err("is not a JSON object");
  if (typeof project.title !== "string")
    return Err("has an invalid/missing title field");
  if (typeof project.person !== "string")
    return Err("has an invalid/missing person field");
  if (typeof project.health !== "string")
    return Err("has an invalid/missing health field");
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
    (!isArray(project.tags) || project.tags.some(t => typeof t !== "string"))
  )
    return Err("has an invalid tags list, it must be an array of strings");

  return Ok(project);
}

function parseFile(fileContents) {
  try {
    const asObj = JSON.parse(fileContents);
    return isArray(asObj) ? Ok(asObj) : Err("isn't a JSON array");
  } catch (e) {
    return Err("is not valid JSON");
  }
}

function generateLabels(projects) {
  return uniqBy(
    projects
      .reduce((memo, { tags = [] }) => [...memo, ...tags], [])
      .map(label => ({ title: label, id: uniqueId() })),
    "title"
  );
}

function findLabelIds(labels, projectTags) {
  return projectTags.map(tag => labels.find(l => l.title === tag).id);
}
