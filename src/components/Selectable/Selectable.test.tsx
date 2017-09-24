import { shallow } from "enzyme";
import * as React from "react";
import Selectable from "../Selectable";

const selectable = shallow(<Selectable>child text</Selectable>);

it("renders the child text", () => {
  expect(selectable.text()).toBe("child text");
});

// Brittle test, but selectable should use an element
// that is `display: inline` by default.
it("uses a <span> for the selectable element", () => {
  expect(selectable.first().type()).toBe("span");
});

it("adds the `enableSelection` class", () => {
  expect(
    selectable
      .first()
      .prop("className")
      .split(" ")
  ).toContain("enableSelection");
});
