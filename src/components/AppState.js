import React, { Component, PropTypes } from "react";
import { projects as demoProjects, labels as demoLabels } from "../demo-data";
import { generateLabelInfo } from "../label-utils";
import App from "./App";

export default class AppState extends Component {
  static propTypes = {
    db: PropTypes.func.isRequired,
    readFileAsText: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.state = {
      title: "Demo Dashboard",
      projects: demoProjects,
      labels: demoLabels
    };
  }

  render() {
    const { title, projects, labels } = this.state;

    const labelInfo = generateLabelInfo(labels);
    const projectsWithLabels = projects.map(project => ({
      ...project,
      ...(!project.labels ? {} : { labels: getLabelInfo(labelInfo, project) })
    }));

    return (
      <App
        title={title}
        projects={projectsWithLabels}
        onFileDrop={this.handleFileDrop}
      />
    );
  }

  async handleFileDrop(file) {
    const asText = await this.props.readFileAsText(file);
    const { title, projects } = JSON.parse(asText);
    this.setState({
      projects,
      title
    });
  }
}

function getLabelInfo(labelInfo, project) {
  return project.labels.map(labelId => labelInfo[labelId]);
}
