import { addDecorator, configure } from "@kadira/storybook";
import { withKnobs } from "@kadira/storybook-addon-knobs";
import "../src/index.css";

addDecorator(withKnobs);

const req = require.context("../src", true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
