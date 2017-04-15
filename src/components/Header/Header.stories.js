// @flow

import React from "react";
import { storiesOf } from "@kadira/storybook";
import { text } from "@kadira/storybook-addon-knobs";
import { host } from "storybook-host";
import { Header } from "../Header";

storiesOf("Header", module)
  .addDecorator(
    host({
      title: "App header that also display document title.",
      align: "center middle",
      width: "100%",
      height: 60
    })
  )
  .add("with document title", () => (
    <Header title={text("title", "Top Projects 2017")} />
  ))
  .add("without document title", () => <Header title={null} />);
