// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { HeaderPresentation } from "../Header";

it("contains a logo", () => {
  render(<HeaderPresentation title="Projects 2017" />);
  expect(screen.getByText("GP")).toHaveClass("Logo");
});

it("renders the document title in selectable text", () => {
  render(<HeaderPresentation title="Projects 2017" />);
  expect(screen.getByRole("heading")).toHaveTextContent("Projects 2017");
});

it("doesn't have a header element when there's no title", () => {
  render(<HeaderPresentation />);
  expect(screen.queryByRole("heading")).not.toBeInTheDocument();
});
