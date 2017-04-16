// @flow

import { storiesOf } from "@kadira/storybook";
import { text, color, boolean } from "@kadira/storybook-addon-knobs";
import React from "react";
import { host } from "storybook-host";
import Label from "../Label";

storiesOf("Label", module)
  .addDecorator(
    host({
      title: "Labels for projects.",
      align: "center middle"
    })
  )
  .add("", () => {
    const initial = text("initial", "L");
    const title = text("title", "Lemon");
    const colour = color("colour", "green");
    const readonly = boolean("readonly", true);
    return (
      <Label
        readonly={readonly}
        labelInfo={{
          id: "1",
          initial,
          colour,
          title
        }}
      />
    );
  });
