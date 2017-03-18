import React from "react";
import { shallow } from "enzyme";
import SideMenu from "./SideMenu";

const sideMenu = shallow(<SideMenu />);

it("renders as a div", () => {
  expect(sideMenu.first().type()).toBe("div");
});
