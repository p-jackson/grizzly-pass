import { loadProject, loadLabel, loadDemoData, selectTab } from "../actions";
import reducer, * as fromReducer from "../reducer";

function makeStore(
  ...projects: { title?: string; person?: string; labels?: string[] }[]
) {
  const projectActions = projects.map(
    ({ title = "title", person = "person", labels = [] }) =>
      loadProject(title, person, "time", 0, "ontrack", labels),
  );

  return projectActions.reduce(reducer, undefined) as fromReducer.State;
}

it("has no title by default", () => {
  const store = reducer(undefined as any, { type: "DUMMY_ACTION" });
  expect(fromReducer.getTitle(store)).toBe(undefined);
});

it("uses Demo Dashboard for the demo title", () => {
  const store = reducer(undefined as any, loadDemoData());
  expect(fromReducer.getTitle(store)).toBe("Demo Dashboard");
});

it("returns just the used labels", () => {
  const loadA = loadLabel("A");
  const loadB = loadLabel("B");
  const store = reducer(reducer(makeStore({ labels: ["1"] }), loadA), loadB);
  expect(fromReducer.getUsedLabels(store)).toEqual(["1"]);
});

it("makes projects uneditable by default", () => {
  const store = reducer(undefined as any, { type: "DUMMY_ACTION" });
  expect(fromReducer.getEditable(store)).toBe(false);
});

it("makes the projects editable when the edit tab is selected", () => {
  const store = reducer(undefined as any, selectTab("edit"));
  expect(fromReducer.getEditable(store)).toBe(true);
});

it("deselects all tabs by default", () => {
  const store = reducer(undefined as any, { type: "DUMMY_ACTION" });
  expect(fromReducer.getSelectedTab(store)).toBe(undefined);
});

it("updates the selectedTab state", () => {
  const store = reducer(undefined as any, selectTab("edit"));
  expect(fromReducer.getSelectedTab(store)).toBe("edit");
});

it("has no error message by default", () => {
  const store = reducer(undefined as any, { type: "DUMMY_ACTION" });
  expect(fromReducer.getErrorMessage(store)).toBe(undefined);
});
