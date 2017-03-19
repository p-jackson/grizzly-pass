import React from "react";
import { shallow } from "enzyme";
import AppState from "./AppState";
import App from "./App";

const jsonFile = {
  title: "Mock Title",
  projects: [
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
      title: "Coffee Swirl",
      person: "Joe Lemon",
      time: "2017-03-15T10:54:04.445Z",
      progress: 13,
      status: "ontrack",
      labels: ["3"]
    }
  ],
  labels: [
    {
      id: "3",
      title: "Apple"
    }
  ]
};

const db = jest.fn();
const readFileAsText = jest.fn(() => JSON.stringify(jsonFile));
const appState = shallow(<AppState db={db} readFileAsText={readFileAsText} />);

it("uses the demo data as it's default projects state", () => {
  expect(appState.state("title")).toBe("Demo Dashboard");
  expect(appState.state("projects")).toMatchSnapshot();
  expect(appState.state("labels")).toMatchSnapshot();
});

it("passes the projects (with embedded label info) to it's child <App />", () => {
  appState.setState({
    projects: jsonFile.projects,
    labels: jsonFile.labels
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
    }
  ]);
});

it("passes the title state to it's child <App />", () => {
  const title = appState.state("title");
  expect(appState.find(App).prop("title")).toBe(title);
});

it("updates the projects state if the dropped file is json", async function() {
  const mockFile = { MOCK: "FILE" };
  await appState.instance().handleFileDrop(mockFile);
  expect(readFileAsText).toHaveBeenCalledWith(mockFile);
  expect(appState.state("title")).toEqual(jsonFile.title);
  expect(appState.state("projects")).toEqual(jsonFile.projects);
  expect(appState.state("labels")).toEqual(jsonFile.labels);
});
