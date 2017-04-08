// @flow

import { importFile, validateProject } from "./import";
import uniq from "lodash/uniq";
import omit from "lodash/omit";
import flow from "lodash/flow";
import moment from "moment";
import { ok, isErr, orElse, unsafeUnwrap } from "./result";

const untaggedProjects = [
  {
    title: "Tea Swirl",
    person: "Karen Lemon",
    date: "2017-08-28",
    progress: 23,
    health: "ontrack"
  },
  {
    title: "Rake Jumper",
    person: "Lennie Apple",
    date: "2018-02-19",
    progress: 90,
    health: "onhold"
  },
  {
    title: "Empty Tag List",
    person: "Timmy no Tag",
    date: "2018-02-17",
    progress: 90,
    health: "onhold",
    tags: []
  }
];

const taggedProjects = [
  {
    title: "Coffee Swirl",
    person: "Joe Lemon",
    date: "2017-03-15",
    progress: 13,
    health: "ontrack",
    tags: ["Apple"]
  },
  {
    title: "Rake Twister",
    person: "Alex Apple",
    date: "2017-03-15",
    progress: 50,
    health: "onhold",
    tags: ["Apple", "Orange"]
  }
];

const allProjects = [...taggedProjects, ...untaggedProjects];

function uniqueIds({ projects, labels }) {
  const projectIds = projects.map(({ id }) => id);
  const labelIds = labels.map(({ id }) => id);
  const ids = [...projectIds, ...labelIds];
  return ids.every(i => typeof i === "string") &&
    uniq(ids).length === ids.length;
}

// Remove ids so projects can be snapshotted (ids can be
// different each time).
function stripIds({ title, projects, labels }) {
  return {
    title,
    projects: projects.map(p => omit(p, "id", "labels")),
    labels: labels.map(l => omit(l, "id"))
  };
}

// Force project end times to UTC time (switching the
// actual instant in time) so it can be snapshotted.
function utcTimes({ title, projects, labels }) {
  return {
    title,
    projects: projects.map(project => ({
      ...project,
      time: moment(project.time).utcOffset(0, true)
    })),
    labels
  };
}

describe("importFile", () => {
  it("returns invalid if the file is not an array", () => {
    expect(isErr(importFile("3"))).toBe(true);
    expect(isErr(importFile("{a:1}"))).toBe(true);
    expect(isErr(importFile(`"string"`))).toBe(true);
  });

  // The import format doesn't support titles
  it("always returns null for the title", () => {
    expect(
      unsafeUnwrap(importFile(JSON.stringify(allProjects)))
    ).toMatchObject({
      title: null
    });
  });

  it("imports projects with no labels", () => {
    const result = unsafeUnwrap(importFile(JSON.stringify(untaggedProjects)));
    expect(result).toMatchObject({
      labels: [],
      projects: [
        {
          title: "Tea Swirl",
          person: "Karen Lemon",
          time: moment("2017-08-28", "YYYY-MM-DD").format(),
          progress: 23,
          status: "ontrack",
          labels: []
        },
        {
          title: "Rake Jumper",
          person: "Lennie Apple",
          time: moment("2018-02-19", "YYYY-MM-DD").format(),
          progress: 90,
          status: "onhold",
          labels: []
        },
        {
          title: "Empty Tag List",
          person: "Timmy no Tag",
          time: moment("2018-02-17", "YYYY-MM-DD").format(),
          progress: 90,
          status: "onhold",
          labels: []
        }
      ]
    });
    expect(uniqueIds(result)).toEqual(true);
    expect(utcTimes(stripIds(result))).toMatchSnapshot();
  });

  it("imports projects with labels", () => {
    const imported = importFile(JSON.stringify(taggedProjects));
    expect(imported.type).toBe("ok");
    if (imported.type !== "ok") return;

    const result = imported.value;
    expect(result).toMatchObject({
      labels: [{ title: "Apple" }, { title: "Orange" }],
      projects: [
        {
          title: "Coffee Swirl",
          person: "Joe Lemon",
          time: moment("2017-03-15", "YYYY-MM-DD").format(),
          progress: 13,
          status: "ontrack"
        },
        {
          title: "Rake Twister",
          person: "Alex Apple",
          time: moment("2017-03-15", "YYYY-MM-DD").format(),
          progress: 50,
          status: "onhold"
        }
      ]
    });

    expect(result.projects[0].labels.length).toBe(1);
    expect(result.projects[1].labels.length).toBe(2);

    const allLabelIds = uniq([
      ...result.projects[0].labels,
      ...result.projects[1].labels
    ]);
    expect(allLabelIds).toEqual([result.labels[0].id, result.labels[1].id]);

    expect(uniqueIds(result)).toBe(true);
    expect(utcTimes(stripIds(result))).toMatchSnapshot();
  });

  it("interprets dates as midnight local time", () => {
    const { time } = flow(JSON.stringify, importFile, unsafeUnwrap)(
      allProjects.slice(0, 1)
    ).projects[0];

    // Timezone offsets change depending on the date (remember daylight savings)
    // so get the local offset for the date in allProjects[0]
    // (moment parses all dates in local time by default).
    const offset = moment(allProjects[0].date, "YYYY-MM-DD").utcOffset();

    expect(moment.parseZone(time).utcOffset()).toBe(offset);
    expect(moment(time).hour()).toBe(0);
    expect(moment(time).minute()).toBe(0);
    expect(moment(time).second()).toBe(0);
    expect(moment(time).millisecond()).toBe(0);
  });

  it("returns an array of errors for invalid projects", () => {
    const err = flow(
      JSON.stringify,
      importFile,
      orElse(e => ok(e)),
      unsafeUnwrap
    )([omit(allProjects[0], "title")]);
    expect(err.length).toBe(1);
  });
});

describe("validateProject", () => {
  allProjects.forEach((project, i) => {
    it(`correctly validates an importable project ${i}`, () => {
      expect(unsafeUnwrap(validateProject(project))).toEqual(project);
    });
  });

  it("rejects when project is not an object", () => {
    expect(isErr(validateProject())).toBe(true);
    expect(isErr(validateProject("str"))).toBe(true);
    expect(isErr(validateProject(3))).toBe(true);
  });

  const project = untaggedProjects[0];
  Object.keys(project).forEach(key => {
    it(`rejects project when ${key} field is missing`, () => {
      expect(isErr(validateProject(omit(project, key)))).toBe(true);
    });
  });

  it("ignores unknown project properties", () => {
    const project = { ...allProjects[0], unknown: "prop" };
    expect(unsafeUnwrap(validateProject(project))).toEqual(project);
  });

  it("rejects a project with invalid tags field", () => {
    const project = { ...allProjects[0], tags: 3 };
    expect(isErr(validateProject(project))).toBe(true);
  });

  it("reject a project with that uses non-string tags", () => {
    const project = { ...allProjects[0], tags: ["Tag", 3, "Tag2"] };
    expect(isErr(validateProject(project))).toBe(true);
  });

  it("rejects invalid project `health` properties", () => {
    const project = { ...allProjects[0], health: "wrong" };
    expect(isErr(validateProject(project))).toBe(true);
  });
});
