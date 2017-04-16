// @flow

import { storiesOf } from "@kadira/storybook";
import { number, select } from "@kadira/storybook-addon-knobs";
import React from "react";
import { host } from "storybook-host";
import { statusIds } from "../../types";
import ProgressBar from "../ProgressBar";

const statusOptions = statusIds.reduce(
  (memo, status) => ({
    ...memo,
    [status]: status
  }),
  {}
);

storiesOf("ProgressBar", module)
  .addDecorator(
    host({
      title: "Progress bar that also displays project health.",
      align: "center middle",
      width: 400
    })
  )
  .add("", () => (
    <ProgressBar
      progress={number("progress", 20)}
      status={select("status", statusOptions, "ontrack")}
    />
  ));
