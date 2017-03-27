import React from "react";
import { storiesOf } from "@kadira/storybook";
import { host } from "storybook-host";
import Logo from "../Logo";

storiesOf("Logo", module)
  .addDecorator(
    host({
      title: "Main app logo.",
      align: "center middle",
      height: 60,
      width: 60
    })
  )
  .add("", () => <Logo />);
