// @flow

import React from "react";
import { flow } from "lodash";
import type { Dispatch } from "redux";
import { connect } from "react-redux";
import Header from "../Header";
import SideMenu from "../SideMenu";
import Card from "../Card";
import Legend from "../Legend";
import type { State } from "../../reducer";
import { getProjectIdsByMonth } from "../../reducer";
import { loadProjectJsonSuccess, loadProjectJsonFailure } from "../../actions";
import type { TabId } from "../../types";
import { importFile } from "../../import";
import { map, mapErr } from "../../result";
import "./App.css";

const importProject = (readFileAsText: (File) => Promise<string>, file: File) =>
  async (dispatch: Dispatch<*>) => {
    const asText = await readFileAsText(file);
    flow(
      importFile,
      map(fileData => dispatch(loadProjectJsonSuccess(fileData))),
      mapErr(errorMessage => dispatch(loadProjectJsonFailure(errorMessage)))
    )(asText);
  };

type AppProps = {
  projectsByMonth: { month: string, projectIds: string[] }[],
  errorMessage: ?(string | string[]),
  selectedTab: ?TabId,
  importFile: (File) => void
};

export function App(
  {
    projectsByMonth,
    errorMessage,
    selectedTab,
    importFile
  }: AppProps
) {
  const months = projectsByMonth.map(({ month, projectIds }) => {
    const cards = projectIds.map(projectId => (
      <div className="App-cardWrapper" key={projectId}>
        <Card projectId={projectId} />
      </div>
    ));
    return (
      <div key={month} className="App-month">
        <h2 className="App-monthTitle">{month}</h2>
        {cards}
      </div>
    );
  });

  const hasProjects = !!projectsByMonth.length;

  return (
    <div
      className="App"
      onDrop={e => handleDrop(importFile, e)}
      onDragOver={handleDragOver}
    >
      <div className="App-sideMenu">
        <SideMenu />
      </div>
      <div className="App-header">
        <Header />
      </div>
      <div className="App-content">
        {errorMessage != null ? formatErrors(errorMessage) : months}
      </div>
      {hasProjects &&
        errorMessage === undefined &&
        <div className="App-footer">
          <Legend />
        </div>}
    </div>
  );
}

export function mapStateToProps(state: State) {
  return {
    projectsByMonth: getProjectIdsByMonth(state)
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<*>,
  { readFileAsText }: { readFileAsText: (File) => Promise<string> }
) {
  return {
    importProject: (file: File) => dispatch(importProject(readFileAsText, file))
  };
}

const AppState = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppState;

function handleDragOver(e: Event) {
  e.preventDefault();
}

function handleDrop(importFile: (File) => void, e: DragEvent) {
  e.preventDefault();
  const dt = e.dataTransfer;
  if (dt && dt.items) {
    const item = Array.prototype.find.call(
      dt.items,
      ({ kind }) => kind === "file"
    );
    if (item) importFile(item.getAsFile());
  } else if (dt && dt.files.length) {
    importFile(dt.files[0]);
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
