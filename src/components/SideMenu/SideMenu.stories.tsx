import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { select } from "@storybook/addon-knobs";
import * as React from "react";
import { host } from "storybook-host";
import { tabIds } from "../../types";
import { SideMenuPresentation } from "../SideMenu";

const selectedOptions = tabIds.reduce(
  (memo, tabId) => ({
    ...memo,
    [tabId]: tabId
  }),
  {
    "<undefined>": undefined
  }
);

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
      selectedTab={select("selected", selectedOptions, "<undefined>")}
    />
  ));
