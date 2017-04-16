// @flow

import { shallow } from "enzyme";
import React from "react";
import Logo from "../Logo";

const logo = shallow(<Logo />);

it("contains the letters GP", () => {
  expect(logo.text()).toBe("GP");
});
