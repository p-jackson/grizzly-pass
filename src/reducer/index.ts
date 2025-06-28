import moment from "moment";
import { combineReducers } from "redux";
import type { Action } from "../actions";
import { projects as demoProjects, labels as demoLabels } from "../demo-data";
import { generateLabelInfo } from "../labels";
import type { Label, Project, LabelInfo, TabId } from "../types";

export type { Label, Project };

export interface State {
  readonly title: string | null;
  readonly selectedTab: TabId | null;
  readonly projects: Project[];
  readonly labels: Label[];
  readonly errorMessage: string | string[] | null;
}

const reducer = combineReducers<State>({
  title,
  selectedTab,
  projects,
  labels,
  errorMessage,
});
export default reducer;

function title(title: string | null = null, action: Action): string | null {
  if (action.type === "LOAD_DEMO_DATA") return "Demo Dashboard";
  else return title;
}

function selectedTab(
  selectedTab: TabId | null = null,
  action: Action,
): TabId | null {
  if (action.type === "SELECT_TAB")
    return action.tabId === undefined ? null : action.tabId;
  return selectedTab;
}

function projects(projects: Project[] = [], action: Action): Project[] {
  switch (action.type) {
    case "LOAD_DEMO_DATA":
      return demoProjects;

    case "LOAD_PROJECT":
      return [...projects, action.project];

    case "UPDATE_PROJECT": {
      const project = action.project;
      const index = projects.findIndex(({ id }) => id === project.id);
      if (index === -1) return projects;
      else
        return [
          ...projects.slice(0, index),
          action.project,
          ...projects.slice(index + 1),
        ];
    }

    default:
      return projects;
  }
}

function labels(labels: Label[] = [], action: Action): Label[] {
  switch (action.type) {
    case "LOAD_DEMO_DATA":
      return demoLabels;
    case "LOAD_LABEL":
      return [...labels, action.label];
    default:
      return labels;
  }
}

function errorMessage(
  errorMessage: string | string[] | null = null,
): string | string[] | null {
  return errorMessage;
}

export function getTitle(state: State): string | undefined {
  return state.title === null ? undefined : state.title;
}

export function getProject(state: State, id: string): Project | undefined {
  return state.projects.find((project) => project.id === id);
}

export function getUsedLabels(state: State): string[] {
  const allLabelIds = state.projects.reduce(
    (memo, project) => [...memo, ...project.labels],
    [] as string[],
  );
  return state.labels
    .filter((label) => allLabelIds.indexOf(label.id) !== -1)
    .map((label) => label.id);
}

export function getLabelInfo(state: State, id: string): LabelInfo {
  return generateLabelInfo(state.labels)[id];
}

export function getProjectIdsByMonth(
  state: State,
): { month: string; projectIds: string[] }[] {
  const monthIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return monthIndexes
    .map((monthIndex) =>
      state.projects.filter(
        (project) => moment(project.time).month() === monthIndex,
      ),
    )
    .filter((month) => month.length > 0)
    .map((month) => ({
      month: moment(month[0].time).format("MMMM"),
      projectIds: month.map((project) => project.id),
    }));
}

export function getErrorMessage(state: State): string | string[] | undefined {
  return state.errorMessage === null ? undefined : state.errorMessage;
}

export function getSelectedTab(state: State): TabId | undefined {
  return state.selectedTab === null ? undefined : state.selectedTab;
}

export function getEditable(state: State): boolean {
  return state.selectedTab === "edit";
}
