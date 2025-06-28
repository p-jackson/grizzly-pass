import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { text, number, select, boolean } from "@storybook/addon-knobs";
import { host } from "storybook-host";
import { statusIds } from "../../types";
import { CardPresentation } from "../Card";

const statusOptions = statusIds.reduce(
  (memo, status) => ({
    ...memo,
    [status]: status,
  }),
  {},
);

storiesOf("Card", module)
  .addDecorator(
    host({
      title: "Info card that displays project health.",
      align: "center middle",
    }),
  )
  .add("project with no labels", () => (
    <CardPresentation
      project={{
        id: "id113",
        title: text("title", "Battle Bunny 2.0"),
        person: text("person", "Alex Jenkins"),
        progress: number("progress", 55),
        time: text("time", "2016-08-03T23:00:00Z"),
        status: select("status", statusOptions, "ontrack"),
        labels: [],
      }}
      labelInfo={[]}
      readonly={boolean("readonly", true)}
      updateProject={action("update project")}
    />
  ))
  .add("project with labels", () => (
    <CardPresentation
      project={{
        id: "id113",
        title: text("title", "Battle Bunny 2.0"),
        person: text("person", "Alex Jenkins"),
        progress: number("progress", 55),
        time: text("time", "2016-08-03T23:00:00Z"),
        status: select("status", statusOptions, "ontrack"),
        labels: ["1", "2"],
      }}
      labelInfo={[
        { id: "1", initial: "A", colour: "red", title: "Apple" },
        { id: "2", initial: "B", colour: "blue", title: "Bear" },
      ]}
      readonly={boolean("readonly", true)}
      updateProject={action("update project")}
    />
  ))
  .add("placeholder text when inputs are empty", () => (
    <CardPresentation
      project={{
        id: "id113",
        title: "",
        person: "",
        progress: number("progress", 55),
        time: text("time", "2016-08-03T23:00:00Z"),
        status: select("status", statusOptions, "ontrack"),
        labels: ["1", "2"],
      }}
      labelInfo={[
        { id: "1", initial: "A", colour: "red", title: "Apple" },
        { id: "2", initial: "B", colour: "blue", title: "Bear" },
      ]}
      readonly={false}
      updateProject={action("update project")}
    />
  ));
