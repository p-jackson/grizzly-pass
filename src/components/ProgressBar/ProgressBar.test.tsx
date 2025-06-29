// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { statusIds } from "../../types";
import ProgressBar from "../ProgressBar";

const statusText = ["On Track", "At Risk", "Intervention Required", "On Hold"];

it("uses the progress prop to set the bar's width percentage", () => {
  render(<ProgressBar progress={30} status="ontrack" />);
  expect(screen.getByTestId("ProgressBar-inner")).toHaveStyle({
    width: "30%",
  });
});

describe("status styling", () => {
  statusIds.forEach((status, index) => {
    it(`applies the css class for the "${status}" status`, () => {
      render(<ProgressBar progress={30} status={status} />);
      expect(screen.getByText(statusText[index]).parentElement).toHaveClass(
        `isStatus-${status}`,
      );
    });
  });
});

describe("status text", () => {
  statusIds.forEach((status, index) => {
    it(`displays status text for "${status}" status`, () => {
      render(<ProgressBar progress={30} status={status} />);
      expect(screen.getByText(statusText[index])).toBeInTheDocument();
    });

    it(`displays "Done" text when progress is 100% for project with "${status}" status`, () => {
      render(<ProgressBar progress={100} status={status} />);
      expect(screen.getByText("Done").parentElement).toHaveClass(
        `isStatus-${status}`,
      );
    });
  });
});
