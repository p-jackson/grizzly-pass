import * as React from "react";
import * as moment from "moment";
import Header from "../Header";
import SideMenu from "../SideMenu";
import Card from "../Card";
import Legend from "../Legend";
import { TabId, Status, statusIds, tabIds } from "../../types";
import "./App.css";

interface Project {
  id: string;
  title: string;
  person: string;
  time: string;
  progress: number;
  status: Status;
  labels?: {
    id: string;
    initial: string;
    colour: string;
    title: string;
  }[];
}

export interface AppProps {
  onFileDrop: (file: File) => void;
  title?: string;
  selectedTab?: TabId;
  onTabChange: (tabId: TabId) => void;
  errorMessage?: string | string[];
  projects?: Project[];
}

export default function App(
  {
    onFileDrop,
    title = "",
    projects = [],
    errorMessage,
    selectedTab,
    onTabChange
  }: AppProps
) {
  const months = splitIntoMonths(projects).map(({ month, projects }) => {
    const cards = projects.map(project => (
      <div className="App-cardWrapper" key={project.id}>
        <Card
          title={project.title}
          person={project.person}
          time={project.time}
          progress={project.progress}
          status={project.status}
          labels={project.labels}
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

  const hasProjects = projects && projects.length;

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
        {errorMessage === undefined ? months : formatErrors(errorMessage)}
      </div>
      {hasProjects &&
        errorMessage === undefined &&
        <div className="App-footer">
          <Legend projects={projects} />
        </div>}
    </div>
  );
}

function splitIntoMonths(projects: Project[]) {
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

function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault();
}

function handleDrop(onFileDrop: (file: File) => void, e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault();
  const dt = e.dataTransfer;
  if (dt.items) {
    const item = Array.prototype.find.call(
      dt.items,
      ({ kind }: DataTransferItem) => kind === "file"
    );
    if (item) onFileDrop(item.getAsFile());
  } else if (dt.files.length) {
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
