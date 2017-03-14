import React from "react";
import { shallow } from "enzyme";
import Header from "./Header";
import Logo from "./Logo";

const header = shallow(<Header />);

it("contains a logo", () => {
  expect(header.find(Logo).length).toBe(1);
});
