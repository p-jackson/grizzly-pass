import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import Header from "./Header";
import Card from "./Card";

const app = shallow(<App />);

it("shows a header", () => {
  expect(app.find(Header).length).toBe(1);
});

it("passes the dummy document title to the header", () => {
  expect(app.find(Header).prop("title")).toBe("Dummy Projects 2017");
});

it("shows a dummy project card with dummy fields", () => {
  expect(app.find(Card).props()).toMatchObject({
    title: "Coffee Swirl",
    person: "Joe Lemon",
    progress: 13,
    status: "ontrack"
  });
});
