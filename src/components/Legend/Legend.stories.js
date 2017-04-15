// @flow

import React from "react";
import { storiesOf } from "@kadira/storybook";
import { Legend } from "../Legend";

const labels = [
  {
    id: "3",
    initial: "A",
    colour: "#f00",
    title: "Apple"
  },
  {
    id: "4",
    initial: "O",
    colour: "#0f0",
    title: "Lime"
  }
];

storiesOf("Legend", module)
  .add("one label", () => <Legend labels={labels.slice(0, 1)} />)
  .add("two label", () => <Legend labels={labels} />);
