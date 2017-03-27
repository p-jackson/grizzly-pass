import React from "react";
import { storiesOf } from "@kadira/storybook";
import { text, color } from "@kadira/storybook-addon-knobs";
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
    const colour = color("colour", "green");
    return <Label initial={initial} colour={colour} />;
  });
