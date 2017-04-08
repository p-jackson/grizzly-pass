// @flow

import type { ProjectWithLabelInfo, TabId } from "../../types";
import App from "../App";
import Card from "../Card";
import Header from "../Header";
import Legend from "../Legend";
import React from "react";
import SideMenu from "../SideMenu";
import { shallow } from "enzyme";

const projects = [
  {
    id: "1",
    title: "Coffee Swirl",
    person: "Joe Lemon",
    time: "2017-03-15T10:54:04.445Z",
    progress: 13,
    status: "ontrack",
    labels: []
  },
  {
    id: "2",
    title: "Rake Twister",
    person: "Alex Apple",
    time: "2017-04-12T10:54:04.445Z",
    progress: 50,
    status: "onhold",
    labels: [{ id: "13", initial: "A", colour: "#ff0", title: "Apple" }]
  }
];

function renderApp(
  {
    title,
    projects = [],
    handleFileDrop = jest.fn(),
    errorMessage,
    selectedTab,
    handleTabChange = jest.fn(),
    handleProjectsChange = jest.fn(),
    editable = false
  }: {
    title?: string,
    projects?: ProjectWithLabelInfo[],
    handleFileDrop?: (File) => void,
    errorMessage?: string | string[],
    selectedTab?: TabId,
    handleTabChange?: (?TabId) => void,
    handleProjectsChange?: (ProjectWithLabelInfo[]) => void,
    editable?: boolean
  } = {}
) {
  return shallow(
    <App
      projects={projects}
      title={title}
      onFileDrop={handleFileDrop}
      onTabChange={handleTabChange}
      errorMessage={errorMessage}
      selectedTab={selectedTab}
      onProjectsChange={handleProjectsChange}
      editable={editable}
    />
  );
}

const defaultApp = renderApp();

it("shows a header", () => {
  expect(defaultApp.find(Header).length).toBe(1);
});

it("passes the dummy document title to the header", () => {
  const app = renderApp({ title: "Dummy Projects 2020" });
  expect(app.find(Header).prop("title")).toBe("Dummy Projects 2020");
});

it("shows no legend when there are no projects", () => {
  expect(defaultApp.find(Legend).length).toBe(0);
});

it("strips non-label info from `projects` prop before passing it to <Legend />", () => {
  const app = renderApp({ projects });
  expect(app.find(Legend).props()).toEqual({
    projects: projects.map(({ labels }) => ({ labels }))
  });
});

it("contains no cards when passed no projects", () => {
  expect(defaultApp.find(Card).length).toBe(0);
});

it("shows a card for each project passed in", () => {
  const app = renderApp({ projects });
  expect(app.find(Card).length).toBe(projects.length);
});

it("passes project props to the <Card />", () => {
  const app = renderApp({ projects: projects.slice(0, 1) });
  expect(app.find(Card).props()).toMatchObject({
    project: {
      title: "Coffee Swirl",
      person: "Joe Lemon",
      time: "2017-03-15T10:54:04.445Z",
      progress: 13,
      status: "ontrack"
    }
  });
});

it("makes cards readonly if app isn't editable", () => {
  const app = renderApp({ projects: projects.slice(0, 1), editable: false });
  expect(app.find(Card).props()).toMatchObject({ readonly: true });
});

it("makes cards not readonly if app is editable", () => {
  const app = renderApp({ projects: projects.slice(0, 1), editable: true });
  expect(app.find(Card).props()).toMatchObject({ readonly: false });
});

it("passes labels prop to the <Card /> if it exists", () => {
  const app = renderApp({ projects: projects.slice(1, 2) });
  expect(app.find(Card).props()).toMatchObject({
    project: {
      title: "Rake Twister",
      person: "Alex Apple",
      time: "2017-04-12T10:54:04.445Z",
      progress: 50,
      status: "onhold",
      labels: [{ id: "13", initial: "A", colour: "#ff0" }]
    }
  });
});

it("splits projects into months", () => {
  const app = renderApp({ projects });
  const monthColumns = app.find(".App-month");
  expect(monthColumns.length).toBe(2);
  expect(monthColumns.at(0).find(Card).length).toBe(1);
  expect(monthColumns.at(1).find(Card).length).toBe(1);
});

it("renders month names at the top of the columns", () => {
  const app = renderApp({ projects });
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
  const handleFileDrop = jest.fn();
  const app = renderApp({ handleFileDrop });
  app.simulate("drop", {
    preventDefault: () => {},
    dataTransfer: {
      items: [{ kind: "file", getAsFile: () => mockFile }]
    }
  });
  expect(handleFileDrop).toHaveBeenCalledWith(mockFile);
});

it("calls drop handler when browser support the DataTransfer interface", () => {
  const mockFile = { MOCK: "FILE" };
  const handleFileDrop = jest.fn();
  const app = renderApp({ handleFileDrop });
  app.simulate("drop", {
    preventDefault: () => {},
    dataTransfer: {
      files: [mockFile]
    }
  });
  expect(handleFileDrop).toHaveBeenCalledWith(mockFile);
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

it("passes the selectedTab to the <SideMenu />", () => {
  const app = renderApp({ selectedTab: "edit" });
  expect(app.find(SideMenu).prop("selectedTab")).toBe("edit");
});

it("calls projects change handler when only card is edited", () => {
  const handleProjectsChange = jest.fn();
  const app = renderApp({
    projects: projects.slice(0, 1),
    handleProjectsChange
  });
  const projectChanger = app.find(Card).prop("onProjectChange");
  projectChanger({
    ...projects[0],
    title: "New Title"
  });
  expect(handleProjectsChange).toHaveBeenCalledWith([
    {
      ...projects[0],
      title: "New Title"
    }
  ]);
});

it("calls projects change handler when one of many cards is edited", () => {
  const handleProjectsChange = jest.fn();
  const app = renderApp({ projects, handleProjectsChange });
  const projectChanger = app.find(Card).first().prop("onProjectChange");
  projectChanger({
    ...projects[1],
    title: "New Title"
  });
  expect(handleProjectsChange).toHaveBeenCalledWith([
    projects[0],
    {
      ...projects[1],
      title: "New Title"
    }
  ]);
});
