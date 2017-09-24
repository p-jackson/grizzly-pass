import * as actions from "./actions";

it("creates a LoadProjectJsonSuccess action", () => {
  expect(
    actions.loadProjectJsonSuccess({
      title: undefined,
      labels: [],
      projects: []
    })
  ).toMatchSnapshot();
});

it("creates a LoadProjectJsonFailure action", () => {
  expect(actions.loadProjectJsonFailure("error")).toMatchSnapshot();
});

it("creates a LoadProjectJsonFailure action with multiple errors", () => {
  expect(
    actions.loadProjectJsonFailure(["error1", "error2"])
  ).toMatchSnapshot();
});

it("creates a LoadProject action", () => {
  expect(
    actions.loadProject("title", "person", "time", 0, "ontrack", [])
  ).toMatchSnapshot();
});

it("creates a LoadLabel action", () => {
  expect(actions.loadLabel("title")).toMatchSnapshot();
});

it("creates an UpdateProject action", () => {
  const id = "1";
  const title = "title";
  const person = "person";
  const time = "time";
  const progress = 0;
  const status = "ontrack";
  const labels = ["1", "2", "3"];
  expect(
    actions.updateProject({ id, title, person, time, progress, status, labels })
  ).toMatchSnapshot();
});

it("creates a SelectTab action", () => {
  expect(actions.selectTab("edit")).toMatchSnapshot();
});

it("can create a SelectTab action with no tab selected", () => {
  expect(actions.selectTab(undefined)).toMatchSnapshot();
});
