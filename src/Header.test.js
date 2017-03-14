import React from "react";
import { shallow } from "enzyme";
import Header from "./Header";
import Logo from "./Logo";

const header = shallow(<Header title="Projects 2017" />);

it("contains a logo", () => {
  expect(header.find(Logo).length).toBe(1);
});

it("renders the document title", () => {
  expect(header.find("h1").text()).toBe("Projects 2017");
});

it("doesn't have a header element when there's no title", () => {
  const header = shallow(<Header />);
  expect(header.find("h1").length).toBe(0);
});
