// @flow

import type { Project, TabId } from "../../types";
import { App, mapStateToProps } from "../App";
import Card from "../Card";
import Header from "../Header";
import Legend from "../Legend";
import React from "react";
import { shallow } from "enzyme";
import reducer from "../../reducer";

const projectsByMonth: { month: string, projectIds: string[] }[] = [
  {
    month: "March",
    projectIds: ["1"]
  },
  {
    month: "April",
    projectIds: ["2"]
  }
];

function renderApp(
  {
    title,
    projectsByMonth = [],
    importFile = jest.fn(),
    errorMessage,
    selectedTab,
    selectTab = jest.fn(),
    updateProject = jest.fn()
  }: {
    title?: string,
    projectsByMonth?: { month: string, projectIds: string[] }[],
    importFile?: (File) => void,
    errorMessage?: string | string[],
    selectedTab?: TabId,
    selectTab?: (?TabId) => void,
    updateProject?: (Project) => void
  } = {}
) {
  return shallow(
    <App
      projectsByMonth={projectsByMonth}
      title={title}
      importFile={importFile}
      selectTab={selectTab}
      errorMessage={errorMessage}
      selectedTab={selectedTab}
      updateProject={updateProject}
    />
  );
}

const defaultApp = renderApp();

it("shows a header", () => {
  expect(defaultApp.find(Header).length).toBe(1);
});

it("shows a <Legend /> when there are projects", () => {
  const app = renderApp({ projectsByMonth });
  expect(app.find(Legend).length).toBe(1);
});

it("doesn't show a <Legend /> when there are no projects", () => {
  const app = renderApp();
  expect(app.find(Legend).length).toBe(0);
});

it("contains no cards when passed no projects", () => {
  expect(defaultApp.find(Card).length).toBe(0);
});

it("shows a card for each project passed in", () => {
  const app = renderApp({ projectsByMonth });
  const projectIds = projectsByMonth.reduce(
    (memo, { projectIds }) => [...memo, ...projectIds],
    []
  );
  expect(app.find(Card).length).toBe(projectIds.length);
});

it("passes the project id to the <Card />", () => {
  const app = renderApp({ projectsByMonth: projectsByMonth.slice(0, 1) });
  expect(app.find(Card).props()).toEqual({ projectId: "1" });
});

it("splits months into different divs", () => {
  const app = renderApp({ projectsByMonth });
  const monthColumns = app.find(".App-month");
  expect(monthColumns.length).toBe(2);
  expect(monthColumns.at(0).find(Card).length).toBe(1);
  expect(monthColumns.at(1).find(Card).length).toBe(1);
});

it("renders month names at the top of the columns", () => {
  const app = renderApp({ projectsByMonth });
  const monthColumns = app.find(".App-month .App-monthTitle");
  expect(monthColumns.at(0).text()).toBe("March");
  expect(monthColumns.at(1).text()).toBe("April");
});

it("prevents default event handling on dragover", () => {
  const preventDefault = jest.fn();
  defaultApp.simulate("dragover", { preventDefault });
  expect(preventDefault).toHaveBeenCalled();
});

it("prevents default event handling on drop", () => {
  const preventDefault = jest.fn();
  defaultApp.simulate("drop", { preventDefault, dataTransfer: { files: [] } });
  expect(preventDefault).toHaveBeenCalled();
});

it("calls drop handler when browser support the DataTransferItemList interface", () => {
  const mockFile = { MOCK: "FILE" };
  const importFile = jest.fn();
  const app = renderApp({ importFile });
  app.simulate("drop", {
    preventDefault: () => {},
    dataTransfer: {
      items: [{ kind: "file", getAsFile: () => mockFile }]
    }
  });
  expect(importFile).toHaveBeenCalledWith(mockFile);
});

it("calls drop handler when browser support the DataTransfer interface", () => {
  const mockFile = { MOCK: "FILE" };
  const importFile = jest.fn();
  const app = renderApp({ importFile });
  app.simulate("drop", {
    preventDefault: () => {},
    dataTransfer: {
      files: [mockFile]
    }
  });
  expect(importFile).toHaveBeenCalledWith(mockFile);
});

it("doesn't call drop handler it wasn't a file that was dropped", () => {
  const handleFileDrop = jest.fn();
  const app = renderApp({ handleFileDrop });
  app.simulate("drop", {
    preventDefault: () => {},
    dataTransfer: {
      items: [{ kind: "string", getAsFile: () => {} }]
    }
  });
  expect(handleFileDrop).not.toHaveBeenCalled();
});

it("displays errorMessage if it's passed as a prop", () => {
  const app = renderApp({ errorMessage: "Error Name" });
  expect(app.find(".App-content").text()).toEqual("Error Name");
});

it("displays errors as a list if errorMessage prop is an array", () => {
  const errorMessage = ["Error 1", "Error 2"];
  const app = renderApp({ errorMessage });
  expect(app.find(".App-content li").length).toBe(2);
  expect(app.find(".App-content li").at(0).text()).toBe("Error 1");
  expect(app.find(".App-content li").at(1).text()).toBe("Error 2");
});

it("can map default state to props", () => {
  const state = reducer(undefined, {});
  expect(mapStateToProps(state)).toMatchSnapshot();
});
