import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import Header from "./Header";

const app = shallow(<App />);

it("shows a header", () => {
  expect(app.find(Header).length).toBe(1);
});

it("shows the url", () => {
  expect(app.find("p").text()).toBe("https://grizzly-pass.surge.sh");
});
