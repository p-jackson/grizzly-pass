import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import Header from "./Header";
import Card from "./Card";

const projects = [
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
];

const handleFileDrop = jest.fn();
const app = shallow(
  <App title="Dummy Projects 2020" onFileDrop={handleFileDrop} />
);

beforeEach(() => {
  handleFileDrop.mockClear();
});

it("shows a header", () => {
  expect(app.find(Header).length).toBe(1);
});

it("passes the dummy document title to the header", () => {
  expect(app.find(Header).prop("title")).toBe("Dummy Projects 2020");
});

it("contains no cards when passed no projects", () => {
  expect(app.find(Card).length).toBe(0);
});

it("shows a card for each project passed in", () => {
  const app = shallow(<App projects={projects} onFileDrop={handleFileDrop} />);
  expect(app.find(Card).length).toBe(projects.length);
});

it("passes project props to the <Card />", () => {
  const app = shallow(
    <App projects={projects.slice(0, 1)} onFileDrop={handleFileDrop} />
  );
  expect(app.find(Card).props()).toEqual({
    title: "Coffee Swirl",
    person: "Joe Lemon",
    time: "2017-03-15T10:54:04.445Z",
    progress: 13,
    status: "ontrack"
  });
});

it("splits projects into months", () => {
  const app = shallow(<App projects={projects} onFileDrop={handleFileDrop} />);
  const monthColumns = app.find(".App-month");
  expect(monthColumns.length).toBe(2);
  expect(monthColumns.at(0).find(Card).length).toBe(1);
  expect(monthColumns.at(1).find(Card).length).toBe(1);
});

it("renders month names at the top of the columns", () => {
  const app = shallow(<App projects={projects} onFileDrop={handleFileDrop} />);
  const monthColumns = app.find(".App-month .App-monthTitle");
  expect(monthColumns.at(0).text()).toBe("March");
  expect(monthColumns.at(1).text()).toBe("April");
});

it("prevents default event handling on dragover", () => {
  const preventDefault = jest.fn();
  app.simulate("dragover", { preventDefault });
  expect(preventDefault).toHaveBeenCalled();
});

it("prevents default event handling on drop", () => {
  const preventDefault = jest.fn();
  app.simulate("drop", { preventDefault, dataTransfer: { files: [] } });
  expect(preventDefault).toHaveBeenCalled();
});

it("calls drop handler when browser support the DataTransferItemList interface", () => {
  const mockFile = { MOCK: "FILE" };
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
  app.simulate("drop", {
    preventDefault: () => {},
    dataTransfer: {
      files: [mockFile]
    }
  });
  expect(handleFileDrop).toHaveBeenCalledWith(mockFile);
});

it("doesn't call drop handler it wasn't a file that was dropped", () => {
  app.simulate("drop", {
    preventDefault: () => {},
    dataTransfer: {
      items: [{ kind: "string", getAsFile: () => {} }]
    }
  });
  expect(handleFileDrop).not.toHaveBeenCalled();
});
