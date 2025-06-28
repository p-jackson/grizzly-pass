vi.unmock("./unique-id");

import { parse, parseISO, format, formatISO } from "date-fns";
import { importFile, validateProject } from "./import";
import { ok } from "./result";
import type { Project, Label } from "./types";

const untaggedProjects = [
  {
    title: "Tea Swirl",
    person: "Karen Lemon",
    date: "2017-08-28",
    progress: 23,
    health: "ontrack",
  },
  {
    title: "Rake Jumper",
    person: "Lennie Apple",
    date: "2018-02-19",
    progress: 90,
    health: "onhold",
  },
  {
    title: "Empty Tag List",
    person: "Timmy no Tag",
    date: "2018-02-17",
    progress: 90,
    health: "onhold",
    tags: [],
  },
];

const taggedProjects = [
  {
    title: "Coffee Swirl",
    person: "Joe Lemon",
    date: "2017-03-15",
    progress: 13,
    health: "ontrack",
    tags: ["Apple"],
  },
  {
    title: "Rake Twister",
    person: "Alex Apple",
    date: "2017-03-15",
    progress: 50,
    health: "onhold",
    tags: ["Apple", "Orange"],
  },
];

const allProjects = [...taggedProjects, ...untaggedProjects];

function uniqueIds({
  projects,
  labels,
}: {
  projects: Project[];
  labels: Label[];
}) {
  const projectIds = projects.map(({ id }) => id);
  const labelIds = labels.map(({ id }) => id);
  const ids = [...projectIds, ...labelIds];
  return (
    ids.every((i) => typeof i === "string") && new Set(ids).size === ids.length
  );
}

// Remove ids so projects can be snapshotted (ids can be
// different each time).
function stripIds({
  title,
  projects,
  labels,
}: {
  title?: string;
  projects: Project[];
  labels: Label[];
}) {
  return {
    title,
    projects: projects.map(({ id, labels, ...rest }) => rest),
    labels: labels.map(({ id, ...rest }) => rest),
  };
}

// Force project end times to UTC time (switching the
// actual instant in time) so it can be snapshotted.
function utcTimes({
  title,
  projects,
  labels,
}: {
  title?: string;
  projects: Partial<Project>[];
  labels: Partial<Label>[];
}) {
  return {
    title,
    projects: projects.map((project) => ({
      ...project,
      time: format(project.time, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    })),
    labels,
  };
}

describe("importFile", () => {
  it("returns invalid if the file is not an array", () => {
    expect(importFile("3").isErr()).toBe(true);
    expect(importFile("{a:1}").isErr()).toBe(true);
    expect(importFile(`"string"`).isErr()).toBe(true);
  });

  // The import format doesn't support titles
  it("always returns undefined for the title", () => {
    expect(
      importFile(JSON.stringify(allProjects)).unsafeUnwrap(),
    ).toMatchObject({
      title: undefined,
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
          time: formatISO(parse("2017-08-28", "yyyy-MM-dd", new Date())),
          progress: 23,
          status: "ontrack",
          labels: [],
        },
        {
          title: "Rake Jumper",
          person: "Lennie Apple",
          time: formatISO(parse("2018-02-19", "yyyy-MM-dd", new Date())),
          progress: 90,
          status: "onhold",
          labels: [],
        },
        {
          title: "Empty Tag List",
          person: "Timmy no Tag",
          time: formatISO(parse("2018-02-17", "yyyy-MM-dd", new Date())),
          progress: 90,
          status: "onhold",
          labels: [],
        },
      ],
    });
    expect(uniqueIds(result)).toEqual(true);
    expect(utcTimes(stripIds(result))).toMatchSnapshot();
  });

  it("imports projects with labels", () => {
    const imported = importFile(JSON.stringify(taggedProjects));

    const result = imported.unsafeUnwrap();
    expect(result).toMatchObject({
      labels: [{ title: "Apple" }, { title: "Orange" }],
      projects: [
        {
          title: "Coffee Swirl",
          person: "Joe Lemon",
          time: formatISO(parse("2017-03-15", "yyyy-MM-dd", new Date())),
          progress: 13,
          status: "ontrack",
        },
        {
          title: "Rake Twister",
          person: "Alex Apple",
          time: formatISO(parse("2017-03-15", "yyyy-MM-dd", new Date())),
          progress: 50,
          status: "onhold",
        },
      ],
    });

    expect(result.projects[0].labels.length).toBe(1);
    expect(result.projects[1].labels.length).toBe(2);

    const allLabelIds = [
      ...new Set([...result.projects[0].labels, ...result.projects[1].labels]),
    ];
    expect(allLabelIds).toEqual([result.labels[0].id, result.labels[1].id]);

    expect(uniqueIds(result)).toBe(true);
    expect(utcTimes(stripIds(result))).toMatchSnapshot();
  });

  it("interprets dates as midnight local time", () => {
    const { time } = importFile(
      JSON.stringify(allProjects.slice(0, 1)),
    ).unsafeUnwrap().projects[0];

    // Timezone offsets change depending on the date (remember daylight savings)
    // so get the local offset for the date in allProjects[0]
    const offset = parse(
      allProjects[0].date,
      "yyyy-MM-dd",
      new Date(),
    ).getTimezoneOffset();

    expect(new Date(time).getTimezoneOffset()).toBe(offset);
    expect(new Date(time).getHours()).toBe(0);
    expect(new Date(time).getMinutes()).toBe(0);
    expect(new Date(time).getSeconds()).toBe(0);
    expect(new Date(time).getMilliseconds()).toBe(0);
  });

  it("returns an array of errors for invalid projects", () => {
    const { title, ...rest } = allProjects[0];
    const err = importFile(JSON.stringify([rest]))
      .orElse((e) => ok(e))
      .unsafeUnwrap();
    expect((err as any).length).toBe(1);
  });
});

describe("validateProject", () => {
  allProjects.forEach((project, i) => {
    it(`correctly validates an importable project ${i}`, () => {
      expect(validateProject(project).unsafeUnwrap()).toEqual(project);
    });
  });

  it("rejects when project is not an object", () => {
    expect(validateProject(undefined).isErr()).toBe(true);
    expect(validateProject("str").isErr()).toBe(true);
    expect(validateProject(3).isErr()).toBe(true);
  });

  const project = untaggedProjects[0];
  Object.keys(project).forEach((key) => {
    it(`rejects project when ${key} field is missing`, () => {
      const { [key]: _, ...rest } = project;
      expect(validateProject(rest).isErr()).toBe(true);
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

  it("rejects invalid project `health` properties", () => {
    const project = { ...allProjects[0], health: "wrong" };
    expect(validateProject(project).isErr()).toBe(true);
  });
});
