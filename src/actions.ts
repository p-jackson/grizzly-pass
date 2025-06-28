import { uniqueId } from "lodash";
import type { Project, Label, Status, TabId } from "./types";

export interface LoadDemoData {
  type: "LOAD_DEMO_DATA";
}
export const loadDemoData = (): LoadDemoData => ({
  type: "LOAD_DEMO_DATA",
});

export interface LoadProjectJsonSuccess {
  type: "LOAD_PROJECT_JSON_SUCCESS";
  data: {
    title?: string;
    projects: Project[];
    labels: Label[];
  };
}
export const loadProjectJsonSuccess = (data: {
  title?: string;
  projects: Project[];
  labels: Label[];
}): LoadProjectJsonSuccess => ({
  type: "LOAD_PROJECT_JSON_SUCCESS",
  data,
});

export interface LoadProjectJsonFailure {
  type: "LOAD_PROJECT_JSON_FAILURE";
  errorMessage: string | string[];
}
export const loadProjectJsonFailure = (
  errorMessage: string | string[],
): LoadProjectJsonFailure => ({
  type: "LOAD_PROJECT_JSON_FAILURE",
  errorMessage,
});

export interface LoadProject {
  type: "LOAD_PROJECT";
  project: Project;
}
export const loadProject = (
  title: string,
  person: string,
  time: string,
  progress: number,
  status: Status,
  labels: string[],
): LoadProject => ({
  type: "LOAD_PROJECT",
  project: {
    id: uniqueId(),
    title,
    person,
    time,
    progress,
    status,
    labels,
  },
});

export interface LoadLabel {
  type: "LOAD_LABEL";
  label: Label;
}
export const loadLabel = (title: string): LoadLabel => ({
  type: "LOAD_LABEL",
  label: {
    id: uniqueId(),
    title,
  },
});

export interface UpdateProject {
  type: "UPDATE_PROJECT";
  project: Project;
}
export const updateProject = (project: Project): UpdateProject => ({
  type: "UPDATE_PROJECT",
  project,
});

export interface SelectTab {
  type: "SELECT_TAB";
  tabId?: TabId;
}
export const selectTab = (tabId?: TabId): SelectTab => ({
  type: "SELECT_TAB",
  tabId,
});

export type Action =
  | LoadDemoData
  | LoadProjectJsonSuccess
  | LoadProjectJsonFailure
  | LoadProject
  | LoadLabel
  | UpdateProject
  | SelectTab;
