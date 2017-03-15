import React, { PropTypes } from "react";
import moment from "moment";
import Header from "./Header";
import SideMenu from "./SideMenu";
import Card from "./Card";
import { ProjectShape } from "./types";
import "./App.css";

export default function App({ projects = [] }) {
  const months = splitIntoMonths(projects).map(({ month, projects }) => {
    const cards = projects.map(project => (
      <Card
        key={project.id}
        title={project.title}
        person={project.person}
        time={project.time}
        progress={project.progress}
        status={project.status}
      />
    ));
    return (
      <div key={month} className="App-month">
        <h2 className="App-monthTitle">{month}</h2>
        {cards}
      </div>
    );
  });

  return (
    <div className="App">
      <div className="App-sideMenu">
        <SideMenu />
      </div>
      <div className="App-header">
        <Header title="Dummy Projects 2017" />
      </div>
      <div className="App-content">{months}</div>
    </div>
  );
}

App.propTypes = {
  projects: PropTypes.arrayOf(ProjectShape)
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
