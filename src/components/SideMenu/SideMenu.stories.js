// @flow

import { storiesOf, action } from "@kadira/storybook";
import { select } from "@kadira/storybook-addon-knobs";
import React from "react";
import { host } from "storybook-host";
import { tabIds } from "../../types";
import { SideMenuPresentation } from "../SideMenu";

const selectedOptions = [null, ...tabIds];

storiesOf("SideMenu", module)
  .addDecorator(
    host({
      title: "Main navigation control.",
      align: "center middle",
      height: "100%",
      width: 60
    })
  )
  .add("", () => (
    <SideMenuPresentation
      selectTab={action("tab change")}
      selectedTab={select("selected", selectedOptions, null)}
    />
  ));
