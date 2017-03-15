import React from "react";
import { shallow } from "enzyme";
import Card from "./Card";
import Selectable from "./Selectable";
import ProgressBar from "./ProgressBar";

const card = shallow(
  <Card
    title="The Title"
    person="Joe Lemon"
    time="2017-03-15T10:47:10.562Z"
    progress={30}
    status="ontrack"
  />
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

it("renders the date as selectable text", () => {
  expect(card.find(".Card-date").find(Selectable).prop("children")).toBe(
    "15 March"
  );
});

it("passes the progress and status props to the <ProgressBar>", () => {
  expect(card.find(ProgressBar).props()).toEqual({
    progress: 30,
    status: "ontrack"
  });
});
