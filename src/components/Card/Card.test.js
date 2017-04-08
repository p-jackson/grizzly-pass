// @flow

import React from "react";
import { shallow } from "enzyme";
import moment from "moment";
import Card from "../Card";
import Selectable from "../Selectable";
import ProgressBar from "../ProgressBar";
import Label from "../Label";
import type { ProjectWithLabelInfo, Status, LabelInfo } from "../../types";

function renderCard(
  {
    title = "",
    person = "",
    time = moment().toISOString(),
    progress = 0,
    status = "ontrack",
    labels = [],
    readonly,
    handleProjectChange = jest.fn()
  }: {
    title?: string,
    person?: string,
    time?: string,
    progress?: number,
    status?: Status,
    labels?: LabelInfo[],
    readonly?: boolean,
    handleProjectChange?: (ProjectWithLabelInfo) => void
  } = {}
) {
  return shallow(
    <Card
      project={{
        id: "id113",
        title,
        person,
        time,
        progress,
        status,
        labels
      }}
      readonly={readonly}
      onProjectChange={handleProjectChange}
    />
  );
}

it("renders the title as selectable text", () => {
  const card = renderCard({ title: "The Title" });
  expect(card.find(".Card-title").find(Selectable).prop("children")).toBe(
    "The Title"
  );
});

it("renders the title as <input> text when not readonly", () => {
  const card = renderCard({ title: "The Title", readonly: false });
  expect(card.find(".Card-title").find("input").prop("value")).toBe(
    "The Title"
  );
});

it("renders the person as selectable text", () => {
  const card = renderCard({ person: "Joe Lemon" });
  expect(card.find(".Card-person").find(Selectable).prop("children")).toBe(
    "Joe Lemon"
  );
});

it("renders the person as <input> text when not readonly", () => {
  const card = renderCard({ person: "Joe Lemon", readonly: false });
  expect(card.find(".Card-person").find("input").prop("value")).toBe(
    "Joe Lemon"
  );
});

it("renders the date as selectable text", () => {
  const card = renderCard({ time: "2017-03-15T10:47:10.562Z" });
  expect(card.find(".Card-date").find(Selectable).prop("children")).toBe(
    "15 March"
  );
});

it("passes the progress and status props to the <ProgressBar>", () => {
  const card = renderCard({ progress: 30, status: "ontrack" });
  expect(card.find(ProgressBar).props()).toEqual({
    progress: 30,
    status: "ontrack"
  });
});

it("has no labels by default", () => {
  const card = renderCard();
  expect(card.find(".Card-labels").length).toBe(0);
  expect(card.find(Label).length).toBe(0);
});

it("renders a <Label /> for each labels prop", () => {
  const labels = [
    { id: "1", initial: "A", colour: "#f00", title: "Apple" },
    { id: "2", initial: "B", colour: "#0f0", title: "Brick" }
  ];
  const card = renderCard({ labels });
  expect(card.find(Label).length).toBe(2);
});

it("passes label props down to <Label />", () => {
  const labels = [{ id: "1", initial: "A", colour: "#f00", title: "Apple" }];
  const card = renderCard({ labels });
  expect(card.find(Label).props()).toEqual({
    labelInfo: {
      id: "1",
      initial: "A",
      colour: "#f00",
      title: "Apple"
    }
  });
});

it("calls onProjectChange when the title field is changed", () => {
  const handleProjectChange = jest.fn();
  renderCard({ handleProjectChange, readonly: false })
    .find(".Card-title input")
    .simulate("change", { target: { value: "New Text" } });
  expect(handleProjectChange).toHaveBeenCalled();
  expect(handleProjectChange.mock.calls[0][0]).toMatchObject({
    title: "New Text"
  });
});

it("calls onProjectChange when the person field is changed", () => {
  const handleProjectChange = jest.fn();
  renderCard({ handleProjectChange, readonly: false })
    .find(".Card-person input")
    .simulate("change", { target: { value: "New Text" } });
  expect(handleProjectChange).toHaveBeenCalled();
  expect(handleProjectChange.mock.calls[0][0]).toMatchObject({
    person: "New Text"
  });
});
