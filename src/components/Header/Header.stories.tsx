import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import { host } from "storybook-host";
import { HeaderPresentation } from "../Header";

storiesOf("Header", module)
  .addDecorator(
    host({
      title: "App header that also display document title.",
      align: "center middle",
      width: "100%",
      height: 60,
    }),
  )
  .add("with document title", () => (
    <HeaderPresentation title={text("title", "Top Projects 2017")} />
  ))
  .add("without document title", () => <HeaderPresentation />);
