// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { tabIds } from "../../types";
import { SideMenuPresentation } from "../SideMenu";

it("contains a single button", () => {
  render(<SideMenuPresentation selectTab={vi.fn()} selectedTab={undefined} />);
  expect(screen.getAllByRole("button")).toHaveLength(1);
});

it("has an edit button with `Edit` text", () => {
  render(<SideMenuPresentation selectTab={vi.fn()} selectedTab={undefined} />);
  expect(screen.getByTestId("tabButton-edit")).toHaveTextContent("Edit");
});

it("selects the edit button when selectedTab is `edit`", () => {
  const handleTabChange = vi.fn();

  render(
    <SideMenuPresentation selectTab={handleTabChange} selectedTab="edit" />,
  );

  expect(screen.getByTestId("tabButton-edit")).toHaveClass("isSelected");
});

describe("onTabChange", () => {
  tabIds.forEach((tabId, i) => {
    it(`is called with "${tabId}" when button "${i}" is clicked`, async () => {
      const user = userEvent.setup();
      const handleTabChange = vi.fn();

      render(
        <SideMenuPresentation
          selectTab={handleTabChange}
          selectedTab={undefined}
        />,
      );
      await user.click(screen.getByTestId(`tabButton-${tabId}`));

      expect(handleTabChange).toHaveBeenCalledWith(tabId);
    });
  });

  tabIds.forEach((tabId, i) => {
    it(`is called with "undefined" when button "${i}" selected and clicked again`, async () => {
      const user = userEvent.setup();
      const handleTabChange = vi.fn();

      render(
        <SideMenuPresentation
          selectTab={handleTabChange}
          selectedTab={tabId}
        />,
      );
      await user.click(screen.getByTestId(`tabButton-${tabId}`));

      expect(handleTabChange).toHaveBeenCalledWith(undefined);
    });
  });
});
