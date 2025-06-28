import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { select } from "@storybook/addon-knobs";
import { host } from "storybook-host";
import { tabIds, TabId } from "../../types";
import { SideMenuPresentation } from "../SideMenu";

const selectedOptions: (TabId | "<undefined>")[] = [...tabIds, "<undefined>"];

storiesOf("SideMenu", module)
  .addDecorator(
    host({
      title: "Main navigation control.",
      align: "center middle",
      height: "100%",
      width: 60,
    }),
  )
  .add("", () => (
    <SideMenuPresentation
      selectTab={action("tab change")}
      selectedTab={toOptional(
        select("selected", selectedOptions, "<undefined>"),
      )}
    />
  ));

function toOptional(selected: TabId | "<undefined>"): TabId | undefined {
  if (selected === "<undefined>") return undefined;
  else return selected;
}
