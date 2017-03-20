import React from "react";
import { shallow } from "enzyme";
import Card from "./Card";
import Selectable from "../Selectable";
import ProgressBar from "../ProgressBar";
import Label from "../Label";

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

it("has no labels by default", () => {
  expect(card.find(".Card-labels").length).toBe(0);
  expect(card.find(Label).length).toBe(0);
});

it("renders a <Label /> for each labels prop", () => {
  const labels = [
    { id: "1", initial: "A", colour: "#f00" },
    { id: "2", initial: "B", colour: "#0f0" }
  ];
  const card = shallow(
    <Card
      title="The Title"
      person="Joe Lemon"
      time="2017-03-15T10:47:10.562Z"
      progress={30}
      status="ontrack"
      labels={labels}
    />
  );
  expect(card.find(Label).length).toBe(2);
});

it("passes label props down to <Label />", () => {
  const card = shallow(
    <Card
      title="The Title"
      person="Joe Lemon"
      time="2017-03-15T10:47:10.562Z"
      progress={30}
      status="ontrack"
      labels={[{ id: "1", initial: "A", colour: "#f00" }]}
    />
  );
  expect(card.find(Label).props()).toEqual({
    initial: "A",
    colour: "#f00"
  });
});
