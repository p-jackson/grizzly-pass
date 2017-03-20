import React, { PropTypes } from "react";
import moment from "moment";
import Header from "../Header";
import SideMenu from "../SideMenu";
import Card from "../Card";
import Legend from "../Legend";
import { statusIds } from "../../types";
import "./App.css";

export default function App({ onFileDrop, title = "", projects = [] }) {
  const months = splitIntoMonths(projects).map(({ month, projects }) => {
    const cards = projects.map(project => (
      <Card
        key={project.id}
        title={project.title}
        person={project.person}
        time={project.time}
        progress={project.progress}
        status={project.status}
        labels={project.labels}
      />
    ));
    return (
      <div key={month} className="App-month">
        <h2 className="App-monthTitle">{month}</h2>
        {cards}
      </div>
    );
  });

  const hasProjects = projects && projects.length;

  return (
    <div
      className="App"
      onDrop={e => handleDrop(onFileDrop, e)}
      onDragOver={handleDragOver}
    >
      <div className="App-sideMenu">
        <SideMenu />
      </div>
      <div className="App-header">
        <Header title={title} />
      </div>
      <div className="App-content">{months}</div>
      {hasProjects &&
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
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      person: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
      status: PropTypes.oneOf(statusIds).isRequired,
      labels: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          initial: PropTypes.string.isRequired,
          colour: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        })
      )
    })
  ),
  title: PropTypes.string
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
