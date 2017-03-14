import React from "react";
import { shallow } from "enzyme";
import Card from "./Card";
import Selectable from "./Selectable";

const card = shallow(<Card title="The Title" person="Joe Lemon" />);

it("renders the title as selectable text", () => {
  expect(card.find(".Card-title").find(Selectable).prop("children")).toBe(
    "The Title"
  );
});

it("renders the person as selectable text", () => {
  expect(card.find(".Card-person").find(Selectable).prop("children")).toBe(
    "Joe Lemon"
  );
});
