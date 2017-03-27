import { importFile, validateProject } from "./import";
import uniq from "lodash/uniq";
import omit from "lodash/omit";
import moment from "moment";
import { Ok } from "./result";

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
    expect(importFile().isErr()).toBe(true);
    expect(importFile(3).isErr()).toBe(true);
    expect(importFile("3").isErr()).toBe(true);
    expect(importFile("{a:1}").isErr()).toBe(true);
    expect(importFile(`"string"`).isErr()).toBe(true);
  });

  // The import format doesn't support titles
  it("always returns null for the title", () => {
    expect(
      importFile(JSON.stringify(allProjects)).unsafeUnwrap()
    ).toMatchObject({
      title: null
    });
  });

  it("imports projects with no labels", () => {
    const result = importFile(JSON.stringify(untaggedProjects)).unsafeUnwrap();
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
    const result = importFile(JSON.stringify(taggedProjects)).unsafeUnwrap();
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
    expect(allLabelIds).toMatchObject([
      result.labels[0].id,
      result.labels[1].id
    ]);

    expect(uniqueIds(result)).toBe(true);
    expect(utcTimes(stripIds(result))).toMatchSnapshot();
  });

  it("interprets dates as midnight local time", () => {
    const { time } = importFile(
      JSON.stringify(allProjects.slice(0, 1))
    ).unsafeUnwrap().projects[0];

    expect(moment.parseZone(time).utcOffset()).toBe(moment().utcOffset());
    expect(moment(time).hour()).toBe(0);
    expect(moment(time).minute()).toBe(0);
    expect(moment(time).second()).toBe(0);
    expect(moment(time).millisecond()).toBe(0);
  });

  it("returns an array of errors for invalid projects", () => {
    const err = importFile(JSON.stringify([omit(allProjects[0], "title")]))
      .flatMapErr(e => Ok(e))
      .unsafeUnwrap();
    expect(err.length).toBe(1);
  });
});

describe("validateProject", () => {
  allProjects.forEach((project, i) => {
    it(`correctly validates an importable project ${i}`, () => {
      expect(validateProject(project).unsafeUnwrap()).toEqual(project);
    });
  });

  it("rejects when project is not an object", () => {
    expect(validateProject().isErr()).toBe(true);
    expect(validateProject("str").isErr()).toBe(true);
    expect(validateProject(3).isErr()).toBe(true);
  });

  const project = untaggedProjects[0];
  Object.keys(project).forEach(key => {
    it(`rejects project when ${key} field is missing`, () => {
      expect(validateProject(omit(project, key)).isErr()).toBe(true);
    });
  });

  it("ignores unknown project properties", () => {
    const project = { ...allProjects[0], unknown: "prop" };
    expect(validateProject(project).unsafeUnwrap()).toEqual(project);
  });

  it("rejects a project with invalid tags field", () => {
    const project = { ...allProjects[0], tags: 3 };
    expect(validateProject(project).isErr()).toBe(true);
  });

  it("reject a project with that uses non-string tags", () => {
    const project = { ...allProjects[0], tags: ["Tag", 3, "Tag2"] };
    expect(validateProject(project).isErr()).toBe(true);
  });
});
