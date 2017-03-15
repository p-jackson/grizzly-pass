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
    }
  ]
};

const readFileAsText = jest.fn(() => JSON.stringify(jsonFile));
const appState = shallow(<AppState readFileAsText={readFileAsText} />);

it("uses the demo data as it's default projects state", () => {
  expect(appState.state("projects")).toMatchSnapshot();
});

it(`uses the title "Demo Dashboard" by default`, () => {
  expect(appState.state("title")).toBe("Demo Dashboard");
});

it("passes the projects state to it's child <App />", () => {
  const projects = appState.state("projects");
  expect(appState.find(App).prop("projects")).toBe(projects);
});

it("passes the title state to it's child <App />", () => {
  const title = appState.state("title");
  expect(appState.find(App).prop("title")).toBe(title);
});

it("updates the projects state if the dropped file is json", async function() {
  const mockFile = { MOCK: "FILE" };
  await appState.instance().handleFileDrop(mockFile);
  expect(readFileAsText).toHaveBeenCalledWith(mockFile);
  expect(appState.state("projects")).toEqual(jsonFile.projects);
});
