import * as React from "react";
import { shallow } from "enzyme";
import Logo from "../Logo";

const logo = shallow(<Logo />);

it("contains the letters GP", () => {
  expect(logo.text()).toBe("GP");
});
