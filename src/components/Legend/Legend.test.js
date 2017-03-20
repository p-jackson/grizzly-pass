import React from "react";
import { shallow } from "enzyme";
import Legend from "./Legend";
import Label from "../Label";

const projects = [
  {
    // project with no labels
  },
  {
    labels: [
      {
        id: "3",
        initial: "A",
        colour: "#ff0",
        title: "Apple"
      }
    ]
  },
  {
    labels: [
      {
        id: "3",
        initial: "A",
        colour: "#ff0",
        title: "Apple"
      },
      {
        id: "4",
        initial: "O",
        colour: "#0ff",
        title: "Orange"
      }
    ]
  }
];

const legend = shallow(<Legend projects={projects} />);

it("contains a <Label /> and title for each used label", () => {
  expect(legend.find(Label).length).toBe(2);
  expect(legend.find(".Legend-labelTitle").length).toBe(2);
});

it("passes label colour and initial to <Label /> props", () => {
  const legend = shallow(<Legend projects={projects.slice(1, 2)} />);
  expect(legend.find(Label).props()).toEqual({
    initial: "A",
    colour: "#ff0"
  });
});

it("displays the labels title", () => {
  const legend = shallow(<Legend projects={projects.slice(1, 2)} />);
  expect(legend.find(".Legend-labelTitle").text()).toBe("Apple");
});
