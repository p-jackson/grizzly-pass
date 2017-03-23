import React from "react";
import { shallow } from "enzyme";
import Label from "../Label";

const label = shallow(<Label initial="A" colour="#f00" />);

it("renders the label's initial", () => {
  expect(label.text()).toBe("A");
});

it("applies the colour prop as a background style", () => {
  expect(label.prop("style")).toMatchObject({
    background: "#f00"
  });
});
