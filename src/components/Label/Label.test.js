// @flow

import React from "react";
import { shallow } from "enzyme";
import Label from "../Label";

const label = shallow(
  <Label
    labelInfo={{ initial: "A", colour: "#f00", id: "1", title: "Apple" }}
  />
);

it("renders the label's initial", () => {
  expect(label.text()).toBe("A");
});

it("applies the colour prop as a background style", () => {
  expect(label.prop("style")).toMatchObject({
    background: "#f00"
  });
});

it("has a tooltip with the label's title", () => {
  expect(label.first().prop("title")).toBe("Apple");
});
