import * as React from "react";
import {
  projects as demoProjects,
  labels as demoLabels
} from "../../demo-data";
import { generateLabelInfo } from "../../labels";
import { importFile } from "../../import";
import { Ok } from "../../result";
import { TabId, Status } from "../../types";
import App from "../App";
import { isArray, omit } from "lodash";

interface AppStateProps {
  db: () => IDBDatabase;
  readFileAsText: (file: File) => Promise<string>;
}

interface State {
  title?: string;
  projects: {
    id: string;
    title: string;
    person: string;
    time: string;
    progress: number;
    status: Status;
    labels?: string[]
  }[];
  labels: { title: string; id: string; }[];
  errorMessage?: string | string[];
  selectedTab?: TabId;
};

export default class AppState extends React.Component<AppStateProps, State> {
  constructor(props: AppStateProps) {
    super(props);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      title: "Demo Dashboard",
      projects: demoProjects,
      labels: demoLabels,
    };
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
      labels: getLabelInfo(labelInfo, project.labels)
    }));

    return (
      <App
        title={title}
        projects={projectsWithLabels}
        errorMessage={errorMessage}
        selectedTab={selectedTab}
        onFileDrop={this.handleFileDrop}
        onTabChange={this.handleTabChange}
      />
    );
  }

  async handleFileDrop(file: File) {
    const asText = await this.props.readFileAsText(file);
    importFile(asText)
      .map(fileData => ({ ...fileData, errorMessage: undefined }))
      .orElse(errorMessage => Ok({ errorMessage }))
      .map(stateChange => (this.setState as any)(stateChange));
  }

  handleTabChange(selectedTab: TabId | null) {
    this.setState({ selectedTab: selectedTab === null ? undefined : selectedTab });
  }
}

function getLabelInfo(
  labelInfo: Record<string, { id: string; initial: string; colour: string; title: string; }>,
  labels?: string[]
): { id: string; initial: string; colour: string; title: string; }[] | undefined {
  if (isArray(labels))
    return labels.map(labelId => labelInfo[labelId]);
  else
    return undefined;
}
