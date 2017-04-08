// @flow

import React from "react";
import moment from "moment";
import Header from "../Header";
import SideMenu from "../SideMenu";
import Card from "../Card";
import Legend from "../Legend";
import type { ProjectWithLabelInfo, TabId } from "../../types";
import "./App.css";

type AppProps = {
  title: ?string,
  projects: ProjectWithLabelInfo[],
  errorMessage: ?(string | string[]),
  selectedTab: ?TabId,
  editable: boolean,
  onFileDrop: (File) => void,
  onTabChange: (?TabId) => void,
  onProjectsChange: (ProjectWithLabelInfo[]) => void
};

export default function App(
  {
    onFileDrop,
    title,
    projects,
    errorMessage,
    selectedTab,
    onTabChange,
    onProjectsChange,
    editable
  }: AppProps
) {
  function handleProjectChange(changedProject: ProjectWithLabelInfo) {
    const { id } = changedProject;
    const index = projects.findIndex(p => p.id === id);
    onProjectsChange([
      ...projects.slice(0, index),
      changedProject,
      ...projects.slice(index + 1)
    ]);
  }

  const months = splitIntoMonths(projects).map(({ month, projects }) => {
    const cards = projects.map(project => (
      <div className="App-cardWrapper" key={project.id}>
        <Card
          project={project}
          onProjectChange={handleProjectChange}
          readonly={!editable}
        />
      </div>
    ));
    return (
      <div key={month} className="App-month">
        <h2 className="App-monthTitle">{month}</h2>
        {cards}
      </div>
    );
  });

  const hasProjects = projects.length;

  return (
    <div
      className="App"
      onDrop={e => handleDrop(onFileDrop, e)}
      onDragOver={handleDragOver}
    >
      <div className="App-sideMenu">
        <SideMenu onTabChange={onTabChange} selectedTab={selectedTab} />
      </div>
      <div className="App-header">
        <Header title={title} />
      </div>
      <div className="App-content">
        {errorMessage != null ? formatErrors(errorMessage) : months}
      </div>
      {hasProjects &&
        errorMessage === undefined &&
        <div className="App-footer">
          <Legend projects={projects.map(({ labels }) => ({ labels }))} />
        </div>}
    </div>
  );
}

function splitIntoMonths(projects: ProjectWithLabelInfo[]) {
  const monthIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return monthIndexes
    .map(monthIndex =>
      projects.filter(project => moment(project.time).month() === monthIndex))
    .filter(month => month.length > 0)
    .map(month => ({
      month: moment(month[0].time).format("MMMM"),
      projects: month
    }));
}

function handleDragOver(e: Event) {
  e.preventDefault();
}

function handleDrop(onFileDrop: (File) => void, e: DragEvent) {
  e.preventDefault();
  const dt = e.dataTransfer;
  if (dt && dt.items) {
    const item = Array.prototype.find.call(
      dt.items,
      ({ kind }) => kind === "file"
    );
    if (item) onFileDrop(item.getAsFile());
  } else if (dt && dt.files.length) {
    onFileDrop(dt.files[0]);
  }
}

function formatErrors(errorMessage: string | string[]) {
  if (typeof errorMessage === "string") return errorMessage;

  return (
    <ul>
      {errorMessage.map((message, i) => <li key={i}>{message}</li>)}
    </ul>
  );
}
