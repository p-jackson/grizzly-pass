import React from "react";
import { storiesOf, action } from "@kadira/storybook";
import { text, number, select, boolean } from "@kadira/storybook-addon-knobs";
import { host } from "storybook-host";
import Card from "../Card";
import { statusIds } from "../../types";

const statusOptions = statusIds.reduce(
  (memo, status) => ({
    ...memo,
    [status]: status
  }),
  {}
);

storiesOf("Card", module)
  .addDecorator(
    host({
      title: "Info card that displays project health.",
      align: "center middle"
    })
  )
  .add("project with no labels", () => (
    <Card
      project={{
        title: text("title", "Battle Bunny 2.0"),
        person: text("person", "Alex Jenkins"),
        progress: number("progress", 55),
        time: text("time", "2016-08-03T23:00:00Z"),
        status: select("status", statusOptions, "ontrack")
      }}
      readonly={boolean("readonly", true)}
      onProjectChange={action("project change")}
    />
  ))
  .add("project with labels", () => (
    <Card
      project={{
        title: text("title", "Battle Bunny 2.0"),
        person: text("person", "Alex Jenkins"),
        progress: number("progress", 55),
        time: text("time", "2016-08-03T23:00:00Z"),
        status: select("status", statusOptions, "ontrack"),
        labels: [
          { id: "1", initial: "A", colour: "red" },
          { id: "2", initial: "B", colour: "blue" }
        ]
      }}
      readonly={boolean("readonly", true)}
      onProjectChange={action("project change")}
    />
  ));
