// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { LegendPresentation } from "../Legend";

const labels = [
  {
    id: "3",
    initial: "A",
    colour: "#ff0",
    title: "Apple",
  },
  {
    id: "4",
    initial: "O",
    colour: "#0ff",
    title: "Orange",
  },
];

it("contains a <Label /> and title for each used label", () => {
  render(<LegendPresentation labels={labels} />);
  expect(screen.getByText("A")).toBeInTheDocument();
  expect(screen.getByText("O")).toBeInTheDocument();
});

it("uses readonly <Label />s", () => {
  render(<LegendPresentation labels={labels.slice(0, 1)} />);
  expect(screen.getByTitle("Apple")).not.toHaveRole("button");
  expect(screen.getByTitle("Apple")).toHaveTextContent("A");
});

it("displays the labels title", () => {
  render(<LegendPresentation labels={labels.slice(0, 1)} />);
  expect(screen.getByText("Apple")).toHaveClass("Legend-labelTitle");
});
