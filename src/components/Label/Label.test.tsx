// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import Label from "../Label";

function createTestLabel({
  initial = "",
  title = "",
  colour = "",
}: {
  initial?: string;
  title?: string;
  colour?: string;
} = {}) {
  return { id: "1", initial, colour, title };
}

it("renders the label's initial", () => {
  const label = createTestLabel({ initial: "A", title: "test title" });
  render(<Label labelInfo={label} readonly />);
  expect(screen.getByTitle("test title")).toHaveTextContent("A");
});

it("renders the label's initial in button (when not read-only)", () => {
  const label = createTestLabel({ initial: "A" });
  render(<Label labelInfo={label} readonly={false} />);
  expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
});

it("applies the colour prop as a background style", () => {
  const label = createTestLabel({ colour: "#f00", title: "test title" });
  render(<Label labelInfo={label} readonly />);
  expect(screen.getByTitle("test title")).toHaveStyle({
    background: "#f00",
  });
});

it("applies the colour prop as a background style (when not read-only)", () => {
  const label = createTestLabel({ initial: "A", colour: "#f00" });
  render(<Label labelInfo={label} readonly={false} />);
  expect(screen.getByRole("button", { name: "A" })).toHaveStyle({
    background: "#f00",
  });
});

it("has a button with a tooltip with the label's title (when not read-only)", () => {
  const label = createTestLabel({ initial: "A", title: "Apple" });
  render(<Label labelInfo={label} readonly={false} />);
  expect(screen.getByRole("button", { name: "A" })).toHaveAttribute(
    "title",
    "Apple",
  );
});
