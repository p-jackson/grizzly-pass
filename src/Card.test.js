import React from "react";
import { shallow } from "enzyme";
import Card from "./Card";
import Selectable from "./Selectable";
import ProgressBar from "./ProgressBar";

const card = shallow(
  <Card title="The Title" person="Joe Lemon" progress={30} status="ontrack" />
);

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

it("passes the progress and status props to the <ProgressBar>", () => {
  expect(card.find(ProgressBar).props()).toEqual({
    progress: 30,
    status: "ontrack"
  });
});
