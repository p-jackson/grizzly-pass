import React, { Component, PropTypes } from "react";
import { projects as demoProjects } from "./demo-data";
import App from "./App";

export default class AppState extends Component {
  static propTypes = {
    readFileAsText: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.state = {
      title: "Demo Dashboard",
      projects: demoProjects
    };
  }

  render() {
    const { title, projects } = this.state;
    return (
      <App title={title} projects={projects} onFileDrop={this.handleFileDrop} />
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
