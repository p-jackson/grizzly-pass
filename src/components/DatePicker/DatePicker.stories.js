// @flow

import { storiesOf } from "@kadira/storybook";
import { boolean } from "@kadira/storybook-addon-knobs";
import React from "react";
import { host } from "storybook-host";
import DatePicker from "../DatePicker";

storiesOf("DatePicker", module)
  .addDecorator(
    host({
      title: "Display and edits dates.",
      align: "top left"
    })
  )
  .add("", () => (
    <DatePicker
      time="2017-04-08T11:04:13.234Z"
      readonly={boolean("readonly", false)}
      onTimeChange={() => {}}
    />
  ));
