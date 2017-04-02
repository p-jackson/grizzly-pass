import React, { PropTypes } from "react";
import moment from "moment";
import Header from "../Header";
import SideMenu from "../SideMenu";
import Card from "../Card";
import Legend from "../Legend";
import { tabIds, projectShape, labelInfoShape } from "../../types";
import "./App.css";

export default function App(
  {
    onFileDrop,
    title = "",
    projects = [],
    errorMessage,
    selectedTab,
    onTabChange
  }
) {
  const months = splitIntoMonths(projects).map(({ month, projects }) => {
    const cards = projects.map(project => (
      <div className="App-cardWrapper" key={project.id}>
        <Card project={project} onProjectChange={() => {}} />
      </div>
    ));
    return (
      <div key={month} className="App-month">
        <h2 className="App-monthTitle">{month}</h2>
        {cards}
      </div>
    );
  });

  const hasProjects = projects && projects.length;
  const noErrors = !errorMessage;

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
        {noErrors ? months : formatErrors(errorMessage)}
      </div>
      {hasProjects &&
        noErrors &&
        <div className="App-footer">
          <Legend projects={projects} />
        </div>}
    </div>
  );
}

App.propTypes = {
  onFileDrop: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      ...projectShape,
      labels: PropTypes.arrayOf(PropTypes.shape(labelInfoShape))
    })
  ),
  title: PropTypes.string,
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  onTabChange: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOf(tabIds)
};

function splitIntoMonths(projects) {
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

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(onFileDrop, e) {
  e.preventDefault();
  const dt = e.dataTransfer;
  if (dt.items) {
    const item = Array.prototype.find.call(
      dt.items,
      ({ kind }) => kind === "file"
    );
    if (item) onFileDrop(item.getAsFile());
  } else if (dt.files.length) {
    onFileDrop(dt.files[0]);
  }
}

function formatErrors(errorMessage) {
  if (typeof errorMessage === "string") return errorMessage;

  return (
    <ul>
      {errorMessage.map((message, i) => <li key={i}>{message}</li>)}
    </ul>
  );
}
