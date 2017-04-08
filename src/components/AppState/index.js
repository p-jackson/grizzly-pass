// @flow

import type {
  Project,
  Label,
  LabelInfo,
  TabId,
  ProjectWithLabelInfo
} from "../../types";
import flow from "lodash/flow";
import React, { Component } from "react";
import {
  projects as demoProjects,
  labels as demoLabels
} from "../../demo-data";
import { generateLabelInfo } from "../../labels";
import { importFile } from "../../import";
import { ok, map, orElse } from "../../result";
import App from "../App";

type AppStateProps = {
  db: () => IDBDatabase,
  readFileAsText: (File) => Promise<string>
};

type AppStateState = {
  title: ?string,
  projects: Project[],
  labels: Label[],
  errorMessage: ?(string | string[]),
  selectedTab: ?TabId
};

export default class AppState
  extends Component<void, AppStateProps, AppStateState> {
  handleFileDrop: (File) => void;
  handleTabChange: (?TabId) => void;
  handleProjectsChange: (ProjectWithLabelInfo[]) => void;

  state = {
    title: "Demo Dashboard",
    projects: demoProjects,
    labels: demoLabels,
    errorMessage: null,
    selectedTab: null
  };

  constructor(props: AppStateProps) {
    super(props);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleProjectsChange = this.handleProjectsChange.bind(this);
  }

  render() {
    const { title, projects, labels, errorMessage, selectedTab } = this.state;

    const labelInfo = generateLabelInfo(labels);
    const projectsWithLabels = projects.map(project => ({
      id: project.id,
      title: project.title,
      person: project.person,
      time: project.time,
      progress: project.progress,
      status: project.status,
      labels: getLabelInfo(labelInfo, project)
    }));

    return (
      <App
        title={title}
        projects={projectsWithLabels}
        errorMessage={errorMessage}
        selectedTab={selectedTab}
        onFileDrop={this.handleFileDrop}
        onTabChange={this.handleTabChange}
        onProjectsChange={this.handleProjectsChange}
        editable={selectedTab === "edit"}
      />
    );
  }

  async handleFileDrop(file: File) {
    const asText = await this.props.readFileAsText(file);
    flow(
      importFile,
      map(fileData => ({ ...fileData, errorMessage: null })),
      orElse(errorMessage => ok({ errorMessage })),
      map(stateChange => this.setState(stateChange))
    )(asText);
  }

  handleTabChange(selectedTab: ?TabId) {
    this.setState({ selectedTab });
  }

  handleProjectsChange(projects: ProjectWithLabelInfo[]) {
    this.setState({
      projects: projects.map(project => ({
        id: project.id,
        title: project.title,
        person: project.person,
        time: project.time,
        progress: project.progress,
        status: project.status,
        labels: project.labels.map(({ id }) => id)
      }))
    });
  }
}

function getLabelInfo(
  labelInfo: { [string]: LabelInfo },
  project: Project
): LabelInfo[] {
  return project.labels.map(labelId => labelInfo[labelId]);
}
