import React from "react";
import { shallow } from "enzyme";
import Card from "./Card";

const card = shallow(<Card title="The Title" person="Joe Lemon" />);

it("renders the title", () => {
  expect(card.find(".Card-title").text()).toBe("The Title");
});

it("renders the person", () => {
  expect(card.find(".Card-person").text()).toBe("Joe Lemon");
});
