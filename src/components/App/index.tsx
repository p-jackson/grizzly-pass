import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { loadProjectJsonSuccess, loadProjectJsonFailure } from "../../actions";
import { importFile } from "../../import";
import { getProjectIdsByMonth, State } from "../../reducer";
import { TabId, Project } from "../../types";
import Card from "../Card";
import Header from "../Header";
import Legend from "../Legend";
import SideMenu from "../SideMenu";
import "./App.css";

const importProject = (
  readFileAsText: (file: File) => Promise<string>,
  file: File
) => async (dispatch: Dispatch<State>) => {
  const asText = await readFileAsText(file);
  importFile(asText)
    .map(fileData => dispatch(loadProjectJsonSuccess(fileData)))
    .mapErr(errorMessage => dispatch(loadProjectJsonFailure(errorMessage)));
};

interface OwnProps {
  readFileAsText: (file: File) => Promise<string>;
}

interface AppProps {
  title?: string;
  errorMessage?: string | string[];
  selectedTab?: TabId;
  projectsByMonth: { month: string; projectIds: string[] }[];
  updateProject: (project: Project) => void;
  importFile: (file: File) => void;
  selectTab: (tabId?: TabId) => void;
}

export function AppPresentation({
  projectsByMonth,
  errorMessage,
  selectedTab,
  importFile
}: AppProps) {
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
      errorMessage === undefined && (
        <div className="App-footer">
          <Legend />
        </div>
      )}
    </div>
  );
}

export function mapStateToProps(
  state: State,
  ownProps: OwnProps
): Partial<AppProps> {
  return {
    projectsByMonth: getProjectIdsByMonth(state)
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<State>,
  { readFileAsText }: OwnProps
): Partial<AppProps> {
  return {
    importFile: (file: File) => dispatch(importProject(readFileAsText, file))
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppPresentation);
export default App;

function handleDragOver(e: React.SyntheticEvent<HTMLElement>) {
  e.preventDefault();
}

function handleDrop(
  importFile: (file: File) => void,
  e: React.DragEvent<HTMLElement>
) {
  e.preventDefault();
  const dt = e.dataTransfer;
  if (dt && dt.items) {
    const item = Array.prototype.find.call(
      dt.items,
      ({ kind }: DataTransferItem) => kind === "file"
    );
    if (item) importFile(item.getAsFile());
  } else if (dt && dt.files.length) {
    importFile(dt.files[0]);
  }
}

function formatErrors(errorMessage: string | string[]) {
  if (typeof errorMessage === "string") return errorMessage;

  return (
    <ul>{errorMessage.map((message, i) => <li key={i}>{message}</li>)}</ul>
  );
}
