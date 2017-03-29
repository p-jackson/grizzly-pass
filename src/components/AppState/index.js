import React, { Component, PropTypes } from "react";
import {
  projects as demoProjects,
  labels as demoLabels
} from "../../demo-data";
import { generateLabelInfo } from "../../labels";
import { importFile } from "../../import";
import { Ok } from "../../result";
import App from "../App";

export default class AppState extends Component {
  static propTypes = {
    db: PropTypes.func.isRequired,
    readFileAsText: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      title: "Demo Dashboard",
      projects: demoProjects,
      labels: demoLabels,
      errorMessage: null,
      selectedTab: null
    };
  }

  render() {
    const { title, projects, labels, errorMessage, selectedTab } = this.state;

    const labelInfo = generateLabelInfo(labels);
    const projectsWithLabels = projects.map(project => ({
      ...project,
      ...(!project.labels ? {} : { labels: getLabelInfo(labelInfo, project) })
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

  async handleFileDrop(file) {
    const asText = await this.props.readFileAsText(file);
    importFile(asText)
      .map(fileData => ({ ...fileData, errorMessage: null }))
      .orElse(errorMessage => Ok({ errorMessage }))
      .map(stateChange => this.setState(stateChange));
  }

  handleTabChange(selectedTab) {
    this.setState({ selectedTab });
  }
}

function getLabelInfo(labelInfo, project) {
  return project.labels.map(labelId => labelInfo[labelId]);
}
