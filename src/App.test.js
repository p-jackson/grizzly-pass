import React from "react";
import { shallow } from "enzyme";
import ReactDOM from "react-dom";
import App from "./App";

const app = shallow(<App />);

it("shows the project name in a heading", () => {
  expect(app.find("h2").text()).toBe("grizzly-pass");
});

it("shows the url", () => {
  expect(app.find("p").text()).toBe("https://grizzly-pass.surge.sh");
});
