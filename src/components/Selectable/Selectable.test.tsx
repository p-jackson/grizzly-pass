// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import Selectable from "../Selectable";

// const selectable = shallow(<Selectable>child text</Selectable>);

it("renders the child text", () => {
  const { container } = render(<Selectable>child text</Selectable>);
  expect(container).toHaveTextContent("child text");
});

// Brittle test, but selectable should use an element
// that is `display: inline` by default.
it("uses a <span> for the selectable element", () => {
  render(<Selectable>child text</Selectable>);
  expect(screen.getByText("child text").tagName).toBe("SPAN");
});

it("adds the `enableSelection` class", () => {
  render(<Selectable>child text</Selectable>);
  expect(screen.getByText("child text")).toHaveClass("enableSelection");
});
