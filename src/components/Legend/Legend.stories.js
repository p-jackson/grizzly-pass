// @flow

import React from "react";
import { storiesOf } from "@kadira/storybook";
import Legend from "../Legend";

const projects = [
  {
    labels: []
  },
  {
    labels: [
      {
        id: "3",
        initial: "A",
        colour: "#f00",
        title: "Apple"
      }
    ]
  },
  {
    labels: [
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
    ]
  }
];

storiesOf("Legend", module)
  .add("one label", () => <Legend projects={projects.slice(0, 2)} />)
  .add("two label", () => <Legend projects={projects} />);
