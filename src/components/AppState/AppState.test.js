import React from "react";
import { shallow } from "enzyme";
import omit from "lodash/omit";
import AppState from "../AppState";
import {
  projects as demoProjects,
  labels as demoLabels
} from "../../demo-data";
import { tabIds } from "../../types";
import App from "../App";

const jsonFile = [
  {
    id: "1",
    title: "Coffee Swirl",
    person: "Joe Lemon",
    date: "2017-03-15",
    progress: 13,
    health: "ontrack"
  },
  {
    id: "2",
    title: "Coffee Swirl",
    person: "Joe Lemon",
    date: "2017-03-15",
    progress: 13,
    health: "ontrack",
    tags: ["Apple"]
  }
];

function renderAppState(file = jsonFile) {
  const readFileAsText = jest.fn(() => JSON.stringify(jsonFile));
  return shallow(<AppState db={() => {}} readFileAsText={readFileAsText} />);
}

const db = jest.fn();
const readFileAsText = jest.fn(() => JSON.stringify(jsonFile));
const appState = shallow(<AppState db={db} readFileAsText={readFileAsText} />);

it("uses the demo data as it's default projects state", () => {
  expect(appState.state("title")).toBe("Demo Dashboard");
  expect(appState.state("projects")).toMatchSnapshot();
  expect(appState.state("labels")).toMatchSnapshot();
});

it("has no error message by default", () => {
  expect(appState.state("errorMessage")).toBeFalsy();
});

it("passes the projects (with embedded label info) to it's child <App />", () => {
  appState.setState({
    projects: demoProjects,
    labels: demoLabels
  });
  expect(appState.find(App).prop("projects")).toEqual([
    {
      id: "1",
      title: "Coffee Swirl",
      person: "Joe Lemon",
      time: "2017-03-15T10:54:04.445Z",
      progress: 13,
      status: "ontrack",
      labels: [
        {
          id: "3",
          initial: "A",
          colour: "#EF5350",
          title: "Apple"
        }
      ]
    },
    {
      id: "2",
      title: "Rake Twister",
      person: "Alex Apple",
      time: "2017-04-12T10:54:04.445Z",
      progress: 50,
      status: "onhold",
      labels: [
        {
          id: "3",
          initial: "A",
          colour: "#EF5350",
          title: "Apple"
        },
        {
          id: "4",
          initial: "O",
          colour: "#7E57C2",
          title: "Orange"
        }
      ]
    }
  ]);
});

it("passes no label info with projects (if there's no labels) to it's child <App />", () => {
  appState.setState({
    projects: demoProjects.map(project => omit(project, "labels"))
  });
  expect(appState.find(App).prop("projects")).toEqual([
    {
      id: "1",
      title: "Coffee Swirl",
      person: "Joe Lemon",
      time: "2017-03-15T10:54:04.445Z",
      progress: 13,
      status: "ontrack"
    },
    {
      id: "2",
      title: "Rake Twister",
      person: "Alex Apple",
      time: "2017-04-12T10:54:04.445Z",
      progress: 50,
      status: "onhold"
    }
  ]);
});

it("passes the title state to it's child <App />", () => {
  const title = appState.state("title");
  expect(appState.find(App).prop("title")).toBe(title);
});

it("passess the errorMessage state to it's child <App />", () => {
  appState.setState({ errorMessage: "Error message" });
  expect(appState.find(App).prop("errorMessage")).toBe("Error message");
});

it("defaults to no tabs selected", () => {
  const appState = renderAppState();
  expect(appState.find(App).prop("selectedTab")).toBe(null);
});

it("passes the selectedTab state to it's child <App />", () => {
  const appState = renderAppState();
  appState.setState({ selectedTab: tabIds[0] });
  expect(appState.find(App).prop("selectedTab")).toBe(tabIds[0]);
});

it("updates the selectedTab state", () => {
  const appState = renderAppState();
  expect(appState.find(App).prop("selectedTab")).not.toBe(tabIds[0]);
  appState.instance().handleTabChange(tabIds[0]);
  expect(appState.find(App).prop("selectedTab")).toBe(tabIds[0]);
});

it("updates the projects state if the dropped file is json", async function() {
  const mockFile = { MOCK: "FILE" };
  await appState.instance().handleFileDrop(mockFile);
  expect(readFileAsText).toHaveBeenCalledWith(mockFile);
  expect(appState.state("errorMessage")).toBeFalsy();
  expect(appState.state("title")).toBe(null);
  expect(appState.state("projects").length).toEqual(2);
  expect(appState.state("labels").length).toBe(1);
});

it("sets the errorMessage state if the dropped file is invalid", async function() {
  const mockFile = { MOCK: "FILE" };
  readFileAsText.mockImplementationOnce(() =>
    JSON.stringify("this is not a projects file"));
  await appState.instance().handleFileDrop(mockFile);
  expect(readFileAsText).toHaveBeenCalledWith(mockFile);
  expect(appState.state("errorMessage")).toMatchSnapshot();
});
