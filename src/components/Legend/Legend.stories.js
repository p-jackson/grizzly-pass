// @flow

import { storiesOf } from "@kadira/storybook";
import React from "react";
import { LegendPresentation } from "../Legend";

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
  .add("one label", () => <LegendPresentation labels={labels.slice(0, 1)} />)
  .add("two label", () => <LegendPresentation labels={labels} />);
